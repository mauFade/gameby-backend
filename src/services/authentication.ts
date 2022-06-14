import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import key from "../config/key.json";

class Auth {
  async verifyJWT(req: Request, res: Response, next: NextFunction): Promise<any> {
    if (!req["headers"]["authorization"]) {
      return res.status(401).send({ auth: false, error: "No authorization token provided" });
    }

    let token = "";
    token = req["headers"]["authorization"];
    token = token.replace(/^Bearer /, "");

    jwt.verify(token, key.secret, (err, decoded) => {
      if (err || !decoded) {
        return res.status(401).send({ auth: false, error: "Couldn't authenticate token." });
      }

      req["query"]["token"] = decoded;

      return next();
    });
  }
}

export default new Auth();
