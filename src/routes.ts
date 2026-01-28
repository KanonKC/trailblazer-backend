import fastify from "fastify";
import UserService from "./services/user/user.service";
import UserController from "./controllers/user/user.controller";
import UserRepository from "./repositories/user/user.repository";
import config from "./config";
import FirstWordRepository from "./repositories/firstWord/firstWord.repository";
import FirstWordService from "./services/firstWord/firstWord.service";
import FirstWordController from "./controllers/firstWord/firstWord.controller";
import TwitchChannelChatMessageEvent from "./events/twitch/channelChatMessage/channelChatMessage.event";

const userRepository = new UserRepository();
const firstWordRepository = new FirstWordRepository();
const userService = new UserService(config, userRepository);
const userController = new UserController(userService);
const firstWordService = new FirstWordService(config, firstWordRepository, userRepository);
const firstWordController = new FirstWordController(firstWordService);
const chatMessageEvent = new TwitchChannelChatMessageEvent(firstWordService)

const server = fastify();


server.get("/api/v1/login", userController.login.bind(userController))
server.post("/api/v1/first-word", firstWordController.create.bind(firstWordController))

server.post("/webhook/v1/twitch/event-sub/chat-message-events", chatMessageEvent.handle.bind(chatMessageEvent))

export default server;