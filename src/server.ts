import Fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user-route";
import { quickResponseRoutes } from "./routes/quickresponse-route";
import fastifyCors from "@fastify/cors";
import { queuesRoutes } from "./routes/queues-route";
import { promptRoutes } from "./routes/prompt-route";
import { tagsRoutes } from "./routes/tags-route";

const app: FastifyInstance = Fastify({});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(userRoutes, {
  prefix: "/users",
});

app.register(quickResponseRoutes, {
  prefix: "/quick-responses",
});

app.register(queuesRoutes, {
  prefix: "/queues",
});

app.register(promptRoutes, {
  prefix: "/prompts",
});

app.register(tagsRoutes, {
  prefix: "/tags",
});

app.listen(
  {
    port: 3300,
  },
  () => {
    console.log("HTTP Server is Running! 🚀");
  }
);
