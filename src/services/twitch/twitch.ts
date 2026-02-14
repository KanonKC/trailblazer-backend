import { twitchAppAPI } from "@/libs/twurple";
import { HelixCustomReward } from "@twurple/api";
import AuthService from "../auth/auth.service";
import { rawDataSymbol } from "@twurple/common";
import { HelixCustomRewardData } from "@twurple/api/lib/interfaces/endpoints/channelPoints.external";

export default class TwitchService {
    private readonly authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async getChannelRewards(channelId: string): Promise<{
        data: HelixCustomRewardData[];
    }> {
        const twitchUserAPI = await this.authService.createTwitchUserAPI(channelId)
        const res = await twitchUserAPI.channelPoints.getCustomRewards(channelId)
        return { data: res.map(r => r[rawDataSymbol]) }
    }
}