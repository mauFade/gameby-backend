import { Request, Response } from "express";

import prisma from "../services/prisma";

import { CSuccess, CError } from "../classes/responses";

class ProfileInstant {
  async create(request: Request, response: Response) {
    try {
      const token = Object(request["query"]);

      const userId: number = token["token"]["id"];

      const { bio }: { bio: string } = Object(request["body"]);

      const profile = await prisma.profile.create({
        data: {
          bio,
          userId,
        },
      });

      return response.status(200).send(new CSuccess(true, profile));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method create.", error));
    }
  }

  async read(request: Request, response: Response) {
    try {
      const profile = await prisma.profile.findMany({
        include: {
          user: true,
        },
      });

      return response.status(200).send(new CSuccess(true, profile));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method read.", error));
    }
  }

  async update(request: Request, response: Response) {
    try {
      const token = Object(request["query"]);

      const userId: number = token["token"]["id"];

      const { newBio }: { newBio: string } = Object(request["body"]);

      const profile = await prisma.profile.update({
        where: {
          userId,
        },
        data: {
          bio: newBio,
        },
      });

      return response.status(200).send(new CSuccess(true, profile));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method update.", error));
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const token = Object(request["query"]);

      const userId: number = token["token"]["id"];

      const profile = await prisma.profile.update({
        where: {
          userId,
        },
        data: {
          bio: null,
        },
      });

      return response.status(200).send(new CSuccess(true, profile));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method delete.", error));
    }
  }
}

export default new ProfileInstant();
