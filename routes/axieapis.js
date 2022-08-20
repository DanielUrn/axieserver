import Router from 'express'
import axios from 'axios'

const router = Router()

//EACH LAND SPECIFIC OBJECT
//This object was getting all lands with no criteria
//I separated each land between staked and unstaked
//Lands on sale will appear on unstaked as well
//IDs for lands are rows and cols
var ETHWalletLand = { staked: [], unstaked: [] }

//For some reason this was an object inside of an array ???
//I took the array off
var StakedUnstakedArray = { unstaked: 0, staked: 0 }; //COUNTING AXS REWARD PER TYPE OF LAND

const vercel = "https://landplots.vercel.app/land/"
const axiegraphql = "https://graphql-gateway.axieinfinity.com/graphql"
const roninrest = "https://ronin.rest"
const maxbrand = "https://game-api.axie.technology"
const runes = "https://game-api-origin.skymavis.com/v2/runes"

router.get('/land/:address', (req, res) => {
    //The code below seems sort of inefficient
    //It was written by an Axie MOD called HenriCoder
    //See https://coderhenri.github.io/MinAccWorthV3/, its made with just Vanilla JS, HTML and CSS
    axios.get(vercel + req.params.address)

        .then(function (response) {
            return response.data;
        })

        .then(function (data) {
            for (let k = 0; k < data.owned.length; k++) {
                ETHWalletLand.unstaked.push(data.owned[k]);
            }
            for (let m = 0; m < data.staked.length; m++) {
                ETHWalletLand.staked.push(data.staked[m]);
            }

            //LOL, I know mapping would be better
            //this is calculating rewards per type of land
            //in separated properties
            for (let n = 0; n < data.owned.length; n++) {
                if (data.owned[n].landType == "Genesis") {
                    StakedUnstakedArray.unstaked += 32.7;
                } else if (data.owned[n].LandType == "Mystic") {
                    StakedUnstakedArray.unstaked += 1.64;
                } else if (data.owned[n].LandType == "Arctic") {
                    StakedUnstakedArray.unstaked += 0.74;
                } else if (data.owned[n].LandType == "Forest") {
                    StakedUnstakedArray.unstaked += 0.26;
                } else if (data.owned[n].LandType == "Savannah") {
                    StakedUnstakedArray.unstaked += 0.08;
                }
            }
            StakedUnstakedArray.unstaked = Math.round((StakedUnstakedArray.unstaked + Number.EPSILON) * 10000) / 10000;

            for (let o = 0; o < data.staked.length; o++) {
                if (data.staked[o].LandType == "Genesis") {
                    StakedUnstakedArray.staked += 32.7;
                } else if (data.staked[o].LandType == "Mystic") {
                    StakedUnstakedArray.staked += 1.64;
                } else if (data.staked[o].LandType == "Arctic") {
                    StakedUnstakedArray.staked += 0.74;
                } else if (data.staked[o].LandType == "Forest") {
                    StakedUnstakedArray.staked += 0.26;
                } else if (data.staked[o].LandType == "Savannah") {
                    StakedUnstakedArray.staked += 0.08;
                }
            }
            StakedUnstakedArray.staked = Math.round((StakedUnstakedArray.staked + Number.EPSILON) * 10000) / 10000;
            res.status(200).json([ETHWalletLand, StakedUnstakedArray])
        });
})

router.get('/energy/:address', (req, res) => {
    axios.post(axiegraphql, {
        "operationName": "GetAxieBriefList",
        "variables": {
            "auctionType": 'NotForSale',
            "owner": req.params.address.replace('ronin:', '0x') //This replacement is needed
            //DO NOT CHANGE THE OWNER VAR
        },
        "query": "query GetAxieBriefList($auctionType:AuctionType, $owner: String) {\n  axies(auctionType: $auctionType,owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n"
        //Query model tends to throw error if
        //the following JSON {\n    total\n    results {\n.....
        //is changed
    }).then((response) => {
        const totalaxies = response.data.data.axies.total
        //simple logic with ternary operators
        const maxenergies = (totalaxies >= 3) && (totalaxies <= 9) ? 20 : (totalaxies >= 10) && (totalaxies <= 19) ? 40 : totalaxies >= 20 ? 60 : 0

        const date = new Date()
        const day = date.getDate()
        const year = date.getFullYear()
        const month = date.getMonth()
        const today = Date.parse(new Date(Date.UTC(year, month, day))) //reset time UTC+0

        let battlestoday = 0

        axios.get(maxbrand + "/logs/pvp/" + req.params.address).then((response) => {

            for (let battle of response.data.battles) {
                if(Date.parse(battle.game_ended) > today) {battlestoday+=1}
            }
            res.status(200).json(battlestoday > maxenergies ? 0 : maxenergies-battlestoday)
        })

    })

    router.get('/tracker/:address', (req,res)=>{
        axios.get(`https://tracker.axie.management/${req.params.address}/battles`)
        .then((response) => {
            console.log(response)
        })
    })


})


router.get('/liquidity/:address', (req, res) => {
    //Sometimes this endpoint would fail to bring accurate data
    //specially on the SLP-WETH pair
    axios.get(roninrest + '/katana/pools/' + req.params.address).then(response => {
        //this object has A LOT of information
        //such as the total stake of the pool
        //which can be dismissed along with other info
        //for info about a every pool in general check '/katana/liquidity'
        const model = response.data.pools
        const retrieve = {
            address: response.data.address,
            pools: {
                'AXS': {
                    stake: model['AXS'].my_stake,
                    pending: model['AXS'].reward_pending,
                    daily: model['AXS'].estimated_daily_rewards
                },
                'AXS-WETH': {
                    stake: model['AXS-WETH'].my_stake,
                    pending: model['AXS-WETH'].reward_pending,
                    daily: model['AXS-WETH'].estimated_daily_rewards
                },
                'SLP-WETH': {
                    stake: model['SLP-WETH'].my_stake,
                    pending: model['SLP-WETH'].reward_pending,
                    daily: model['SLP-WETH'].estimated_daily_rewards
                },
                'RON-WETH': {
                    stake: model['RON-WETH'].my_stake,
                    pending: model['RON-WETH'].reward_pending,
                    daily: model['RON-WETH'].estimated_daily_rewards
                }
            }
        }
        res.status(200).json(retrieve)
    })
})

router.get('/runes',(req,res) => {
    axios.get(runes).then(response => {
        res.status(200).json(response.data._items)
    })
})

export default router