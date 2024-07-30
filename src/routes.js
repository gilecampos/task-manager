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
    handler: function(data) {
      
    }
  },
]

export default routes