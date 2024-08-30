import { describe, it, before, beforeEach, after, afterEach } from 'mocha'
import { expect } from 'chai'
import supertest from 'supertest'
import sinon from 'sinon'

describe('Login Suite test', () => {
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

  describe("/login", () => {
    it("should return success for valid credential", async () => {
      const response = await supertest(app)
      .post('/v1/login')
      .send({email: "gileandrocampos20@gmail.com", password: "Gi@25092022"})
      .expect(200)
      
      const expected = {
        status: 200,
        message: "Authorized",
      }

      const cookies = response.header["set-cookie"][0].split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        acc[name] = value;
        return acc;
    }, {});

      expect(cookies.sessionId).to.be.ok
      expect(response.body.status).to.deep.equal(expected.status)
    })
  })

  // describe("POST /auth_user", () => {
  //   it('should request the login with valid user and return HTTP status 200', async () => {
  //     const login = new Login()
  //     const response = await supertest(app)
  //       .post('/v1/user')
  //       .send(validLogin)
  //       .expect(200)


  //     const expected = {
  //       status: 200,
  //       message: "User authorized",
  //       sessionToken: "bad16329-2d36-42ff-a2f7-a7b03d60f479"
  //     }

  //     expect(response.body).to.deep.equal(expected)
  //   })
  // })
}) 