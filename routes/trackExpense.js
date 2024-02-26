
const Router = require('express-promise-router')
const router = new Router()

const { createExpense, getExpense, UpdateExpense, DeleteExpense } = require('../controllers/trackExpenseController')
router.post('/:id',createExpense)
router.get('/:id', getExpense)
router.put('/:id',UpdateExpense)
router.delete('/:id',DeleteExpense)

module.exports = router


