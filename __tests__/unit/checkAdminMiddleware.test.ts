import { Server } from "http";
import { NextFunction, Request, Response } from 'express';

import { checkAdmin } from './../../middlewares/check-admin-middleware';
import app from "server";
import { ObjectId } from 'mongodb';

interface RequestWithUser extends Request {
  user?: {
    id: ObjectId | string;
  };
}

let server: Server;
let mockRequest: Partial<RequestWithUser>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();

beforeAll((done) => {
  server = app.listen(() => {
    done();
  });

  mockRequest = {};
  mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };
});

afterAll((done) => {
  server.close(() => {
    done();
  });
});

describe("Check admin middleware", () => {
  it('should return "No user data provided" error if user is not admin', async () => {
    const expectedResponse = {
      message: "No user data provided",
      code: 403
    };
    await checkAdmin(mockRequest as Request,
      mockResponse as Response,
      nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  it('should return "Access forbidden" error if user is not admin', async () => {
    mockRequest = {
      user: {
        id: new ObjectId()
      }
    }

    const expectedResponse = {
      message: "Access forbidden",
      code: 403
    };
    await checkAdmin(mockRequest as Request,
      mockResponse as Response,
      nextFunction);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  it('should return success', async () => {
    mockRequest = {
      user: {
        id: "64b1653b2e6c7d54e2694eea"
      }
    }

    await checkAdmin(mockRequest as Request,
      mockResponse as Response,
      nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
  });
})