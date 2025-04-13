const createFakeToken = () => {
    const fakeToken = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // ينتهي بعد ساعة
        role: "admin", // حط أي دور تبغى تختبره
    };

    const base64UrlEncode = (obj) => {
        return btoa(JSON.stringify(obj))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    };

    const header = { alg: "HS256", typ: "JWT" };
    const token = [
        base64UrlEncode(header),
        base64UrlEncode(fakeToken),
        "signature_placeholder"
    ].join(".");

    localStorage.setItem("token", token);
    return token;
}

export default createFakeToken; 
export const removeFakeToken = () => {
    localStorage.removeItem("token");
}