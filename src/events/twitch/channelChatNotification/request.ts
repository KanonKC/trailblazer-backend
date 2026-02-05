export interface TwitchChannelChatNotificationEventRequest {
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    chatter_user_id: string;
    chatter_user_login: string;
    chatter_user_name: string;
    chatter_is_anonymous: boolean;
    color: string;
    badges: TwitchBadge[];
    system_message: string;
    message_id: string;
    message: TwitchMessage;
    notice_type: TwitchNoticeType;
    sub?: TwitchSubNotice;
    resub?: TwitchResubNotice;
    sub_gift?: TwitchSubGiftNotice;
    community_sub_gift?: TwitchCommunitySubGiftNotice;
    gift_paid_upgrade?: TwitchGiftPaidUpgradeNotice;
    prime_paid_upgrade?: TwitchPrimePaidUpgradeNotice;
    pay_it_forward?: TwitchPayItForwardNotice;
    raid?: TwitchRaidNotice;
    unraid?: TwitchUnraidNotice;
    announcement?: TwitchAnnouncementNotice;
    bits_badge_tier?: TwitchBitsBadgeTierNotice;
    charity_donation?: TwitchCharityDonationNotice;
    shared_chat_sub?: TwitchSharedChatSubNotice;
    shared_chat_resub?: TwitchSharedChatResubNotice;
    shared_chat_sub_gift?: TwitchSharedChatSubGiftNotice;
    shared_chat_community_sub_gift?: TwitchSharedChatCommunitySubGiftNotice;
    shared_chat_gift_paid_upgrade?: TwitchSharedChatGiftPaidUpgradeNotice;
    shared_chat_prime_paid_upgrade?: TwitchSharedChatPrimePaidUpgradeNotice;
    shared_chat_pay_it_forward?: TwitchSharedChatPayItForwardNotice;
    shared_chat_raid?: TwitchSharedChatRaidNotice;
    shared_chat_announcement?: TwitchSharedChatAnnouncementNotice;
}

export interface TwitchBadge {
    set_id: string;
    id: string;
    info: string;
}

export interface TwitchMessage {
    text: string;
    fragments: TwitchMessageFragment[];
}

export interface TwitchMessageFragment {
    type: string;
    text: string;
    cheermote: TwitchCheermote | null;
    emote: TwitchEmote | null;
    mention: TwitchMention | null;
}

export interface TwitchCheermote {
    prefix: string;
    bits: number;
    tier: number;
}

export interface TwitchEmote {
    id: string;
    emote_set_id: string;
    owner_id: string;
    format: string[];
}

export interface TwitchMention {
    user_id: string;
    user_name: string;
    user_login: string;
}

export interface TwitchSubNotice {
    sub_tier: string;
    is_prime: boolean;
    duration_months: number;
}

export interface TwitchResubNotice {
    cumulative_months: number;
    duration_months: number;
    streak_months: number | null;
    sub_tier: string;
    is_prime: boolean;
    is_gift: boolean;
    gifter_is_anonymous: boolean | null;
    gifter_user_id: string | null;
    gifter_user_name: string | null;
    gifter_user_login: string | null;
}

export interface TwitchSubGiftNotice {
    duration_months: number;
    cumulative_total: number | null;
    recipient_user_id: string;
    recipient_user_name: string;
    recipient_user_login: string;
    sub_tier: string;
    community_gift_id: string | null;
}

export interface TwitchCommunitySubGiftNotice {
    id: string;
    total: number;
    sub_tier: string;
    cumulative_total: number | null;
}

export interface TwitchGiftPaidUpgradeNotice {
    gifter_is_anonymous: boolean;
    gifter_user_id: string | null;
    gifter_user_name: string | null;
    gifter_user_login: string | null;
}

export interface TwitchPrimePaidUpgradeNotice {
    sub_tier: string;
}

export interface TwitchPayItForwardNotice {
    gifter_is_anonymous: boolean;
    gifter_user_id: string | null;
    gifter_user_name: string | null;
    gifter_user_login: string | null;
}

export interface TwitchRaidNotice {
    user_id: string;
    user_name: string;
    user_login: string;
    viewer_count: number;
    profile_image_url: string;
}

export interface TwitchUnraidNotice {

}

export interface TwitchAnnouncementNotice {
    color: string;
}

export interface TwitchBitsBadgeTierNotice {
    tier: number;
}

export interface TwitchCharityDonationNotice {
    charity_name: string;
    amount: TwitchCurrencyAmount;
}

export interface TwitchCurrencyAmount {
    value: number;
    decimal_places: number;
    currency: string;
}

export interface TwitchSharedChatSubNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    sub: TwitchSubNotice;
}

export interface TwitchSharedChatResubNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    resub: TwitchResubNotice;
}

export interface TwitchSharedChatSubGiftNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    sub_gift: TwitchSubGiftNotice;
}

export interface TwitchSharedChatCommunitySubGiftNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    community_sub_gift: TwitchCommunitySubGiftNotice;
}

export interface TwitchSharedChatGiftPaidUpgradeNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    gift_paid_upgrade: TwitchGiftPaidUpgradeNotice;
}

export interface TwitchSharedChatPrimePaidUpgradeNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    prime_paid_upgrade: TwitchPrimePaidUpgradeNotice;
}

export interface TwitchSharedChatPayItForwardNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    pay_it_forward: TwitchPayItForwardNotice;
}

export interface TwitchSharedChatRaidNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    raid: TwitchRaidNotice;
}

export interface TwitchSharedChatAnnouncementNotice {
    source_broadcaster_user_id: string;
    source_broadcaster_user_name: string;
    source_broadcaster_user_login: string;
    source_message_id: string;
    source_badges: TwitchBadge[];
    announcement: TwitchAnnouncementNotice;
}

export type TwitchNoticeType =
    | "sub"
    | "resub"
    | "sub_gift"
    | "community_sub_gift"
    | "gift_paid_upgrade"
    | "prime_paid_upgrade"
    | "raid"
    | "unraid"
    | "pay_it_forward"
    | "announcement"
    | "bits_badge_tier"
    | "charity_donation"
    | "shared_chat_sub"
    | "shared_chat_resub"
    | "shared_chat_sub_gift"
    | "shared_chat_community_sub_gift"
    | "shared_chat_gift_paid_upgrade"
    | "shared_chat_prime_paid_upgrade"
    | "shared_chat_raid"
    | "shared_chat_pay_it_forward"
    | "shared_chat_announcement";