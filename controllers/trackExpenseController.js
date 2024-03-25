const db = require("../config/database")

const createExpense = async(req,res)=>{
    // console.log("Inside Create Expense")
    const userID = parseInt(req.params.id);
    // console.log('hai')
    const {Date,Activity,Category,Amount,Description}= req.body
    if(!Date||!Activity||!Category||!Amount){
        res.status(400).send({
            message:"All columns are Needed",
        })

    }
    const {rows} = await db.query(
        `INSERT INTO expenses("Date","Activity","Category","Amount","Description","userID") VALUES($1,$2,$3,$4,$5,$6) RETURNING "ExpenseID"`,
        [Date,Activity,Category,Amount,Description,userID]
    )

    const ExpenseID = rows[0].ExpenseID;

    res.status(201).send({
        message:"Expense Added Successfully!",
        body:{
            expense:{Date,Activity,Category,Amount,Description,ExpenseID}
        },
    })
}

const getExpense =async(req,res)=>{
    // console.log("inside GetExpense")
    const userID = parseInt(req.params.id);
    const response = await db.query(`SELECT * FROM Expenses WHERE "userID"=$1 ORDER BY "Date" DESC`,[userID])
    // console.log("expense",response.rows)
    res.status(200).send(response.rows)
}

const UpdateExpense = async (req,res)=>{
    console.log("Inside UPDATE EXPENSE")
    const expenseID=parseInt(req.params.id)
    console.log("expenseId",expenseID)
    const {Date,Activity,Category,Amount,Description}= req.body

    const response = await db.query(`UPDATE Expenses SET "Date"=$1,"Activity"=$2,"Category"=$3,"Amount"=$4,"Description"=$5 WHERE "ExpenseID"=$6`,[Date,Activity,Category,Amount,Description,expenseID])
    console.log("update expense response",response)
    res.status(200).send({message:'Expense successfully Updated!'})
}

const DeleteExpense = async(req,res)=>{
    const expenseID = parseInt(req.params.id);
    await db.query(`DELETE FROM Expenses WHERE "ExpenseID"=$1`,[expenseID])

    res.status(200).send({message:'Expense Deleted Successfully!', expenseID})
}

module.exports ={createExpense, getExpense,UpdateExpense, DeleteExpense}