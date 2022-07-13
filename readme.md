# RUN

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
## Retrieve Number
    /energy/:address

# Endpoints used
    ronin.rest,
    https://axie-graphql.web.app,
    https://landplots.vercel.app


# Models for Objects:
## Land
    [
        Estimated total rewards per day
        Lands on sale would also appear on Unstaked
        StakedUnstakedArray: { unstaked: 0, staked: 0 },
        
        Land objects
        ETHWalletLand = { 
            staked: [
                {
                "col":-85,"row":-149,
                "LandType":"Savannah",
                "NextToRiver":"No",
                "NextToRoad":"No","NextToNode":"No",
                "InsideRiver":"No"
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
    SLP pool seems to be kinda faulty