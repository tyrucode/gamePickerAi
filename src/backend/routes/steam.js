const express = require('express');
const axios = require('axios');
const router = express.Router();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const BASE_URL = 'https://api.steampowered.com';

// Helper function to extract Steam ID from profile URL
function extractSteamId(steamUrl) {
    // Handle different steam URL formats
    const patterns = [
        /steamcommunity\.com\/profiles\/(\d+)/,
        /steamcommunity\.com\/id\/([^\/]+)/
    ];
    //if the url matches one of our expected url patterns return it, if none are true return null
    for (const pattern of patterns) {
        const match = steamUrl.match(pattern);
        if (match) {
            return match[1];
        }
    }
    return null;
}

// route to get user profile info
router.get('/user/:steamUrl(*)', async (req, res) => {
    try {
        //get decoded url parameter
        const steamUrl = decodeURIComponent(req.params.steamUrl);
        console.log('received steam url:', steamUrl);
        //extreact the id from the url with funciton from earlier
        let steamId = extractSteamId(steamUrl);
        console.log('extracted steam id:', steamId);
        //if no steam id then return error
        if (!steamId) {
            console.log('invalid url format');
            return res.status(400).json({ error: 'invalid steam url format' });
        }

        // if its a custom url we use api to turn it back into a uisual steam url
        if (isNaN(steamId)) {
            console.log('fixing custom url:', steamId);
            //using api, to get the id of the custom url
            const resolveResponse = await axios.get(
                `${BASE_URL}/ISteamUser/ResolveVanityURL/v0001/`, {
                headers: {
                    'Accept': 'application/json'
                }, params: {
                    key: STEAM_API_KEY,
                    vanityurl: steamId
                }
            }
            );

            console.log('resolve response:', resolveResponse.data);
            //if the resolve isnt a  success, then 404 + error
            if (resolveResponse.data.response.success !== 1) {
                return res.status(404).json({ error: 'that steam profile isnt found' });
            }
            //set steam id to the steam id we got from the functions above
            steamId = resolveResponse.data.response.steamid;
            console.log('Resolved Steam ID:', steamId);
        }

        // getting user summary 
        console.log('fetching the user summary:', steamId);
        const userResponse = await axios.get(
            `${BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/`, {
            headers: {
                'Accept': 'application/json'
            }, params: {
                key: STEAM_API_KEY,
                steamids: steamId
            }
        }
        );

        console.log('user response:', userResponse.data);
        //get the first of the user data that is present
        const userData = userResponse.data.response.players[0];
        //error handle if no user data
        if (!userData) {
            return res.status(404).json({ error: 'steam profile not found' });
        }


        // check if profile is public
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

        console.log('sending res:', responseData);
        res.json(responseData);

    } catch (error) {
        //error handling
        console.error('error fetching data:', error.message);
        if (error.response) {
            console.error('error response data:', error.response.data);
        }
        res.status(500).json({ error: 'failed to fetch the steam data' });
    }
});

// route to get the users owned games
router.get('/games/:steamId', async (req, res) => {
    try {
        //get steam id from parameters
        const { steamId } = req.params;
        console.log('fetching games from the steam id:', steamId);

        const gamesResponse = await axios.get(
            `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`, {
            headers: {
                'Accept': 'application/json'
            }, params: {
                key: STEAM_API_KEY,
                steamid: steamId,
                include_appinfo: true,
                include_played_free_games: true
            }
        }
        );

        console.log('response from requesting game data:', gamesResponse.data);
        //making gamesdata our response
        const gamesData = gamesResponse.data.response;
        //error handling
        if (!gamesData.games || gamesData.games.length === 0) {
            console.log('account private or no games found.');
            return res.json({ games: [], gameCount: 0 });
        }

        console.log(`found ${gamesData.games.length} games`);

        // sorting games based on hours
        const sortedGames = gamesData.games.sort((a, b) =>
            (b.playtime_forever || 0) - (a.playtime_forever || 0)
        );

        res.json({
            games: sortedGames,
            gameCount: gamesData.game_count
        });
        //error handling
    } catch (error) {
        console.error('error fetching the data from the games:', error.message);
        if (error.response) {
            console.error('api error fetching games:', error.response.data);
        }
        res.status(500).json({ error: 'failed to fetch the game data' });
    }
});

// route to get 5 random / barely played games
router.get('/recommendations/:steamId', async (req, res) => {
    try {
        //getting data from the params
        const { steamId } = req.params;
        const { limit = 5 } = req.query;
        //our game request
        const gamesResponse = await axios.get(
            `${BASE_URL}/IPlayerService/GetOwnedGames/v0001/`, {
            headers: {
                'Accept': 'application/json'
            }, params: {
                key: STEAM_API_KEY,
                steamid: steamId,
                include_appinfo: true,
                include_played_free_games: true
            }
        }
        );
        //setting this data as our res
        const gamesData = gamesResponse.data.response;
        //if no games or unplayed then return those
        if (!gamesData.games || gamesData.games.length === 0) {
            return res.json({ recommendations: [] });
        }

        // allowing games that are unplayed or barely played
        const underplayedGames = gamesData.games.filter(game =>
            (game.playtime_forever || 0) < 120 // less than 2 hours (minutes)
        );

        // shuffling / picking unplayed games that we find above
        const shuffled = underplayedGames.sort(() => 0.5 - Math.random());
        const recommendations = shuffled.slice(0, parseInt(limit));

        res.json({ recommendations });
        //error handling
    } catch (error) {
        console.error('error fetching reccomendations:', error.message);
        res.status(500).json({ error: 'failed to fetch game recommendations' });
    }
});

module.exports = router;