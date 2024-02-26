const Router = require('express-promise-router')
const router = new Router()

const { createGoal, getGoal, UpdateGoal, DeleteGoal } = require('../controllers/trackGoalsController')
router.post('/:id',createGoal)
router.get('/:id', getGoal)
router.put('/:id',UpdateGoal)
router.delete('/:id',DeleteGoal)

module.exports = router