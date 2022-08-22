import express from 'express'
import axieapis from "./routes/axieapis.js";

const PORT = 8080
const app = express()

app.listen(PORT,(err)=>{
    err ? console.log('Error in server setup'): console.log('Server listening on PORT '+PORT)
})

app.use('/',axieapis)



