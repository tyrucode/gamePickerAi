const express = require('express');
const axios = require('axios');
const router = express.Router();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = 'https://api.steampowered.com';

// Helper function to extract Steam ID from profile URL
function extractSteamId(steamUrl) {
    // Handle different Steam URL formats
    const patterns = [
        /steamcommunity\.com\/profiles\/(\d+)/,
        /steamcommunity\.com\/id\/([^\/]+)/
    ];

    for (const pattern of patterns) {
        const match = steamUrl.match(pattern);
        if (match) {
            return match[1];
        }
    }
    return null;
}

// Route to get user profile info
router.get('/user/:steamUrl(*)', async (req, res) => {
    try {
        const steamUrl = decodeURIComponent(req.params.steamUrl);
        console.log('Received Steam URL:', steamUrl);

        let steamId = extractSteamId(steamUrl);
        console.log('Extracted Steam ID:', steamId);

        if (!steamId) {
            console.log('Invalid Steam URL format');
            return res.status(400).json({ error: 'Invalid Steam URL format' });
        }

        // If it's a custom URL (not numeric), resolve it to Steam ID
        if (isNaN(steamId)) {
            console.log('Resolving vanity URL:', steamId);
            const resolveResponse = await axios.get(
                `${BASE_URL}/ISteamUser/ResolveVanityURL/v0001/`, {
                params: {
                    key: STEAM_API_KEY,
                    vanityurl: steamId
                }
            }
            );

            console.log('Resolve response:', resolveResponse.data);

            if (resolveResponse.data.response.success !== 1) {
                return res.status(404).json({ error: 'Steam profile not found' });
            }

            steamId = resolveResponse.data.response.steamid;
            console.log('Resolved Steam ID:', steamId);
        }

        // Get user summary
        console.log('Fetching user summary for Steam ID:', steamId);
        const userResponse = await axios.get(
            `${BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/`, {
            params: {
                key: STEAM_API_KEY,
                steamids: steamId
            }
        }
        );

        console.log('User response:', userResponse.data);

        const userData = userResponse.data.response.players[0];
        if (!userData) {
            return res.status(404).json({ error: 'Steam profile not found' });
        }

        console.log('User data found:', userData.personaname);
        console.log('Community visibility state:', userData.communityvisibilitystate);

        // Check if profile is public
        if (userData.communityvisibilitystate !== 3) {
            return res.status(403).json({
                error: 'Steam profile is private. Please make your profile public to use this service.'
            });
        }

        const responseData = {
            steamId: userData.steamid,
            personaName: userData.personaname,
            avatarUrl: userData.avatarfull,
            profileUrl: userData.profileurl,
            countryCode: userData.loccountrycode,
            timeCreated: userData.timecreated
        };

        console.log('Sending response:', responseData);
        res.json(responseData);

    } catch (error) {
        console.error('Error fetching user data:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch Steam profile data' });
    }
});

// Route to get user's owned games
router.get('/games/:steamId', async (req, res) => {
    try {
        const { steamId } = req.params;
        console.log('Fetching games for Steam ID:', steamId);

        const gamesResponse = await axios.get(
            `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`, {
            params: {
                key: STEAM_API_KEY,
                steamid: steamId,
                include_appinfo: true,
                include_played_free_games: true
            }
        }
        );

        console.log('Games API response:', gamesResponse.data);

        const gamesData = gamesResponse.data.response;

        if (!gamesData.games || gamesData.games.length === 0) {
            console.log('No games found or games list is private');
            return res.json({ games: [], gameCount: 0 });
        }

        console.log(`Found ${gamesData.games.length} games`);

        // Sort games by playtime (most played first)
        const sortedGames = gamesData.games.sort((a, b) =>
            (b.playtime_forever || 0) - (a.playtime_forever || 0)
        );

        res.json({
            games: sortedGames,
            gameCount: gamesData.game_count
        });

    } catch (error) {
        console.error('Error fetching games data:', error.message);
        if (error.response) {
            console.error('Games API error response:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch games data' });
    }
});

// Route to get random unplayed or barely played games
router.get('/recommendations/:steamId', async (req, res) => {
    try {
        const { steamId } = req.params;
        const { limit = 5 } = req.query;

        const gamesResponse = await axios.get(
            `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`, {
            params: {
                key: STEAM_API_KEY,
                steamid: steamId,
                include_appinfo: true,
                include_played_free_games: true
            }
        }
        );

        const gamesData = gamesResponse.data.response;

        if (!gamesData.games || gamesData.games.length === 0) {
            return res.json({ recommendations: [] });
        }

        // Filter games with less than 2 hours played (or never played)
        const underplayedGames = gamesData.games.filter(game =>
            (game.playtime_forever || 0) < 120 // less than 2 hours in minutes
        );

        // Shuffle and pick random games
        const shuffled = underplayedGames.sort(() => 0.5 - Math.random());
        const recommendations = shuffled.slice(0, parseInt(limit));

        res.json({ recommendations });

    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        res.status(500).json({ error: 'Failed to fetch game recommendations' });
    }
});

module.exports = router;