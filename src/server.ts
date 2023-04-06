import Fastify from "fastify";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { routes } from './routes';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(routes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
