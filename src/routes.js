import { User } from "./service/user.js"
const user = new User()

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
    endpoint: '/v1/user',
    method: 'POST',
    handler: async function(data) {
      const validation = user.validation(data)

      if(validation.status !== 200) {
        return {
          status: 400,
          error: validation.message
        }
      }

      const passwordHash = await user.encryptPassword(data.password)

      const payload = {
        username: data.username,
        email: data.email,
        password: passwordHash,
      }

      const insert = await user.createUser(payload)
      console.log(insert)
      return { ...insert }
    }
  },
]

export default routes