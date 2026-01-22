import { ApiClient } from "@twurple/api";
import crypto from "crypto"
import { AppTokenAuthProvider, RefreshingAuthProvider, StaticAuthProvider } from "@twurple/auth";

const clientId = "lnn0xjhakjukg3r77tgnjpquxt1y2t"
const clientSecret = "v6jct9yi6j35maiql4eqwa1263ybka"

const authProvider = new AppTokenAuthProvider(clientId, clientSecret, ["channel:read:subscriptions"])
const twitchAppAPI = new ApiClient({ authProvider });

async function addSub() {
    await twitchAppAPI.eventSub.subscribeToChannelChatMessageEvents("135783794", {
        method: "webhook",
        callback: "https://blaze-dev.kanonkc.com/webhook/v1/twitch/event-sub/chat-message-events",
        secret: "8chkr2187r3y6ppl57pspl5hjea2v0",
    })
}

async function list() {
    const eventSub = await twitchAppAPI.eventSub.getSubscriptions()

    console.log(eventSub.data.map(e => ({
        id: e.id,
        status: e.status,
        type: e.type,
        condition: e.condition,
        cost: e.cost,
    })))
}

async function deleteSub() {
    const eventSub = await twitchAppAPI.eventSub.getSubscriptions()
    const targetList = eventSub.data.filter(e => e.status === "webhook_callback_verification_failed")
    await Promise.all(targetList.map(e => twitchAppAPI.eventSub.deleteSubscription(e.id)))
}

(async () => {
    // await deleteSub()
    // await addSub()
    await list()
})()