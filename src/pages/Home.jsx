import { useNavigate } from "react-router"
import { useState } from "react";
import SpringModal from "../components/SpringModal"
function Home() {
    const navigate = useNavigate();
    const [steamUrl, setSteamUrl] = useState("")
    const [validationError, setValidationError] = useState("")

    const validateSteamUrl = (url) => {

        if (!url.includes('steamcommunity.com')) {
            return "Please enter a valid Steam community URL";
        }
        const steamPatterns = [
            /steamcommunity\.com\/profiles\/\d+/,      // Direct Steam ID
            /steamcommunity\.com\/id\/[^\/]+/          // Custom URL
        ];

        // Check if URL matches expected Steam patterns
        const isValidSteamUrl = steamPatterns.some(pattern => pattern.test(url));

        if (!isValidSteamUrl) {
            return "Please enter a valid Steam profile URL (e.g., https://steamcommunity.com/profiles/123456 or https://steamcommunity.com/id/username)";
        }

        return "";
    }


    //when the url button is submitted
    const onSubmit = (e) => {
        e.preventDefault()
        const error = validateSteamUrl(steamUrl);
        setValidationError(error);
        if (error === '') {
            navigate(`/userPage/${encodeURIComponent(steamUrl)}`);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <div className="steam-card p-8 w-full max-w-md">
                <form className="flex flex-col items-center space-y-6" onSubmit={onSubmit}>
                    <h2 className="text-2xl font-semibold text-[var(--text-color)] mb-4 text-center">
                        Enter Steam Profile URL
                    </h2>
                    <input
                        type="text"
                        value={steamUrl}
                        onChange={(e) => {
                            setSteamUrl(e.target.value);
                            setValidationError(validateSteamUrl(e.target.value));
                        }}
                        id="myTextBox"
                        name="myTextBox"
                        placeholder="https://steamcommunity.com/profiles/..."
                        className="w-full px-4 py-3 text-base rounded focus:outline-none transition-all duration-200"
                        required
                    />
                    {validationError && (
                        <p className="text-red-400 text-sm mt-2 px-1">
                            {validationError}
                        </p>
                    )}
                    <button
                        className="w-full px-8 py-3 text-lg font-medium rounded uppercase tracking-wide"
                        type="submit"
                    >
                        Find Games
                    </button>
                </form>
                <SpringModal />
            </div>

            <div className="mt-8 text-center">
                <p className="text-[var(--text-secondary)] text-xsm mb-4">
                    Discover your next favorite game from your Steam library
                </p>
                <p className="text-[var(--text-secondary)] text-xsm">
                    If you would like to use this app, please make your Steam profile public
                </p>
            </div>
        </div>
    )
}

export default Home