const db = require("../config/database");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  console.log("inside authController");
  const EXPIRE_TIME = 20 * 1000; //20ms*1000 = 20sec
  // console.log('authController req body',req.body)
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }

  const foundUser = await db.query(
    `SELECT * FROM "users" WHERE "userName"=$1`,
    [username]
  );

  if (foundUser.rows.length > 0) {
    // foundUser = foundUser.rows[0];

    const match = await bcrypt.compare(password, foundUser.rows[0].password);
    if (match) {
      const user = {
        id: foundUser.rows[0].userID,
        userName: username,
        email: foundUser.rows[0].email,
      };

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20s",
      });
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10m",
      });

      const response = await db.query(
        `UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`,
        [refreshToken, username]
      );

      console.log("Refresh token in handleLogin:", refreshToken);

      // Fetch the latest refresh token from the database
      const updatedUser = await db.query(
        `SELECT * FROM "users" WHERE "userName"=$1`,
        [username]
      );
      console.log(
        "updated ref token in DB inside HandleLogin",
        updatedUser.rows[0].refresh
      );

      //Middleware to authenticate token
      //see middlewares

      // console.log('successfully logged In')
      // console.log(foundUser.rows)
      // res.status(200).send(foundUser.rows)
      // res.cookie('jwt',refreshToken,{httpOnly:true,secure: true,sameSite:'None',maxAge:24*60*60*1000});
      // console.log('updating in authController',refreshToken)

      res
        .status(200)
        .json([
          {
            ...user,
            accessToken: accessToken,
            refreshToken: refreshToken,
            //ExpiresIn takes current time of server and adds 20 secs to current time of server
            ExpiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
          },
        ]);
      // res.status(200).json(foundUser.rows)
    }
  } else {
    res.status(400).send(null);
  }
};

const updateRefresh = async (req, res) => {
  // const GoalID=parseInt(req.params.id)
  const { refresh, userName } = req.body;

  const response = await db.query(
    `UPDATE "users" SET "refresh"=$1 WHERE "userName"=$2`,
    [refresh, userName]
  );

  res
    .status(200)
    .send({ message: "Refresh token successfully Updated in DB!" });
};

module.exports = { handleLogin, updateRefresh };
