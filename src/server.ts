import Fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user-route";
import { quickResponseRoutes } from "./routes/quickresponse-route";

const app: FastifyInstance = Fastify({});

app.register(userRoutes, {
  prefix: "/users",
});

app.register(quickResponseRoutes, {
  prefix: "/quick-responses",
});

app.listen(
  {
    port: 3300,
  },
  () => {
    console.log("HTTP Server is Running! 🚀");
  }
);
