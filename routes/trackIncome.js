const Router = require('express-promise-router')
const router = new Router()

const { createIncome, getIncome, UpdateIncome, DeleteIncome } = require('../controllers/trackIncomeController')
router.post('/:id',createIncome)
router.get('/:id', getIncome)
router.put('/:id',UpdateIncome)
router.delete('/:id',DeleteIncome)

module.exports = router