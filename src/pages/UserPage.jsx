import { useParams } from "react-router";
import { useState, useEffect } from "react";

function UserPage() {
    const { steamUrl } = useParams();
    const [userData, setUserData] = useState(null);
    const [games, setGames] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);


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

                const recRes = await fetch(`http://localhost:5000/api/steam/recommendations/${user.steamId}?limit=5`);
                if (!recRes.ok) throw new Error('Failed to fetch recommendations');
                const recData = await recRes.json();
                console.log('recommendations response:', recData);
                setRecommendations(recData.recommendations || []);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-[var(--text-color)] text-xl">Loading Steam profile...</div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="flex justify-center items-center min-h-[50vh]">
    //             <div className="steam-card p-8 max-w-md text-center">
    //                 <h2 className="text-xl font-semibold text-[var(--accent-orange)] mb-4">Error</h2>
    //                 <p className="text-[var(--text-color)]">{error}</p>
    //                 <a
    //                     href="/"
    //                     className="inline-block mt-4 px-6 py-2 bg-[var(--ui-element-colors)] text-white rounded hover:bg-[var(--ui-element-hover)]"
    //                 >
    //                     Try Again
    //                 </a>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div key={steamUrl} className="max-w-6xl mx-auto space-y-8">
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
