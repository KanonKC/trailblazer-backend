import fastify from "fastify";
import UserService from "./services/user/user.service";
import UserController from "./controllers/user/user.controller";
import UserRepository from "./repositories/user/user.repository";
import config from "./config";
import ChatMessageEvent from "./events/twitch/chat-message/chat-message.event";

const userRepository = new UserRepository();
const userService = new UserService(config, userRepository);
const userController = new UserController(userService);
const chatMessageEvent = new ChatMessageEvent()

const server = fastify();

server.get("/", (req, res) => {
  res.send("Hello World");
});

server.get("/api/v1/login", userController.login.bind(userController))

server.post("/webhook/v1/twitch/event-sub/chat-message-events", chatMessageEvent.handle.bind(chatMessageEvent))

export default server;