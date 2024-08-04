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
  })
  afterEach(() => {
    sandbox.restore()
  })

  describe("Validation Fields", () => {
    it("should return an error for invalid email format", async () => {
      const mock = invalidEmail;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it("should return an error for empty email", async () => {
      const mock = emptyEmail;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it("should return an error for empty username", async () => {
      const mock = emptyUsername;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.username.ERROR_USERNAME_EMPTY_MESSAGE
      }

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
      const response = await supertest(app)
        .post('/v1/user')
        .send(validUser)
        .expect(200)
      
      const expected = {
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