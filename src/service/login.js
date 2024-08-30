import pool from "../database/pool.js"
import bcrypt from "bcrypt"
import { Password } from "./password.js"
const password = new Password()

export class Login {
  async checkUser(dataUser) {
    const getUser = await this.getUser(dataUser.email)
    const { password_hash } = getUser.rows[0]
    const matchPassword = await bcrypt.compare(dataUser.password, password_hash)
    if(getUser.rowCount <= 0) {
      return { 
        status: 401, 
        message: "Unauthorized" 
      }
    }
    
    if(!matchPassword) {
      return { 
        status: 401, 
        message: "Unauthorized" 
      }
    }


    return {
      status: 200,
      data: getUser.rows[0]
    }
  }

  async getUser(email) {
    try {
      const queryString = "SELECT * FROM users WHERE email = $1";
      const data = [email];
      const res = await pool.query(queryString, data);
      return res;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw error;
    }
  }
}
