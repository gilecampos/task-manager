import { constants } from "../constants/error.js"

export class User {
  async createUser(data) {
    const validation = this.validation(data)
    if(!validation) throw new Error(validation.message)
  }

  validation(data) {
    const validEmail = email => 
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(email)

    if(!validEmail(data.email)) {
      return {
        valid:false,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      }
    }

    if(!data.email || data.email.length <= 0) {
      return {
        valid:false,
        message: constants.error.email.ERROR_EMAIL_EMPTY_MESSAGE
      }
    }
    
    if(!data.username) {
      return {
        valid:false,
        message: constants.error.username.ERROR_USERNAME_EMPTY_MESSAGE
      }
    }

    return { valid: true }
  }
}