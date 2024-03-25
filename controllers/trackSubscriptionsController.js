const db = require("../config/database")

const createSubscription = async(req,res)=>{
    const userID = parseInt(req.params.id);
    // console.log('hai')
    const {Date,Category,subscriptionName,subscriptionAmount,status}= req.body
    // console.log("Date",Date)
    // console.log("Category",Category)
    // console.log("SubscriptionAmount",subscriptionAmount)
    if(!Date||!Category||!subscriptionAmount||!subscriptionName||!status){
        res.status(400).send({
            message:"All columns are Needed",
        })

    }
    const {rows} = await db.query(
        `INSERT INTO "subscriptions"("Date","Category","subscriptionAmount","subscriptionName","status","userID") VALUES($1,$2,$3,$4,$5,$6)`,
        [Date,Category,subscriptionAmount,subscriptionName,status,userID]
    )

    res.status(201).send({
        message:"Subscription Added Successfully!",
        body:{
            expense:{Date,Category,subscriptionAmount,subscriptionName,status,userID}
        },
    })
}

const getSubscription =async(req,res)=>{
    const userID = parseInt(req.params.id);
    const response = await db.query(`SELECT * FROM "subscriptions" WHERE "userID"=$1 ORDER BY "Date" DESC`,[userID])
    // console.log(response.rows)
    res.status(200).send(response.rows)
}

const UpdateSubscription = async (req,res)=>{

    console.log("Inside Update Subscription")
    const subscriptionID=parseInt(req.params.id)
    const {Date,Category,subscriptionName,subscriptionAmount,status,ExpenseID,LastResetDate}= req.body

    const response = await db.query(`UPDATE "subscriptions" SET "Date"=$1,"Category"=$2,"subscriptionAmount"=$3,"subscriptionName"=$4,"status"=$5, "ExpenseID"=$6, "LastResetDate"=$7 WHERE "subscriptionID"=$8`,[Date,Category,subscriptionAmount,subscriptionName,status,ExpenseID,LastResetDate,subscriptionID])
    // console.log("update response",response)
    res.status(200).send({message:'Subscription successfully Updated!'})
}

const DeleteSubscription = async(req,res)=>{
    const subscriptionID = parseInt(req.params.id);
    await db.query(`DELETE FROM "subscriptions" WHERE "subscriptionID"=$1`,[subscriptionID])

    res.status(200).send({message:'Subscription Deleted Successfully!', subscriptionID})
}

module.exports ={createSubscription, getSubscription,UpdateSubscription, DeleteSubscription}