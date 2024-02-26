const Router = require('express-promise-router')
const router = new Router()

const { createSubscription, getSubscription, UpdateSubscription, DeleteSubscription } = require('../controllers/trackSubscriptionsController')
router.post('/:id',createSubscription)
router.get('/:id', getSubscription)
router.put('/:id',UpdateSubscription)
router.delete('/:id',DeleteSubscription)

module.exports = router