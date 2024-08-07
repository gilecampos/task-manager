import { describe, it, before, beforeEach, after, afterEach } from 'mocha'
import { expect } from 'chai'
import supertest from 'supertest'
import sinon from 'sinon'

import { User } from '../service/user.js'
import invalidEmail from './mocks/invalid-email.js'
import emptyEmail from './mocks/empty-email.js'
import emptyUsername from './mocks/empty-username.js'
import emptyPassword from './mocks/empty-password.js'
import invalidPassword from './mocks/invalid-password.js'
import invalidLengthUsername from './mocks/invalid-length-username.js'
import validUser from './mocks/valid-user.js'
import { constants } from '../constants/error.js'

describe('Register Suite test', () => {
  let sandbox = {}
  let app;
  let stubCreateUser;
  let stubCheckIFUserExisting;
  before(async () => {
    const serverModule = await import('../server.js')
    app = serverModule.default
    await new Promise((resolve) => app.once('listening', resolve))
    console.log('Server is up and running')
  })

  after(async () => {
    await new Promise((resolve) => app.close(resolve))
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    stubCreateUser = sandbox.stub(User.prototype, 'createUser');
    stubCheckIFUserExisting = sandbox.stub(User.prototype, 'checkIFUserExisting');
  })
  afterEach(() => {
    sandbox.restore()
    stubCreateUser.restore()
    stubCheckIFUserExisting.restore()
  })

  describe("Validation Fields", () => {
    it("should return an error for invalid email format", async () => {
      const user = new User()
      const mock = invalidEmail;
      const spy = sandbox.spy(
        user,
        user.validation.name
      )
      
      const result = user.validation(mock)
      const { args } = spy.getCall(0)
      const expectedCallCount = 1;
      const expected = {
        status: 400,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      }
      
      expect(expectedCallCount).to.equal(spy.callCount)
      expect(result).to.deep.equal(expected)
      expect(spy.calledWith(mock)).to.be.true
      expect(args[0]).to.deep.equal(mock)
      expect(result.message).to.equal(expected.message);
    })
    it("should return an error for empty email", async () => {
      const mock = emptyEmail;
      const user = new User()
      const spy = sandbox.spy(
        user,
        user.validation.name
      )
      const result = user.validation(mock)
      const expected = {
        status: 400,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      }
      const expectedCallCount = 1;
      const { args } = spy.getCall(0)
      
      expect(result).to.have.property("status").that.is.a('number')
      expect(result).to.have.property("message").that.is.a('string')
      expect(args[0]).to.be.deep.equal(mock)
      expect(spy.callCount).to.equal(expectedCallCount)
      expect(result).to.be.deep.equal(expected)
      expect(result.message).to.equal(expected.message);
    })
    it("should return an error for empty username", async () => {
      const mock = emptyUsername;
      const user = new User()
      const spy = sandbox.spy(
        user,
        user.validation.name
      )
      const expected = {
        valid: false,
        message: constants.error.username.ERROR_USERNAME_EMPTY_MESSAGE
      }
      const result = user.validation(mock)

      const expectedCallCount = 1;
      const { args } = spy.getCall(0)
      
      expect(result).to.have.property("status").that.is.a('number')
      expect(result).to.have.property("message").that.is.a('string')
      expect(args[0]).to.be.deep.equal(mock)
      expect(spy.callCount).to.equal(expectedCallCount)
      expect(result.message).to.equal(expected.message);
    })
    it("should return an error for username with invalid length", async () => {
      const mock = invalidLengthUsername;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.username.ERROR_USERNAME_LENGTH_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it('should return an error for empty password', async () => {
      const mock = emptyPassword;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.password.ERROR_PASSWORD_EMPTY_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it('should return an error for invalid password', async () => {
      const mock = invalidPassword;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.password.ERROR_PASSWORD_INVALID_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
  })

  describe("Encrypt Password", () => {
    it('should valid password and return your hash', async () => {
      const password = "Gi@25042021"
      const user = new User()
      const stub = sandbox.stub(
        user,
        user.encryptPassword.name
      )

      stub
        .withArgs(password)
        .resolves('$2b$10$cGQ9jCGDKpXDTbDRwzpvNuuouv.0sZDasXjrZQpTuHzYNP1VjRng2')

      const expected = '$2b$10$cGQ9jCGDKpXDTbDRwzpvNuuouv.0sZDasXjrZQpTuHzYNP1VjRng2'
      const result = await user.encryptPassword(password)
      expect(result).to.equal(expected)
    })
  })
  describe("POST /user", () => {
    it('should request the register with valid user and return HTTP status 200', async () => {
      stubCheckIFUserExisting.resolves(0);
      stubCreateUser.resolves({
        id: 1,
        status: 200,
        message: "Created successfully user"
      });

      const response = await supertest(app)
        .post('/v1/user')
        .send(validUser)
        .expect(200)

      
      const expected = {
        id: 1,
        status: 200,
        message: "Created successfully user"
      }

      expect(response.body).to.deep.equal(expected)
    })
    it('should request the register with invalid password user and return HTTP status 400', async () => {
      const response = await supertest(app)
        .post('/v1/user')
        .send(invalidPassword)
        .expect(400)

      const expected = {
        status: 400,
        error: "Password must be between 8 and 15 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character (!#@$%&), and include only letters, numbers, and special characters (!#@$%&)."
      }

      expect(response.body).to.deep.equal(expected)
    })
    it('should request the register with empty password user and return HTTP status 400', async () => {
      const response = await supertest(app)
        .post('/v1/user')
        .send(emptyPassword)
        .expect(400)

      const expected = {
        status: 400,
        error: "Password cannot be empty"
      }

      expect(response.body).to.deep.equal(expected)
    })
    it('should request the register with invalid password user and return HTTP status 400', async () => {
      const response = await supertest(app)
        .post('/v1/user')
        .send(invalidPassword)
        .expect(400)

      const expected = {
        status: 400,
        error: "Password must be between 8 and 15 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character (!#@$%&), and include only letters, numbers, and special characters (!#@$%&)."
      }

      expect(response.body).to.deep.equal(expected)
    })
    it('should request the register with invalid email user and return HTTP status 400', async () => {
      const response = await supertest(app)
        .post('/v1/user')
        .send(invalidEmail)
        .expect(400)

      const expected = {
        status: 400,
        error: "Invalid e-mail"
      }

      expect(response.body).to.deep.equal(expected)
    })
  })
}) 