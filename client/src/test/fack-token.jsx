const createFakeToken = () => {
    const fakeToken = {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        role: "user",
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

 const removeFakeToken = () => {
    localStorage.removeItem("token");
}


export default  function FeckHeader() {
    return <>
        {/* Uncomment the following lines to test the token creation and removal functionality */}
        <div className=" bg-white shadow-md p-4 flex justify-around items-center">
            <button className="bg-main text-white py-3 px-6 rounded-lg" onClick={createFakeToken}>Crete Token For Testing</button>
            <button className="bg-main text-white py-3 px-6 rounded-lg" onClick={removeFakeToken}>Logout</button>
        </div>
    </>
}

