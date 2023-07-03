import request from 'supertest';
import app from './../../server';

describe('POST /authUser/signup', () => {
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
