const express = require('express');

const stockController = require('../controllers/stockController');

const { protect } = require('../middlewares/protect');
const { setStockCreatorIds } = require('../middlewares/setIds');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(stockController.getAllStock)
  .post(setStockCreatorIds, stockController.createStock);

router
  .route('/:id')
  .get(stockController.getStock)
  .patch(stockController.updateStock)
  .delete(stockController.deleteStock);

// router.route('/random').get(stockController.getRandom);

// router.route('/random-one').get(stockController.getRandomOne);

module.exports = router;
