export async function redirectToAuthCodeFlow (clientId, redirectUri) {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = base64encode(await sha256(codeVerifier));

    const scope = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        "playlist-modify-private",
    ].join(" ");

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    window.localStorage.setItem("code_verifier", codeVerifier);

    const params = {
        response_type: "code",
        client_id: clientId,
        scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

export const getToken = async (clientId, code, redirectUri) => {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const codeVerifier = localStorage.getItem("code_verifier");

    if (!codeVerifier) {
        throw new Error("No code verifier found. Please log in again.");
    }

    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: "authorization_code",
            code, 
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    };

    const response = await fetch(tokenUrl, payload);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token request failed: ${errorData.error_description || response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    // const profile = await fetchProfile(data.access_token)
    // console.log("Your Profile:", profile); // Debug log for token data
    return data.access_token;
};

export async function getUserID (token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!result.ok) {
        throw new Error("Failed to fetch user profile");
    }
    const data = await result.json();
    const userID = data.id
    return userID;
}

const generateRandomString = (length) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
};
