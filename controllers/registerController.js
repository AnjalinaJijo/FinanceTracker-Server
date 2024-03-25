const db = require('../config/database')

const bcrypt = require('bcrypt');

const handleNewUser = async(req,res)=>{

    const {user,pwd,email} = req.body;
    if(!user || !pwd || !email) return res.status(400).json({'message':'Username, password, and email are required.'});

    //choose email instead of userName and send a key pwd to email which user needs to verify
     // check for duplicate usernames in the db
     const duplicate=await db.query(`SELECT * FROM "users" WHERE "userName"=$1`,[user])
     if(duplicate.rows.length>0) return res.status(409).json({'message':'Username already exists. Please select a unique userName'});//conflict

     try{
        //encrypt the password
        const hashedPwd= await bcrypt.hash(pwd,10);

        //create and store the new user
        const result = await db.query(`INSERT INTO "users"("userName","password","email") VALUES($1,$2,$3)`,[user,hashedPwd,email]);

        // console.log(result);

        res.status(201).json({'success':'New user ${user} created!'});

    }
    catch (err){
        res.status(500).json({'message':err.message});
    }

}

module.exports = {handleNewUser}