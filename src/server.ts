import Fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user-route";

const app: FastifyInstance = Fastify({});

app.register(userRoutes, {
  prefix: "/users",
});

app.listen(
  {
    port: 3300,
  },
  () => {
    console.log("HTTP Server is Running! 🚀");
  }
);
