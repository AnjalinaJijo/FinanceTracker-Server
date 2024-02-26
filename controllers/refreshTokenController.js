const db = require('../config/database')
const jwt = require('jsonwebtoken');

const crypto = require('crypto');

//generate random refresh token secret key each time
const handleRefreshToken = async (req, res) => {
    const generateNewRefreshTokenSecret = () => {
        const newSecret = crypto.randomBytes(64).toString('hex');
        return newSecret;
    };

    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];

    const foundUser = await db.query(`SELECT * FROM "users" WHERE "refresh"=$1`, [refreshToken]);

    if (foundUser && foundUser.rows.length > 0) {
        try {
            const decoded = await new Promise((resolve, reject) => {
                const refTokenInDB=
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET,
                    (err, decoded) => {
                        if (err) reject(err);
                        else resolve(decoded);
                    }
                );
            }
            );

            if (foundUser.rows[0].userName !== decoded.userName) {
                return res.status(403).json({ error: "User Not Found" });
            }

            // const newRefreshToken = jwt.sign(
            //     { userName: decoded.userName },
            //     process.env.REFRESH_TOKEN_SECRET,
            //     { expiresIn: '1d' }
            // );

            // console.log("ref token Refreshed value updated in DB",newRefreshToken)

            
            const newRefreshToken = jwt.sign(
                { userName: decoded.userName },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'10m'}
             );
             console.log('new ref token',newRefreshToken)


            const updateResult = await db.query(`UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`, [newRefreshToken, decoded.userName]);

            if (updateResult.rowCount === 1) {
                    console.log('Refresh Token Updated Successfully');
                    const newAccessToken = jwt.sign(
                        { userName: decoded.userName },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '60s' }
                    );
        
        
                    console.log('updating in refreshController',newRefreshToken)
                    //, refreshToken:newRefreshToken 
                    res.status(200).json({ "accessToken": newAccessToken,"refreshToken":newRefreshToken});

            } else {
                    console.log('Refresh Token Update Failed');
            }

            
        } catch (error) {
            console.error("Error verifying token:", error);
            return res.status(403).json({ error: "Invalid or expired token" });
        }
    } else {
        console.log("Inside else block");
        console.log("REf Token Inside else block", refreshToken);
        // console.log("found user Inside else block", foundUser);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};




// const handleRefreshToken = async (req, res) => {
//     // const cookies = req.cookies;
//     // if (!cookies?.jwt) return res.sendStatus(401);
//     // const refreshToken = cookies.jwt;
//     // const EXPIRE_TIME=20*1000

//     // console.log("Inside refresh")
//     const generateNewRefreshTokenSecret = () => {
//         // Generate a new random refresh token secret
//         const newSecret = crypto.randomBytes(64).toString('hex');
//         return newSecret;
//       };


//     const authHeader = req.headers['authorization']
//     const refreshToken = authHeader && authHeader.split(' ')[1]

//     // console.log("ref token in handleRefresh",refreshToken)

//     const foundUser = await db.query(`SELECT * FROM "users" WHERE "refresh"=$1`,[refreshToken])
//     // console.log('foundUser length ',foundUser.rows[0])

//     if(foundUser && foundUser.rows.length>0){
//         console.log("Inside if block")

//         // console.log('foundUser length ',foundUser.rows.length)
//         // console.log('foundUser userName',foundUser.rows[0].userName)

//          // evaluate jwt 
//     jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//         async(err, decoded) => {
//             // console.log("decoded",decoded)
//             // console.log('Decoded userName',decoded.userName)
//             // console.log('If match',decoded.userName===foundUser.rows[0].userName)
//             // console.log("errr",err)
//             if (err || foundUser.rows[0].userName !== decoded.userName) return res.status(403).json({ error: "User Not Found" });
//             // const roles = Object.values(foundUser.roles);
//             // const user={id:decoded.id,userName:decoded.username,email:decoded.email}

//             //rotated new values stored here
//             const newRefreshTokenSecret = generateNewRefreshTokenSecret();

//               // Generate a new refresh token
//               const newRefreshToken = jwt.sign(
//                 { userName: decoded.userName },
//                 process.env.REFRESH_TOKEN_SECRET,
//                 { expiresIn: '1d' } // Set the desired expiration time for the new refresh token
//             );

//              // Store the new refresh token in the database
//             //  await db.query(`UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`, [newRefreshToken, decoded.userName]);
//              // Store the new refresh token in the database
//             const updateResult = await db.query(`UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`, [newRefreshToken, decoded.userName]);
//             console.log('Update Result', updateResult);
//             console.log('new ref token', newRefreshToken);



//              // Generate a new access token
//             const newAccessToken = jwt.sign(
//                 { userName: decoded.userName },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: '1m' }
//             );


//             // const accessToken = jwt.sign(
//             //     {
//             //         "UserInfo": {
//             //             "userName": decoded.userName,
//             //             // "roles": roles
//             //         }
//             //     },
//             //     process.env.ACCESS_TOKEN_SECRET,
//             //     { expiresIn: '20s' }
//             // );
//             // res.json({ roles, accessToken })
            
//             //// Respond with the new access token
//             res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken})
//             // res.status(200).json([{...user,"accessToken":accessToken,"refreshToken":refreshToken,'expiresIn': new Date().setTime(new Date().getTime()+EXPIRE_TIME)}])
//         }
//     );

//     }
//     else{
//         console.log("Inside else block")
//         console.log("REf Token Inside else block",refreshToken)
//         // console.log("foundUser Inside else block",foundUser)
//     return res.status(403).json({ error: "Invalid or expired token" }); //Forbidden
    
//     }
   
// }

module.exports = { handleRefreshToken }