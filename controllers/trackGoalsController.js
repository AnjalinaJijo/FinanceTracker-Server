const db = require("../config/database")

const createGoal = async(req,res)=>{
    const userID = parseInt(req.params.id);
    // console.log('hai')
    const {Date,Category,GoalAmount}= req.body
    // console.log("Date",Date)
    // console.log("Category",Category)
    // console.log("GoalAmount",GoalAmount)
    if(!Date||!Category||!GoalAmount){
        res.status(400).send({
            message:"All columns are Needed",
        })

    }
    const {rows} = await db.query(
        `INSERT INTO "Goals"("Date","Category","GoalAmount","userID") VALUES($1,$2,$3,$4)`,
        [Date,Category,GoalAmount,userID]
    )

    res.status(201).send({
        message:"Goal Added Successfully!",
        body:{
            expense:{Date,Category,GoalAmount,userID}
        },
    })
}

const getGoal =async(req,res)=>{
    const userID = parseInt(req.params.id);
    const response = await db.query(`SELECT * FROM "Goals" WHERE "userID"=$1 ORDER BY "Date" DESC`,[userID])
    // console.log(response.rows)
    res.status(200).send(response.rows)
}

const UpdateGoal = async (req,res)=>{
    const GoalID=parseInt(req.params.id)
    const {Date,Category,GoalAmount}= req.body

    const response = await db.query(`UPDATE "Goals" SET "Date"=$1,"Category"=$2,"GoalAmount"=$3 WHERE "GoalID"=$4`,[Date,Category,GoalAmount,GoalID])

    res.status(200).send({message:'Goal successfully Updated!'})
}

const DeleteGoal = async(req,res)=>{
    console.log("Inside DeleteGoals")
    const GoalID = parseInt(req.params.id);
    console.log("GoalID",GoalID)
    await db.query(`DELETE FROM "Goals" WHERE "GoalID"=$1`,[GoalID])

    res.status(200).send({message:'Goal Deleted Successfully!', GoalID})
}

module.exports ={createGoal, getGoal,UpdateGoal, DeleteGoal}