import { constants } from "../constants/error.js";
import bcrypt from "bcrypt";
import pool from "../database/pool.js";

export class User {
  async createUser(data) {
    try {
      const userExists = await this.checkIFUserExisting(data);
      if (userExists > 0) {
        return {
          status: 400,
          message: "There is already an account registered with this username or email address"
        };
      }

      const queryString = "INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3) RETURNING *";
      const payload = [data.username, data.email, data.password];
      const res = await pool.query(queryString, payload);

      return {
        id: res.rows[0].id,
        status: 200,
        message: "Created user successfully"
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async checkIFUserExisting(payload) {
    try {
      const queryString = "SELECT * FROM users WHERE username = $1 OR email = $2";
      const data = [payload.username, payload.email];
      const res = await pool.query(queryString, data);
      return res.rowCount;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw error;
    }
  }

  validation(data) {
    const validEmail = email =>
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi.test(email);
    const validPassword = password =>
      /^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,15}$/.test(password);

    if (!validEmail(data.email)) {
      return {
        status: 400,
        message: constants.error.email.ERROR_EMAIL_INVALID_MESSAGE
      };
    }

    if (!data.email || data.email.length <= 0) {
      return {
        status: 400,
        message: constants.error.email.ERROR_EMAIL_EMPTY_MESSAGE
      };
    }

    if (!data.username) {
      return {
        status: 400,
        message: constants.error.username.ERROR_USERNAME_EMPTY_MESSAGE
      };
    }

    if (data.username.length < 8 || data.username.length > 60) {
      return {
        status: 400,
        message: constants.error.username.ERROR_USERNAME_LENGTH_MESSAGE
      };
    }

    if (!data.password) {
      return {
        status: 400,
        message: constants.error.password.ERROR_PASSWORD_EMPTY_MESSAGE
      };
    }

    if (!validPassword(data.password)) {
      return {
        status: 400,
        message: constants.error.password.ERROR_PASSWORD_INVALID_MESSAGE
      };
    }

    return { status: 200 };
  }
}
