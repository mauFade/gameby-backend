import { Request, Response } from "express";

import { CSuccess, CError } from "../classes/responses";

import prisma from "../services/prisma";

class PostInstant {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const { title, content, game, photo }: { title: string; content?: string; game?: string; photo?: string } =
        Object(request["body"]);

      const token = Object(request["query"]);

      const userId = token["token"]["id"];

      if (!title) {
        return response.status(403).send(new CError(false, "Error at method create.", "A post must have a title."));
      }

      const post = await prisma.post.create({
        data: {
          userId,
          title,
          content,
          game,
          photo,
        },
      });

      return response.status(200).send(new CSuccess(true, post));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method create.", error));
    }
  }

  async read(request: Request, response: Response): Promise<any> {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: true,
        },
      });

      return response.status(200).send(new CSuccess(true, posts));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method read.", error));
    }
  }

  async update(request: Request, response: Response): Promise<any> {
    try {
      const { postId }: { postId: number } = Object(request["query"]);

      if (!postId) {
        return response.status(403).send(new CError(false, "Error at method update.", "You must send a id."));
      }

      const {
        newTitle,
        newContent,
        newGame,
        newPhoto,
      }: { newTitle?: string; newContent?: string; newGame?: string; newPhoto?: string } = Object(request["body"]);

      const post = await prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          title: newTitle,
          content: newContent,
          game: newGame,
          photo: newPhoto,
        },
      });

      return response.status(200).send(new CSuccess(true, post));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method update.", error));
    }
  }

  async delete(request: Request, response: Response): Promise<any> {
    try {
      const { postId }: { postId: number } = Object(request["query"]);

      await prisma.post.delete({
        where: {
          id: Number(postId),
        },
      });

      return response.status(200).send(new CSuccess(true, "Post deleted successfully."));
    } catch (error: any) {
      return response
        .status(error["code"] ? error["code"] : 500)
        .send(new CError(false, "Error at method delete.", error));
    }
  }
}

export default new PostInstant();
