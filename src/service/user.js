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
        message: "Invalid Email"
      }
    }

    return { valid: true }
  }

  async insertUser(data) {

  }
}