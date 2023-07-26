import request from 'supertest';
import { ObjectId } from 'mongodb';
import { Server } from 'http';

import app from 'server';
import User from 'models/user';
import * as tokenService from 'service/token-service';

let server: Server;
const fakeToken = 'fake-token';

beforeAll((done) => {
  server = app.listen(() => {
    done();
  });

  const tokenServiceMock = jest.spyOn(tokenService, 'validateAccessToken');
  tokenServiceMock.mockReturnValue({
    email: 'user1@fake.com',
    id: new ObjectId(),
  });
});

afterAll((done) => {
  server.close(() => {
    done();
  });
});

describe('GET /users', () => {
  it('should get all users', async () => {
    const fakeUsers = [
      {
        userName: 'user1',
        email: 'user1@fake.com',
        password: 'password1',
        admin: false,
      },
      {
        userName: 'user2',
        email: 'user2@fake.com',
        password: 'password2',
        admin: false,
      },
    ];

    const fakeUsersToExpect = fakeUsers.map(({ userName, email, admin }) => ({
      userName,
      email,
      admin,
    }));

    await User.insertMany(fakeUsers);
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${fakeToken}`);

    const usersToDelete = await User.find({
      userName: { $in: ['user1', 'user2'] },
    });

    await User.deleteMany({
      _id: { $in: usersToDelete.map((user) => user._id) },
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.users).toEqual(
      expect.arrayContaining(
        fakeUsersToExpect.map((user) => expect.objectContaining(user))
      )
    );
  });

  it('should return an error if attempting to get users without a token', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });
});

describe('GET /users/:id', () => {
  it('should get a user by id', async () => {
    const fakeUser = {
      userName: 'user1',
      email: 'getUserById@test.com',
      password: 'password1',
    };
    const savedUser = await User.create(fakeUser);

    const response = await request(app)
      .get(`/users/${savedUser._id}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    await User.deleteOne({ _id: response.body.user._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.user.userName).toBe(fakeUser.userName);
    expect(response.body.user.email).toBe(fakeUser.email);
    expect(response.body.user.admin).toBeFalsy();
    expect(response.body.user.password).toBeUndefined();
  });

  it('should return 500 and error message if user with id is not found', async () => {
    const response = await request(app)
      .get('/users/invalid_id')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });

  it('should return an error if attempting to get user by ID without a token', async () => {
    const response = await request(app).get('/users/userId');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });
});

describe('PATCH /users/:id', () => {
  it('should update user data by id', async () => {
    const fakeUser = {
      userName: 'userPatch',
      email: 'userPatch@test.com',
      password: 'password1',
    };
    const savedUser = await User.create(fakeUser);
    const updatedData = {
      userName: 'updatedUser',
      email: 'updatedPatch@test.com',
    };

    const response = await request(app)
      .patch(`/users/${savedUser._id}`)
      .set('Authorization', `Bearer ${fakeToken}`)
      .send(updatedData);

    await User.deleteOne({ _id: response.body.user._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.user.userName).toBe(updatedData.userName);
    expect(response.body.user.email).toBe(updatedData.email);
    expect(response.body.user.password).toBeUndefined();
  });

  it('should return 500 and error message if user with id is not found', async () => {
    const response = await request(app)
      .patch('/users/invalid_id')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({});

    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });

  it('should return an error if attempting to patch user data by ID without a token', async () => {
    const response = await request(app).patch('/users/userId').send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });
});

describe('DELETE /users/:id', () => {
  it('should delete a user by id', async () => {
    const fakeUser = {
      userName: 'user1',
      email: 'user1@example.com',
      password: 'password1',
    };
    const savedUser = await User.create(fakeUser);

    const response = await request(app)
      .delete(`/users/${savedUser._id}`)
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('SUCCESS');
    expect(response.body.user.userName).toBe(fakeUser.userName);
    expect(response.body.user.email).toBe(fakeUser.email);
    expect(response.body.user.password).toBeUndefined();

    const deletedUser = await User.findById(savedUser._id);
    expect(deletedUser).toBeNull();
  });

  it('should return 500 if user with id is not found', async () => {
    const response = await request(app)
      .delete('/users/invalid_id')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });

  it('should return an error if attempting to delete user by ID without a token', async () => {
    const response = await request(app).delete('/users/userId');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });
});
