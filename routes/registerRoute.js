const Router = require('express-promise-router')
const router = new Router()

const {handleNewUser} = require('../controllers/registerController.js')

router.post('/',handleNewUser)

module.exports = router