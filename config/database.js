const {Pool} = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const pool = new Pool({
    host:"localhost",
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    password:process.env.DB_PWD,
    database:'FinanceTracker'
})

pool.on('connect',()=>{
    // console.log('Connection to Postgres database Success!')
})

// export const query = (text,params)=>pool.query(text,params)

module.exports = {
    query:(text,params)=>pool.query(text,params),
}