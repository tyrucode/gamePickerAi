import { useParams } from "react-router";
import { useState, useEffect } from "react";

function UserPage() {
    const { steamUrl } = useParams();
    const [userData, setUserData] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gptAnswer, setGptAnswer] = useState("");
    const [errorGPT, setErrorGPT] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);


                console.log('fetching data for your steam url:', steamUrl);

                const userRes = await fetch(`http://localhost:5000/api/steam/user/${encodeURIComponent(steamUrl)}`);
                if (!userRes.ok) throw new Error('Failed to fetch user');
                const user = await userRes.json();
                console.log('user response:', user);
                setUserData(user);

                const gamesRes = await fetch(`http://localhost:5000/api/steam/games/${user.steamId}`);
                if (!gamesRes.ok) throw new Error('Failed to fetch games');
                const gamesData = await gamesRes.json();
                console.log('games response:', gamesData);
                setGames(gamesData.games || []);


            } catch (err) {
                console.error('error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (steamUrl) {
            fetchUserData();
        }
    }, [steamUrl]);


    async function handleGetReccomendations() {
        setLoading(true);
        setErrorGPT(null);
        setGptAnswer("");
        try {
            const response = await fetch(`http://localhost:5000/api/steam/askingForRecs/${userData.steamId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations from OpenAI');
            }
            const data = await response.json();
            setGptAnswer(data.recommendation);

        } catch (error) {
            console.error('error fetching reccomendation:', error);
            setErrorGPT('Failed to fetch recommendations from OpenAi, please try again later or refresh.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-[var(--text-color)] text-xl">Loading Steam profile...</div>
            </div>
        );
    }


    return (
        <div key={steamUrl} className="max-w-6xl mx-auto space-y-8">
            {userData && (
                <>
                    <div className="steam-card p-6">
                        <div className="flex items-center space-x-6">
                            <img
                                src={userData.avatarUrl}
                                alt={userData.personaName}
                                className="w-20 h-20 rounded"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text-color)]">
                                    {userData.personaName}
                                </h2>
                                <p className="text-[var(--text-secondary)]">
                                    Total Games: {games?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* throw gpt talking right here */}
                    <div className="steam-card p-6">
                        <h1 className="text-2xl font-bold text-[var(--text-color)]">Ask ChatGPT!</h1>
                        <button
                            onClick={handleGetReccomendations}
                            className="w-half px-8 py-3 text-lg font-medium rounded tracking-wide"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Based on my past games, what should I play?"}
                        </button>

                        <div className="mt-4">
                            <h2 className="text-lg font-semibold">ANSWER:</h2>
                            {errorGPT && <p className="text-red-500">{errorGPT}</p>}
                            <pre className="whitespace-pre-wrap text-[var(--text-color)]">{gptAnswer}</pre>
                        </div>
                    </div>
                </>
            )}

            {games && games.length > 0 && (
                <div className="steam-card p-6">
                    <h3 className="text-xl font-semibold text-[var(--text-color)] mb-4">
                        Most Played Games
                    </h3>
                    <div className="space-y-3">
                        {games.slice(0, 10).map(game => (
                            <div key={game.appid} className="flex items-center justify-between p-3 bg-[var(--background)] rounded">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                        alt={game.name}
                                        className="w-8 h-8"
                                    />
                                    <span className="text-[var(--text-color)]">{game.name}</span>
                                </div>
                                <span className="text-[var(--text-secondary)]">
                                    {Math.floor((game.playtime_forever || 0) / 60)}h {(game.playtime_forever || 0) % 60}m
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserPage;
