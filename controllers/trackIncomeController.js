const db = require("../config/database")

const createIncome = async(req,res)=>{
    const userID = parseInt(req.params.id);
    // console.log('hai')
    const {Date,Name,Amount,Description}= req.body
    if(!Date||!Name||!Amount){
        res.status(400).send({
            message:"All columns are Needed",
        })

    }
    const {rows} = await db.query(
        `INSERT INTO "Income"("Date","Name","Amount","Description","userID") VALUES($1,$2,$3,$4,$5)`,
        [Date,Name,Amount,Description,userID]
    )

    res.status(201).send({
        message:"Income Added Successfully!",
        body:{
            expense:{Date,Name,Amount,Description,userID}
        },
    })
}

const getIncome =async(req,res)=>{
    const userID = parseInt(req.params.id);
    const response = await db.query(`SELECT * FROM "Income" WHERE "userID"=$1 ORDER BY "Date" DESC`,[userID])
    // console.log(response.rows)
    res.status(200).send(response.rows)
}

const UpdateIncome = async (req,res)=>{
    const IncomeID=parseInt(req.params.id)
    const {Date,Name,Amount,Description}= req.body

    const response = await db.query(`UPDATE "Income" SET "Date"=$1,"Name"=$2,"Amount"=$3,"Description"=$4 WHERE "IncomeID"=$5`,[Date,Name,Amount,Description,IncomeID])

    res.status(200).send({message:'Income successfully Updated!'})
}

const DeleteIncome = async(req,res)=>{
    const IncomeID = parseInt(req.params.id);
    await db.query(`DELETE FROM "Income" WHERE "IncomeID"=$1`,[IncomeID])

    res.status(200).send({message:'Income Deleted Successfully!', IncomeID})
}

module.exports ={createIncome, getIncome,UpdateIncome, DeleteIncome}