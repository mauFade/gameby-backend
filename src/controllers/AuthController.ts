import { Request, Response } from "express";
import crypto from "crypto";

import prisma from "../services/prisma";
import helper from "../helpers/helper";

import { CSuccess, CError } from "../classes/responses";

class AuthInstant {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const { email, password }: { email: string; password: string } = Object(request["body"]);

      if (!email || !password) {
        return response
          .status(401)
          .send(new CError(false, "Error at method create", "Email and password are required."));
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || user === null) {
        return response.status(404).send(new CError(false, "Error at method create", "User not found."));
      }

      if (user["password"] !== password) {
        return response.status(401).send(new CError(false, "Error at method create", "Invalid password."));
      }

      const hash = crypto.randomBytes(16).toString("hex");

      const token = await helper.generateToken(user["id"], hash);

      return response.status(200).send(new CSuccess(true, { user, token }));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method create.", error));
    }
  }
}

export default new AuthInstant();
