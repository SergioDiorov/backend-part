import request from 'supertest';
import { Server } from "http";

import app from "server";
import User from "models/user";
import * as tokenService from 'service/token-service';

describe("Check admin middleware", () => {
  let server: Server;

  beforeAll((done) => {
    server = app.listen(() => {
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });


  it('should return "SUCCESS" message if user is admin', async () => {
    const fakeUser = {
      userName: 'checkAdmin',
      email: 'checkAdmin@test.com',
      password: 'password',
      isAdmin: true
    };
    const savedUser = await User.create(fakeUser);

    const tokens = tokenService.generateTokens({
      email: savedUser.email,
      id: savedUser._id,
    });

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    await User.deleteOne({ _id: savedUser._id });
    expect(response.body.message).toBe("SUCCESS")
    expect(response.status).toBe(200)
  });

  it('should return "Access forbidden" error if user is not admin', async () => {
    const fakeUser = {
      userName: 'checkAdmin2',
      email: 'checkAdmin2@test.com',
      password: 'password',
      isAdmin: false
    };
    const savedUser = await User.create(fakeUser);

    const tokens = tokenService.generateTokens({
      email: savedUser.email,
      id: savedUser._id,
    });

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    await User.deleteOne({ _id: savedUser._id });
    expect(response.body).toEqual({
      message: 'Access forbidden',
      code: 403
    });
    expect(response.status).toBe(403);
  });
})