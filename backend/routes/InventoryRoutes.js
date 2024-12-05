const express = require("express");
const router = express.Router();
const InventoryController=require('../controller/InventoryController');

router.get('/',InventoryController.getAllInventories);

router.get('/notification',InventoryController.getLowStockInventories)

router.put('/:pharmacyId/update',InventoryController.updateQuantity)

router.post('/addinventory',InventoryController.AddInventory)


module.exports = router;