import BASE_URL from "../../apis/BASE_URL";

export default function GoogleButton({ label }) {

    const handleGoogleLogin = () => {
        const googleLoginUrl = `${BASE_URL}/auth/google`;
        const newWindoW = window.open(googleLoginUrl, "_blank", "width=500,height=500", "noopener");
        if (newWindoW) {
            let timer = setInterval(() => {
                if (newWindoW.closed) {
                    clearInterval(timer);
                }
            }, 500);
        };
    }


    return (
        <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 px-5 py-2 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition duration-300     mx-auto bg-white text-sm font-medium"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M533.5 278.4c0-17.4-1.4-34.1-4-50.4H272v95.3h146.9c-6.3 34.4-25.1 63.6-53.7 83.1v68h86.9c51.1-47 81.4-116.2 81.4-196z"
                    fill="#4285f4"
                />
                <path
                    d="M272 544.3c72.6 0 133.4-24 177.8-64.9l-86.9-68c-24.1 16.1-55 25.5-90.9 25.5-69.9 0-129.2-47.2-150.4-110.3h-89v69.2C76.1 477.3 167.7 544.3 272 544.3z"
                    fill="#34a853"
                />
                <path
                    d="M121.6 326.6c-10-29.7-10-61.6 0-91.3v-69.2h-89c-39.2 77.7-39.2 168.3 0 246l89-69.2z"
                    fill="#fbbc04"
                />
                <path
                    d="M272 107.7c39.5-.6 77.5 13.8 106.8 39.4l80.1-80.1C407.9 23.1 342.1-.1 272 0 167.7 0 76.1 67 32.6 165.2l89 69.2C142.8 154.9 202.1 107.7 272 107.7z"
                    fill="#ea4335"
                />
            </svg>
            <span>{label}</span>
        </button>
    );
}
