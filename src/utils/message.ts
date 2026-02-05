export function mapMessageVariables(message: string, replaceMap: Record<string, any>) {
    let res = message
    for (const [key, value] of Object.entries(replaceMap)) {
        res = res.replace(new RegExp(key, "g"), String(value))
    }
    return res
}