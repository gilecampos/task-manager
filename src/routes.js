import jwt from "jsonwebtoken"
import { once } from 'events';
import { Login } from "./service/login.js"
import { User } from "./service/user.js"
import { Password } from "./service/password.js"
import { Session } from "./service/session.js";

const user = new User()
const login = new Login()
const password = new Password()
const session = new Session()

const routes = [
  {
    endpoint: 'v1/',
    method: 'GET',
    handler: function () {
      return {
        version: "1.0",
        status: 200
      }
    },
  },
  {
    endpoint: '/v1/user',
    method: 'POST',
    handler: async function(request, response) {
      const data = JSON.parse(await once(request, "data"))
      const validation = user.validation(data)

      if(validation.status !== 200) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ validation }));
        return
      }

      const passwordHash = await password.encryptPassword(data.password)

      const payload = {
        username: data.username,
        email: data.email,
        password: passwordHash,
      }

      const insert = await user.createUser(payload)
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ insert }));
      return
    },
  },
  {
    endpoint: '/v1/login',
    method: 'POST',
    handler: async function(request, response) {
      const data = JSON.parse(await once(request, "data"))
      const verifyUser = await login.checkUser(data)
      if(verifyUser.status !== 200) {
        response.end(JSON.stringify({ status: verifyUser.status, message: verifyUser.message }));
        return 
      }
      const { id } = verifyUser.data
        
      
      const token = jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY || "task_manager", {
        expiresIn: '1h'
      })
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      const createSession = await session.create({
        session_id: token,
        info: {...data},
        expires_at: expiresAt
      })

      if(!createSession) {
        response.end(JSON.stringify({ status: 500, message: "Error for create session" }));
        return 
      }

      response.writeHead(200, { 
        'Content-Type': 'application/json',
        'Set-Cookie': `sessionId=${token}; HttpOnly`,
      });
      response.end(JSON.stringify({ status: 200, message: "success" }));
      return
    }
  }
]

export default routes