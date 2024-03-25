const db = require("../config/database");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");

//generate random refresh token secret key each time
const handleRefreshToken = async (req, res) => {
console.log("Inside Refresh Token Controller")

  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1];

  // const foundUser = await db.query(`SELECT * FROM "users" WHERE "refresh"=$1`, [
  //   refreshToken,
  // ]);

  // console.log("foundUser",foundUser.rows[0])
  // console.log("Refresh Token",refreshToken)

//   if (foundUser && foundUser.rows.length > 0) {
    try {
      const decoded = await new Promise((resolve, reject) => {
        const refTokenInDB = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
          }
        );
      });

      // if (foundUser.rows[0].userName !== decoded.userName) {
      //   return res.status(403).json({ error: "User Not Found" });
      // }

      const newRefreshToken = jwt.sign(
        { userName: decoded.userName },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      console.log("new ref token", newRefreshToken);

      // const updateResult = await db.query(
      //   `UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`,
      //   [newRefreshToken, decoded.userName]
      // );

      // if (updateResult.rowCount === 1) {
        console.log("Refresh Token Updated Successfully");
        const newAccessToken = jwt.sign(
          { userName: decoded.userName },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "20s" }
        );

        // console.log("updating in refreshController", newRefreshToken);
        //, refreshToken:newRefreshToken
        res
          .status(200)
          .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      // } else {
      //   console.log("Refresh Token Update Failed");
      // }
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
//   }
//    else {
//     console.log("Inside else block");
//     console.log("REf Token Inside else block", refreshToken);
//     // console.log("found user Inside else block", foundUser);
//     return res.status(403).json({ error: "Invalid or expired token" });
//   }
};

module.exports = { handleRefreshToken };
