import urllib.parse

baseUrl = "https://id.twitch.tv/oauth2/authorize"
scopes = [
    "channel:bot",
    "user:read:email",
    "user:read:chat",
    "user:write:chat",
    "user:bot",
    "channel:read:subscriptions"
]
query = {
    "response_type": "code",
    "client_id": "lnn0xjhakjukg3r77tgnjpquxt1y2t",
    "redirect_uri": "http://localhost:8080/api/v1/login",
    "scope": " ".join(scopes),
    "state": "c3ab8aa609ea11e793ae92361f002671"
}

url = f"{baseUrl}?{urllib.parse.urlencode(query)}"

with open("login.txt", "w") as f:
    f.write(url)

print(url)

