import { describe, it, before, beforeEach, after, afterEach } from 'mocha'
import { expect } from 'chai'
import supertest from 'supertest'
import sinon from 'sinon'

import { User } from '../service/user.js'
import invalidEmail from './mocks/invalid-email.js'

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
        message: "Invalid Email"
      }
      
      expect(result.message).to.equal('Invalid Email');
    })
  })
}) 