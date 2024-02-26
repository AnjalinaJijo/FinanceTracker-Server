const Router = require('express-promise-router')
const router = new Router()

const {handleLogin,updateRefresh} = require('../controllers/authController.js')

router.post('/',handleLogin)
router.put('/',updateRefresh)

module.exports = router