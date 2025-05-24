import { useNavigate } from "react-router"
import { useState } from "react";

function Home() {
    const navigate = useNavigate();
    const [steamUrl, setSteamUrl] = useState("")

    const onSubmit = (e) => {
        e.preventDefault()
        if (steamUrl.trim()) {
            // Encode the URL to make it safe for URL parameters
            const encodedUrl = encodeURIComponent(steamUrl)
            navigate(`/userPage/${encodedUrl}`)
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
                        onChange={(e) => setSteamUrl(e.target.value)}
                        id="myTextBox"
                        name="myTextBox"
                        placeholder="https://steamcommunity.com/profiles/..."
                        className="w-full px-4 py-3 text-base rounded focus:outline-none transition-all duration-200"
                        required
                    />
                    <button
                        className="w-full px-8 py-3 text-lg font-medium rounded uppercase tracking-wide"
                        type="submit"
                    >
                        Find Games
                    </button>
                </form>
            </div>

            {/* Optional: Add some Steam-like decorative elements */}
            <div className="mt-8 text-center">
                <p className="text-[var(--text-secondary)] text-xsm mb-4">
                    Discover your next favorite game from your Steam library
                </p>
                <p className="text-[var(--text-secondary)] text-xsm">
                    If you would like to use this app, please make Steam profile public
                </p>
            </div>
        </div>
    )
}

export default Home