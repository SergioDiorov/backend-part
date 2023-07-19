import request from 'supertest';
import mongoose from 'mongoose';

import app from 'server';
import User from 'models/user';
import { generateTokens, saveToken } from 'service/token-service';
import * as tokenService from 'service/token-service';

describe('POST /authUser/signup - registration', () => {
  it('should create a new user when email is not registered', async () => {
    const user = {
      userName: 'Test1',
      email: 'testSignUp1@gmail.com',
      password: 'qweasd',
      admin: false,
    };

    const response = await request(app).post('/authUser/signup').send(user);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.user).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    await User.deleteOne({ _id: response.body.user.id });
  });

  it('should return 409 when email is already registered', async () => {
    const firstSignUp = await User.create({
      userName: 'Test2',
      email: 'testSignUp2@gmail.com',
      password: 'qweasd',
      admin: false,
    });

    const existingUser = {
      userName: 'Test2',
      email: 'testSignUp2@gmail.com',
      password: 'qweasd',
      admin: false,
    };

    const response = await request(app)
      .post('/authUser/signup')
      .send(existingUser);

    await User.deleteOne({ _id: firstSignUp._id });

    expect(response.status).toBe(409);
    expect(response.body.code).toBe(409);
    expect(response.body.message).toBe('Email is already registered');
  });

  it('should create a new user when admin is not in arguments', async () => {
    const user = {
      userName: 'Test3',
      email: 'testSignUp3@gmail.com',
      password: 'qweasd',
    };

    const response = await request(app).post('/authUser/signup').send(user);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.user).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    await User.deleteOne({ _id: response.body.user.id });
  });
});

describe('POST /authUser/signin - autorisation', () => {
  it('should return success when email and password are correct', async () => {
    const user = {
      email: 'testSignIn1@gmail.com',
      password: 'qweasd',
    };

    const registerUser = await request(app).post('/authUser/signup').send({
      userName: 'fakeUserSignIn1',
      email: 'testSignIn1@gmail.com',
      password: 'qweasd',
      admin: false,
    });

    const response = await request(app).post('/authUser/signin').send(user);

    await User.deleteOne({ _id: registerUser.body.user.id });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.user).toBeDefined();
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it('should return 401 and wrong email message', async () => {
    const user = {
      email: 'worng@gmail.com',
      password: 'qweasd',
    };

    const response = await request(app).post('/authUser/signin').send(user);

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Wrong email');
  });

  it('should return 401 and wrong password message', async () => {
    let signUpUser = await User.create({
      userName: 'fakeUserSignIn2',
      email: 'testSignIn2@gmail.com',
      password: 'qweasd',
    });

    const user = {
      email: 'testSignIn2@gmail.com',
      password: 'wrong',
    };

    const response = await request(app).post('/authUser/signin').send(user);

    await User.deleteOne({ _id: signUpUser._id });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Wrong password');
  });
});

describe('POST /authUser/signout', () => {
  it('should return success when signed out', async () => {
    const user = {
      email: 'fakeUserSignOut1@gmail.com',
      password: 'qwerty',
    };

    const response = await request(app).post('/authUser/signout').send();

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.token.acknowledged).toBeTruthy();
  });

  it('should sign out user and clear refreshToken cookie', async () => {
    const fakeUser = await User.create({
      userName: 'fakeSignOut2',
      email: 'fakeUserSignOut2@gmail.com',
      password: 'qwerty',
      admin: false,
    });

    const fakeTokens = generateTokens({
      email: fakeUser.email,
      id: fakeUser._id,
    });
    await saveToken(fakeUser._id, fakeTokens.refreshToken);

    const response = await request(app)
      .post('/authUser/signout')
      .set('Cookie', `refreshToken=${fakeTokens.refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.token.acknowledged).toBeTruthy();

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const refreshTokenCookie = cookies.find((cookie: any) =>
      cookie.startsWith('refreshToken')
    );
    expect(refreshTokenCookie).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    await User.deleteOne({ _id: fakeUser._id });
  });

  it('should handle error when signing out', async () => {
    jest
      .spyOn(tokenService, 'removeToken')
      .mockRejectedValue(new Error('Error while removing token'));

    const fakeUser = await User.create({
      userName: 'fakeSignOut3',
      email: 'fakeUserSignOut3@gmail.com',
      password: 'qwerty',
    });

    const fakeTokens = generateTokens({
      email: fakeUser.email,
      id: fakeUser._id,
    });

    await saveToken(fakeUser._id, fakeTokens.refreshToken as string);

    const response = await request(app)
      .post('/authUser/signout')
      .set('Cookie', `refreshToken=${fakeTokens.refreshToken}`);

    expect(response.status).toBe(500);

    jest.spyOn(tokenService, 'removeToken').mockRestore();

    await User.deleteOne({ _id: fakeUser._id });
  });
});

describe('GET /authUser/refresh', () => {
  it('should refresh tokens and return new tokens and user data', async () => {
    const fakeUser = await User.create({
      userName: 'fakeRefresh1',
      email: 'fakeUserRefresh1@gmail.com',
      password: 'qwerty',
    });

    const fakeTokens = generateTokens({
      email: fakeUser.email,
      id: fakeUser._id,
    });
    await saveToken(fakeUser._id, fakeTokens.refreshToken);

    const response = await request(app)
      .get('/authUser/refresh')
      .set('Cookie', `refreshToken=${fakeTokens.refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.user.email).toBe(fakeUser.email);
    expect(response.body.user.id).toBe(fakeUser.id);
    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();

    await User.deleteOne({ _id: fakeUser._id });
  });

  it('should return 401 if no refreshToken provided', async () => {
    const response = await request(app).get('/authUser/refresh');

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Unauthorised user');
  });

  it('should return error if decodedData is not provided', async () => {
    jest.spyOn(tokenService, 'findToken').mockResolvedValue(null);

    const fakeTokens = generateTokens({
      email: 'fakeMail@gmail.com',
      id: new mongoose.Types.ObjectId(),
    });

    const response = await request(app)
      .get('/authUser/refresh')
      .set('Cookie', `refreshToken=${fakeTokens.refreshToken}`);

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Unauthorised user');

    jest.spyOn(tokenService, 'findToken').mockRestore();
  });

  it('should return error if tokenFromDb is not provided', async () => {
    jest.spyOn(tokenService, 'validateRefreshToken').mockReturnValue(null);

    const fakeTokens = generateTokens({
      email: 'fakeMail@gmail.com',
      id: new mongoose.Types.ObjectId(),
    });

    const response = await request(app)
      .get('/authUser/refresh')
      .set('Cookie', `refreshToken=${fakeTokens.refreshToken}`);

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Unauthorised user');

    jest.spyOn(tokenService, 'validateRefreshToken').mockRestore();
  });

  it('should return error if userData is not provided', async () => {
    jest.spyOn(User, 'findById').mockResolvedValue(null);

    const fakeTokens = generateTokens({
      email: 'fakeMail@gmail.com',
      id: new mongoose.Types.ObjectId(),
    });

    const response = await request(app)
      .get('/authUser/refresh')
      .set('Cookie', `refreshToken=${fakeTokens.refreshToken}`);

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Unauthorised user');

    jest.spyOn(User, 'findById').mockRestore();
  });
});
