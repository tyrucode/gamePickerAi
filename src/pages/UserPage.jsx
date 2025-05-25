import { useParams } from "react-router"
import { useState, useEffect } from "react"
import axios from "axios"

function UserPage() {
    const { steamUrl } = useParams();
    const [userData, setUserData] = useState(null);
    const [games, setGames] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('fetching data for your steam url:', steamUrl);

                // fetch the users profile
                const userResponse = await axios.get(
                    `http://localhost:5173/api/steam/user/${encodeURIComponent(steamUrl)}`
                );

                console.log('user response:', userResponse.data);
                //setting the user to what we get from our api
                const user = userResponse.data;
                setUserData(user);

                // fetching the users games
                console.log('fetching games from steam id:', user.steamId);
                const gamesResponse = await axios.get(
                    `http://localhost:5173/api/steam/games/${user.steamId}`
                );
                console.log('games response:', gamesResponse.data);
                //setting the games as what we get from our api (or blank)
                setGames(gamesResponse.data.games || []);

                // fetching 5 game reccomendations from our api
                const recResponse = await axios.get(
                    `http://localhost:5173/api/steam/recommendations/${user.steamId}?limit=5`
                );
                console.log('reccommendations response:', recResponse.data);
                //setting our reccomendations we get from api as what we get (or blank)
                setRecommendations(recResponse.data.recommendations || []);
                //error handling
            } catch (err) {
                console.error('error fetching data:', err);
                setError(err.response.data.error || 'failed to fetch Steam data');
                //if everything works stop loading
            } finally {
                setLoading(false);
            }
        };
        //use that url and actually fetch the data with the function we just made above
        if (steamUrl) {
            fetchUserData();
        }
    }, [steamUrl]);
    //simple loading screen
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-[var(--text-color)] text-xl">Loading Steam profile...</div>
            </div>
        );
    }
    //return the error if there is a error
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="steam-card p-8 max-w-md text-center">
                    <h2 className="text-xl font-semibold text-[var(--accent-orange)] mb-4">Error</h2>
                    <p className="text-[var(--text-color)]">{error}</p>
                    <a
                        href="/"
                        className="inline-block mt-4 px-6 py-2 bg-[var(--ui-element-colors)] text-white rounded hover:bg-[var(--ui-element-hover)]"
                    >
                        Try Again
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* user profile from api request */}
            {userData && (
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
            )}

            {/* game reccs from the api req */}
            {recommendations && recommendations.length > 0 && (
                <div className="steam-card p-6">
                    <h3 className="text-xl font-semibold text-[var(--text-color)] mb-4">
                        Games You Should Play
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map(game => (
                            <div key={game.appid} className="bg-[var(--background)] p-4 rounded border border-[var(--border-color)]">
                                <img
                                    src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                    alt={game.name}
                                    className="w-8 h-8 mb-2"
                                />
                                <h4 className="text-[var(--text-color)] font-medium text-sm">
                                    {game.name}
                                </h4>
                                <p className="text-[var(--text-secondary)] text-xs">
                                    Playtime: {Math.floor((game.playtime_forever || 0) / 60)}h {(game.playtime_forever || 0) % 60}m
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* list of the top games from the api res */}
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

export default UserPage