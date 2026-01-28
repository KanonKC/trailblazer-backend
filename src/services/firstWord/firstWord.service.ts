import { CreateFirstWordRequest } from "@/repositories/firstWord/request";
import FirstWordRepository from "@/repositories/firstWord/firstWord.repository";
import { twitchAppAPI } from "@/libs/twurple";
import UserRepository from "@/repositories/user/user.repository";
import { ChannelChatMessageEvent } from "@/events/twitch/chatMessage/request";

export default class FirstWordService {
    private readonly firstWordRepository: FirstWordRepository;
    private readonly userRepository: UserRepository;

    constructor(firstWordRepository: FirstWordRepository, userRepository: UserRepository) {
        this.firstWordRepository = firstWordRepository;
        this.userRepository = userRepository;
    }

    async create(request: CreateFirstWordRequest): Promise<void> {
        const user = await this.userRepository.get(request.owner_id);
        if (!user) {
            throw new Error("User not found");
        }

        await this.firstWordRepository.create(request);

        const userSubs = await twitchAppAPI.eventSub.getSubscriptionsForUser(user.twitch_id);
        const userChatMessageSub = userSubs.data.filter(sub => sub.type === 'channel.chat.message' && sub.status === 'enabled')

        if (userChatMessageSub.length === 0) {
            await twitchAppAPI.eventSub.subscribeToChannelChatMessageEvents(user.twitch_id, {
                method: "webhook",
                callback: "https://blaze-dev.kanonkc.com/webhook/v1/twitch/event-sub/chat-message-events",
                secret: "8chkr2187r3y6ppl57pspl5hjea2v0",
            })
        }
    }

    async handleTwitchChatMessageEvent(e: ChannelChatMessageEvent): Promise<void> {

        if (e.chatter_user_id === "1108286106") {
            return
        }

        const user = await this.userRepository.getByTwitchId(e.broadcaster_user_id);
        if (!user) {
            throw new Error("User not found");
        }

        const firstWord = await this.firstWordRepository.getByOwnerId(user.id);
        if (!firstWord) {
            throw new Error("First word not found");
        }

        let message = firstWord.reply_message

        const replaceMap = {
            "{{user_login}}": e.chatter_user_login,
            "{{user_name}}": e.chatter_user_name,
            "{{broadcaster_user_login}}": e.broadcaster_user_login,
            "{{broadcaster_user_name}}": e.broadcaster_user_name,
            "{{message_text}}": e.message.text,
            "{{color}}": e.color,
        }

        if (message) {
            for (const [key, value] of Object.entries(replaceMap)) {
                message = message.replace(new RegExp(key, "g"), value)
            }
            await twitchAppAPI.chat.sendChatMessageAsApp("1108286106", e.broadcaster_user_id, message)
        }
    }
}