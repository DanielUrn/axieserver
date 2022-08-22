# RUN
Default port is set to 8080
## Install the dependencies
    npm i

## If Nodemon is installed globally
    npm run dev

## Otherwise just do
    node app

# Routes
    
## Retrieve Object
    /land/:address
    /liquidity/:address
    /runes
    /runes/:id
    /charms
    /charms/:id
    /RunesAndCharmsPerAccount/:address
## Retrieve Number
    /energy/:address

# Endpoints used
    ronin.rest,
    https://axie-graphql.web.app,
    https://landplots.vercel.app


# Models for Objects:
## Land
    [
        //Estimated total rewards per day
        //Lands on sale would also appear on Unstaked
        StakedUnstakedArray: { unstaked: 0, staked: 0 },
        
        //Land objects
        ETHWalletLand = { 
            staked: [
                {
                col:-85,row:-149,
                LandType:Savannah,
                NextToRiver:No,
                NextToRoad:No,NextToNode:No,
                InsideRiver:No
                }
            ],
            unstaked: [(same kind of object as the staked one)] }
    ]

## Liquidity
    {
        address,
            pools: {
                'AXS': {
                    stake,
                    pending,
                    daily
                }... (continues with the other pools, same attributes)
    }
    //SLP pool seems to be kinda faulty

## Runes
{
    rune,
    class,
    craftable:true,
    weight:100,
    hp:0,hpPct:0,
        item:{
            id,
            displayOrder,
            category,
            rarity,
            description,
            tokenStandard,
            tokenAddress,
            tokenId,
            imageUrl
        },
        season:{
            id,
            name
        },
        _etag:a05f1315365e1387ba797fb725f524be,
        
    This last attribute would only be available in the "RunesAndCharmsPerAccount" endpoint
    total:2
}

## Charms
{
    class,
    potentialPoint,
    code,
    craftable,
    weight:100,
    tags:[],
    energy:0,hp:0,damage:3,shield:0,heal:0,hpPct:0,damagePct:0,shieldPct:0,healPct:0,
        item:{
            id,
            displayOrder,
            category,
            rarity,
            description,
            tokenStandard,
            tokenAddress,
            tokenId,
            imageUrl
        },
        season:{
            id,
            name
        },
        _etag:a05f1315365e1387ba797fb725f524be,
    
    This last attribute would only be available in the "RunesAndCharmsPerAccount" endpoint    
    total:3
}