import { FastifyInstance } from "fastify";
import urlController from "./controller/url.controller";

async function routes(fastify: FastifyInstance) {
  fastify.get("/", async () => {
    return { hello: "world" };
  });
  
  fastify.post("/short", urlController.create);
  fastify.get("/short/:id", urlController.redirect);
  fastify.delete("/short/:id", urlController.delete);
}

export { routes };
