import jwt from "jsonwebtoken";

import key from "../config/key.json";

class helper {
  async generateToken(id: number, hash: string): Promise<any> {
    const token = jwt.sign({ id, hash }, key.secret, {
      expiresIn: 18000,
    });

    return token;
  }
}

export default new helper();
