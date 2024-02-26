const Router = require('express-promise-router')
const router = new Router()

const {handleRefreshToken}  = require('../controllers/refreshTokenController');

router.post('/',handleRefreshToken)

module.exports = router