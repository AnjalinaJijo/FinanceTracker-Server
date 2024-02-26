
const db = require('../config/database')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req,res)=>{
    const{username,password}=req.body;

    //20 sec
    // const EXPIRE_TIME=30*1000
    // const EXPIRE_TIME=1*60
    // 10 minutes in seconds
    // console.log("collected username and password")

    if(!username || !password){
        return res.status(400).json({'message':'Username and Password are required'})
    }

        const foundUser = await db.query(`SELECT * FROM "users" WHERE "userName"=$1`,[username])

        if(foundUser.rows.length>0){
            // console.log('user  found!')

            const match = await bcrypt.compare(password,foundUser.rows[0].password)
            // console.log(match)
            if(match){

                const user ={id:foundUser.rows[0].userID,userName:username,email:foundUser.rows[0].email}

                const accessToken = jwt.sign(
                    user,
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:'60s'})
                const refreshToken = jwt.sign(
                    user,
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn:'10m'}
                 );

                const response = await db.query(`UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`,[refreshToken,username])


                console.log('Refresh token in handleLogin:', refreshToken);
                console.log('Database update response:', response);

                  // Fetch the latest refresh token from the database
                const updatedUser = await db.query(`SELECT * FROM "users" WHERE "userName"=$1`, [username]);
                    console.log("updated ref token in DB",updatedUser.rows[0].refresh)
                //    Set secure HTTP-only cookies
                    // res.cookie('accessToken', accessToken, {
                    //     httpOnly: true,
                    //     secure: false, // Set to true for secure (HTTPS) connections only
                    //     sameSite: 'None', // May need to set 'None' for cross-origin requests
                    // });

                    // res.cookie('refreshToken', updatedUser.rows[0].refresh, {
                    //     httpOnly: true,
                    //     secure: false, // Set to true for secure (HTTPS) connections only
                    //     sameSite: 'None', // May need to set 'None' for cross-origin requests
                    // });


                // console.log("ref token in authController",refreshToken)
                // console.log("response",response)

                //Middleware to authenticate token
                //see middlewares

                // console.log('successfully logged In')
                // console.log(foundUser.rows)
                // res.status(200).send(foundUser.rows)
                // res.cookie('jwt',refreshToken,{httpOnly:true,secure: true,sameSite:'None',maxAge:24*60*60*1000});
                console.log('updating in authController',refreshToken)
                
                res.status(200).json([{...user,"accessToken":accessToken,"refreshToken":refreshToken,'expiresIn':60}])
                // res.status(200).json(foundUser.rows)
            }

    }
    else{
        res.status(400).send(null)
    }
}


const updateRefresh = async(req,res)=>{

    // const GoalID=parseInt(req.params.id)
    const {refresh,userName}= req.body

    const response = await db.query(`UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`,[refresh,userName])

    res.status(200).send({message:'Refresh token successfully Updated in DB!'})

}

module.exports={handleLogin,updateRefresh}