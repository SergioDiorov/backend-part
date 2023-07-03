import request from 'supertest';
import app from './../../server';

describe('POST /authUser/signup - registration', () => {
  it('should create a new user when email is not registered', async () => {
    const user = {
      userName: 'Test',
      email: 'test@gmail.com',
      password: 'qweasd',
      admin: false,
    };

    const response = await request(app).post('/authUser/signup').send(user);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.userId).toBeDefined();
  });

  it('should return 409 when email is already registered', async () => {
    const existingUser = {
      userName: 'Test',
      email: 'test@gmail.com',
      password: 'qweasd',
      admin: false,
    };

    const response = await request(app)
      .post('/authUser/signup')
      .send(existingUser);

    expect(response.status).toBe(409);
    expect(response.body.code).toBe(409);
    expect(response.body.message).toBe('Email is already registered');
  });

  it('should create a new user when admin is not in arguments', async () => {
    const user = {
      userName: 'Test2',
      email: 'test2@gmail.com',
      password: 'qweasd',
    };

    const response = await request(app).post('/authUser/signup').send(user);

    expect(response.status).toBe(201);
    expect(response.body.code).toBe(201);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.userId).toBeDefined();
  });
});

describe('POST /authUser/signin - autorisation', () => {
  it('should return success when email and password are correct', async () => {
    const user = {
      email: 'test@gmail.com',
      password: 'qweasd',
    };

    const response = await request(app).post('/authUser/signin').send(user);

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.userId).toBeDefined();
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
    const user = {
      email: 'test@gmail.com',
      password: 'wrong',
    };

    const response = await request(app).post('/authUser/signin').send(user);

    expect(response.status).toBe(401);
    expect(response.body.code).toBe(401);
    expect(response.body.message).toBe('Wrong password');
  });
});
