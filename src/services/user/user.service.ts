import { AccessToken, exchangeCode, getTokenInfo } from "@twurple/auth";
import Configurations from "@/config/index";
import { LoginRequest } from "./request";
import { twitchAppAPI } from "@/libs/twurple";
import UserRepository from "@/repositories/user/user.repository";
import { CreateUserRequest } from "@/repositories/user/request";

export default class UserService {
    private readonly cfg: Configurations
    private readonly userRepository: UserRepository
    constructor(cfg: Configurations, userRepository: UserRepository) {
        this.cfg = cfg
        this.userRepository = userRepository
    }

    async login(request: LoginRequest): Promise<void> {
        const token = await exchangeCode(
            this.cfg.twitch.clientId,
            this.cfg.twitch.clientSecret,
            request.code,
            this.cfg.twitch.redirectUrl
        )

        console.log('token',token)

        const tokenInfo = await getTokenInfo(token.accessToken, this.cfg.twitch.clientId)

        if (!tokenInfo.userId) {
            throw new Error("Invalid token info")
        }

        const twitchUser = await twitchAppAPI.users.getUserById(tokenInfo.userId)
        console.log('user', twitchUser)
        if (!twitchUser) {
            throw new Error("Invalid Twitch user")
        }

        const cr: CreateUserRequest = {
            twitch_id: twitchUser.id,
            username: twitchUser.name,
            display_name: twitchUser.displayName,
            avatar_url: twitchUser.profilePictureUrl
        }
        console.log("Creating")
        await this.userRepository.upsert(cr)
        console.log("Done")
    }
}
