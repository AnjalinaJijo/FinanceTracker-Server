const jwt= require('jsonwebtoken')

const authenticateToken = (req,res,next)=>{
    //token is from header after bearer
    const authHeader = req.headers['authorization']
    //bearer token
    const token=authHeader && authHeader.split(' ')[1]
    
    if(token == null) return res.status(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403)
        req.user=user
        next()
    })


}

module.exports=authenticateToken