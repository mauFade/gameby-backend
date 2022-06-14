import { Request, Response } from "express";
import crypto from "crypto";

import helper from "../helpers/helper";

import prisma from "../services/prisma";

import { CSuccess, CError } from "../classes/responses";

class UserInstant {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const {
        name,
        email,
        gamertag,
        password,
        cellphone,
        city,
        country,
        photo,
      }: {
        name: string;
        email: string;
        gamertag: string;
        password: string;
        cellphone: string;
        city: string;
        country: string;
        photo: string;
      } = Object(request["body"]);

      if (!name || !email || !gamertag || !password || !cellphone || !city || !country) {
        return response.status(403).send(new CError(false, "Error at method create.", "All fields are required."));
      }

      const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (email.match(mailFormat)) {
        const sameEmail = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        const samePhone = await prisma.user.findUnique({
          where: {
            cellphone,
          },
        });

        const sameTag = await prisma.user.findUnique({
          where: {
            gamertag,
          },
        });

        if (sameEmail !== null) {
          return response
            .status(403)
            .send(new CError(false, "Error at method create.", "A user with this email already exists."));
        }

        if (samePhone !== null) {
          return response
            .status(403)
            .send(new CError(false, "Error at method create.", "A user with this cellphone already exists."));
        }

        if (sameTag !== null) {
          return response
            .status(403)
            .send(new CError(false, "Error at method create.", "A user with this gamertag already exists."));
        }

        const user = await prisma.user.create({
          data: {
            name,
            email,
            gamertag,
            password,
            avatar: photo,
            cellphone,
            city,
            country,
          },
        });

        const hash = crypto.randomBytes(16).toString("hex");

        const token = await helper.generateToken(user["id"], hash);

        return response.status(200).send(new CSuccess(true, { user, token }));
      }
      return response.status(403).send(new CError(false, "Error at method create.", "You must send a valid email."));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method create.", error));
    }
  }

  async read(request: Request, response: Response): Promise<any> {
    try {
      const { gamertag }: { gamertag: string } = Object(request["query"]);

      const user = await prisma.user.findUnique({
        where: {
          gamertag,
        },
        select: {
          name: true,
          gamertag: true,
          avatar: true,
          city: true,
          country: true,
          createdAt: true,
        },
      });

      return response.status(200).send(new CSuccess(true, user));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method read.", error));
    }
  }

  async update(request: Request, response: Response): Promise<any> {
    try {
      const {
        newName,
        newEmail,
        newGamertag,
        newPassword,
        newAvatar,
        newCellphone,
        newCity,
        newCountry,
      }: {
        newName?: string;
        newEmail?: string;
        newGamertag?: string;
        newPassword?: string;
        newAvatar?: string;
        newCellphone?: string;
        newCity?: string;
        newCountry?: string;
      } = Object(request["body"]);

      const token = Object(request["query"]);

      const userId = token["token"]["id"];

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: newName,
          email: newEmail,
          gamertag: newGamertag,
          password: newPassword,
          avatar: newAvatar,
          cellphone: newCellphone,
          city: newCity,
          country: newCountry,
        },
      });

      return response.status(200).send(new CSuccess(true, user));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method update.", error));
    }
  }

  async delete(request: Request, response: Response): Promise<any> {
    try {
      const token = Object(request["query"]);

      const userId = token["token"]["id"];

      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return response.status(200).send(new CSuccess(true, "User deleted successfully."));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method delete.", error));
    }
  }
}

export default new UserInstant();
