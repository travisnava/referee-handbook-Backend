const express = require("express")
const Redis = require("ioredis")
const axios = require("axios")
const router = express.Router()
const redis = new Redis(process.env.REDIS_URL)

// storing all the information for leagues, leagueName and seasons of each respective sport
const requestParams = {"basketball": {"league": 12, "season": "2021-2022", "leagueName": "NBA"},
                    "baseball": {"league": 1, "season": "2022", "leagueName": "MLB"},
                    "soccer": {"league": 253, "season": "2022", "leagueName": "Major League Soccer"},
                    "hockey": {"league": 57, "season": "2021", "leagueName": "NHL"},
                    "volleyball": {"league": 180, "season": "2022", "leagueName": "NVA"},
                    "rugby": {"league": 44, "season": "2022", "leagueName": "Major League Rugby"}}

//Sanitary check
router.get("/", async(req, res, next) =>{
    try {
        return res.status(200).json({"sports": "pong"})
    } catch (err) {
        next(err)
    }
})

// fetching a list of teams for the sport and season
router.get("/:sportName/teams", async(req, res, next) =>{
    try {
        const {sportName} = req.params

        let apiSportString = 'v1.'+sportName
        // the api version for soccer is v3, different from the rest
        if(sportName == "soccer"){
            apiSportString = "v3.football"
        }

        // check if we have a cached value of the sport we want
        let cacheEntry = await redis.get(`teams:${sportName}`)

        // if cache hit, return that entry
        if(cacheEntry) {
            cacheEntry = JSON.parse(cacheEntry)
            return res.status(200).json({"json": cacheEntry, "source": "cache"})
        }

        // otherwise call api, conditionally fetches by the league and season of the specific sport
        let json = await axios.get("https://"+apiSportString+".api-sports.io/teams?league="+requestParams[sportName].league+"&season="+requestParams[sportName].season, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": apiSportString+".api-sports.io",
                "x-rapidapi-key": process.env.SPORTS_API_KEY
            }
        })
        

        redis.set(`teams:${sportName}`, JSON.stringify(json.data.response), 'EX', 13149000)
        
        return res.status(200).json({"json": json.data.response, "source": "api", "limit": json.data.errors.rateLimit})
    } catch (err) {
        next(err)
    }
})

// fetching the most recent game of a sport
router.get("/:sportName/recentGame", async(req, res, next) =>{
    try {
        const {sportName} = req.params

        let apiSportString = 'v1.'+sportName
        let endpoint = "/games"
        // the api version for soccer is v3, endpoint is fixtures, different from the rest
        if(sportName == "soccer"){
            apiSportString = "v3.football"
            endpoint = "/fixtures"
        }

         // check if we have a cached value of the sport we want
         let cacheEntry = await redis.get(`recentGame:${sportName}`)

         // if cache hit, return that entry
         if(cacheEntry) {
             cacheEntry = JSON.parse(cacheEntry)
             return res.status(200).json({"json": cacheEntry, "source": "cache"})
         }

         // otherwise, call api
        let json = await axios.get("https://"+apiSportString+".api-sports.io"+endpoint+"?league="+requestParams[sportName].league+"&season="+requestParams[sportName].season, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": apiSportString+".api-sports.io",
                    "x-rapidapi-key": process.env.SPORTS_API_KEY
                }
        })

        // soccer data is formatted differently, have to filter differently
        if(sportName === "soccer"){
            // filter to find the matches that finished/is in progress
            let filtered_games = json.data.response.filter((item)=>item.fixture.date < new Date().toISOString())

            // set the updated game
            redis.set(`recentGame:${sportName}`, JSON.stringify(filtered_games[filtered_games.length - 1]), 'EX', 60)
            return res.status(200).json({"json": filtered_games[filtered_games.length - 1], "source": "api"})
        }

        // data filtering for all the other sports
        else{
            let filtered_games_others = json.data.response.filter((item)=>item.date < new Date().toISOString())
            redis.set(`recentGame:${sportName}`, JSON.stringify(filtered_games_others[filtered_games_others.length - 1]), 'EX', 90)
            return res.status(200).json({"json": filtered_games_others[filtered_games_others.length - 1], "source": "api", "limit": json.data.errors.rateLimit})
        }     
        
    } catch (err) {
        next(err)
    }
})

router.get("/:sportName/news", async(req, res, next) =>{
    try {
        const {sportName} = req.params
        // check if we have a cached value of the sport we want
        let cacheEntry = await redis.get(`news:${sportName}`)

        // if cache hit, return that entry
        if(cacheEntry) {
            cacheEntry = JSON.parse(cacheEntry)
            return res.status(200).json({"json": cacheEntry, "source": "cache"})
        }

        // otherwise, call api
        let json = await axios.get('https://api.thenewsapi.com/v1/news/all?api_token='+process.env.NEWS_API_KEY+"&search="+sportName+"&language=en&sort=published_at&limit=2&categories=sports")
        redis.set(`news:${sportName}`, JSON.stringify(json.data.data), 'EX', 300)
        return res.status(200).json({"news": json.data.data})
    } catch (err) {
        if(err.response.status === 402){
            return res.status(402).json({"error": err.response})
        }
        next(err)
    }
})

router.get("/:sportName/:teamId", async(req, res, next) =>{
    try {
        const {sportName, teamId} = req.params
        let apiSportString = 'v1.'+sportName
        // the api version for soccer is v3, different from the rest
        if(sportName == "soccer"){
            apiSportString = "v3.football"
        }

         // check if we have a cached value of the sport we want
         let cacheEntry = await redis.get(`team:${sportName}${teamId}`)

         // if cache hit, return that entry
         if(cacheEntry) {
             cacheEntry = JSON.parse(cacheEntry)
             return res.status(200).json({"json": cacheEntry, "source": "cache"})
         }

        let json = await axios.get("https://"+apiSportString+".api-sports.io/teams?id="+teamId, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": apiSportString+".api-sports.io",
                    "x-rapidapi-key": process.env.SPORTS_API_KEY
                }
            })
        redis.set(`team:${sportName}${teamId}`, JSON.stringify(json.data.response), 'EX', 13149000)
        return res.status(200).json({"json": json.data.response, "source": "api", "limit": json.data.errors.rateLimit})
    } catch (err) {
        next(err)
    }
})

router.get("/:sportName/:teamId/stats", async(req, res, next) => {
    try {
        const {sportName, teamId} = req.params
        let apiSportString = 'v1.'+sportName
        let endpoint = "/teams/statistics"
        // the api version for soccer is v3, different from the rest
        if(sportName === "soccer"){
            apiSportString = "v3.football"
        }
        // endpoint for basketball is different
        if(sportName === "basketball"){
            endpoint = "/statistics"
        }
        // check if we have a cached value of the sport we want
        let cacheEntry = await redis.get(`stats:${sportName}${teamId}`)

        // if cache hit, return that entry
        if(cacheEntry) {
            cacheEntry = JSON.parse(cacheEntry)
            return res.status(200).json({"json": cacheEntry, "source": "cache"})
        }

        let json = await axios.get("https://"+apiSportString+".api-sports.io"+endpoint+"?team="+teamId+"&league="+requestParams[sportName].league+"&season="+requestParams[sportName].season, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": apiSportString+".api-sports.io",
                "x-rapidapi-key": process.env.SPORTS_API_KEY
            }
        })
        redis.set(`stats:${sportName}${teamId}`, JSON.stringify(json.data.response), 'EX', 18000)
        return res.status(200).json({"json": json.data.response, "source": "api", "limit": json.data.errors.rateLimit})

    } catch (err) {
        next(err)
    }
})

router.get("/:sportName/:teamId/games", async(req, res, next) => {
    try{
        const {sportName, teamId} = req.params
        let apiSportString = 'v1.'+sportName
        let endpoint = "/games"
        // the api version for soccer is v3, endpoint is fixtures, different from the rest
        if(sportName == "soccer"){
            apiSportString = "v3.football"
            endpoint = "/fixtures"
        }
        // check if we have a cached value of the sport we want
        let cacheEntry = await redis.get(`games:${sportName}${teamId}`)

        // if cache hit, return that entry
        if(cacheEntry) {
            cacheEntry = JSON.parse(cacheEntry)
            return res.status(200).json({"json": cacheEntry, "source": "cache"})
        }
        // conditionally fetches by the league and season of the specific sport
        let json = await axios.get("https://"+apiSportString+".api-sports.io"+endpoint+"?league="+requestParams[sportName].league+"&season="+requestParams[sportName].season+"&team="+teamId, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": apiSportString+".api-sports.io",
                "x-rapidapi-key": process.env.SPORTS_API_KEY
            }
        })
        redis.set(`games:${sportName}${teamId}`, JSON.stringify(json.data.response), 'EX', 18000)
        return res.status(200).json({"json": json.data.response, "source": "api", "limit": json.data.errors.rateLimit})
    } catch(err){
        next(err)
    }
})

module.exports = router