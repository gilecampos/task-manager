import bcrypt from "bcrypt";

export class Password {
  async encryptPassword(password) {
    const saltRounds = 10;
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error("Error encrypting password:", error);
      throw error;
    }
  }
}