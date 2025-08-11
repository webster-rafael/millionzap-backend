import Fastify, { FastifyInstance } from "fastify";
import cookie, { fastifyCookie } from "@fastify/cookie";
import { userRoutes } from "./routes/user-route";
import { quickResponseRoutes } from "./routes/quickresponse-route";
import fastifyCors from "@fastify/cors";
import { queuesRoutes } from "./routes/queues-route";
import { promptRoutes } from "./routes/prompt-route";
import { tagsRoutes } from "./routes/tags-route";
import { contactRoutes } from "./routes/contact-route";
import { conversationRoutes } from "./routes/conversation-route";
import { companyRoutes } from "./routes/company-route";
import { authHook } from "./hooks/auth";

const app: FastifyInstance = Fastify({});

app.register(fastifyCors, {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
app.register(fastifyCookie);

app.register(companyRoutes, {
  prefix: "/companies",
});

app.register(async (instance) => {
  // 👉 APLICA O HOOK A TODAS AS ROTAS REGISTRADAS DENTRO DESTE BLOCO
  instance.addHook("preHandler", authHook);

  // Agora, registre todas as suas rotas protegidas aqui, usando "instance"
  instance.register(conversationRoutes, {
    prefix: "/conversations",
  });

  instance.register(userRoutes, {
    prefix: "/users",
  });

  instance.register(contactRoutes, {
    prefix: "/contacts",
  });

  instance.register(quickResponseRoutes, {
    prefix: "/quick-responses",
  });

  instance.register(queuesRoutes, {
    prefix: "/queues",
  });

  instance.register(promptRoutes, {
    prefix: "/prompts",
  });

  instance.register(tagsRoutes, {
    prefix: "/tags",
  });
});

// 4. Iniciar o Servidor
app.listen(
  {
    port: 3300,
  },
  () => {
    console.log("HTTP Server is Running! 🚀");
  }
);
