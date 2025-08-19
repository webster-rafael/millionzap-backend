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
import { audioRoutes } from "./routes/audio-route";
import { apiKeyAuthHook } from "./hooks/apiKeyN8n";
import fastifyStatic from "@fastify/static";
import path from "path";
import { photoRoutes } from "./routes/image-route";
import { filesRoutes } from "./routes/file-route";
import { whatsAppConnectionRoutes } from "./routes/whatsAppConnection-route";

const app: FastifyInstance = Fastify({});

app.register(fastifyCors, {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
app.register(fastifyCookie);

app.register(fastifyStatic, {
  root: path.join(__dirname, "../uploads"),
  prefix: "/uploads/",
});

app.register(companyRoutes, {
  prefix: "/companies",
});

app.register(async (instance) => {
  instance.addHook("onRequest", apiKeyAuthHook);

  instance.register(audioRoutes, {
    prefix: "/media",
  });

  instance.register(photoRoutes, {
    prefix: "/photo",
  });

  instance.register(filesRoutes, {
    prefix: "/files",
  });
});

app.register(async (instance) => {
  instance.addHook("preHandler", authHook);

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

  instance.register(whatsAppConnectionRoutes, {
    prefix: "/connections",
  });

  // instance.register(audioRoutes, {
  //   prefix: "/media",
  // });
});

const PORT = Number(process.env.PORT || 3300);

app.listen(
  {
    port: PORT,
    host: "0.0.0.0",
  },
  () => {
    console.log("HTTP Server is Running! 🚀");
  }
);
