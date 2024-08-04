import { describe, it, before, beforeEach, after, afterEach } from 'mocha'
import { expect } from 'chai'
import supertest from 'supertest'
import sinon from 'sinon'

import { User } from '../service/user.js'
import invalidEmail from './mocks/invalid-email.js'
import emptyEmail from './mocks/empty-email.js'
import emptyUsername from './mocks/empty-username.js'
import emptyPassword from './mocks/empty-password.js'
import invalidLengthUsername from './mocks/invalid-length-username.js'
import { constants } from '../constants/error.js'
import invalidPassword from './mocks/empty-password.js'

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

  describe("Validations", () => {
    it("should request the register with invalid email and return HTTP Status 400", async () => {
      const mock = invalidEmail;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      }
      
      expect(result.message).to.equal(expected.message);
    })
    it("should request the register with empty email and return HTTP Status 400", async () => {
      const mock = emptyEmail;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it("should request the register with empty username and return HTTP Status 400", async () => {
      const mock = emptyUsername;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.username.ERROR_USERNAME_EMPTY_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it("should request the register with a username with an invalid number of characters and return HTTP status 400", async () => {
      const mock = invalidLengthUsername;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.username.ERROR_USERNAME_LENGTH_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it('should request the register with empty password and return HTTP status 400', async () => {
      const mock = emptyPassword;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.password.ERROR_PASSWORD_EMPTY_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
    it('should request the register with empty password and return HTTP status 400', async () => {
      const mock = invalidPassword;
      const user = new User()
      const result = user.validation(mock)

      const expected = {
        valid: false,
        message: constants.error.password.ERROR_PASSWORD_EMPTY_MESSAGE
      }

      expect(result.message).to.equal(expected.message);
    })
  })
}) 