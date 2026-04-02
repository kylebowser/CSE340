// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const invController = require("../controllers/invController")
const invValidator = require("../utilities/inv-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build car view
router.get("/detail/:invId", invController.buildByCar);

//Route to the Inventory manipulator view
router.get("/inventory", invController.buildManipulator);

//Route to the Inventory manipulator view
router.get("/addCat", invController.buildAddCat);

//Route for the post of signup
router.post('/addCat', invValidator.categoryRules(), invValidator.checkCatData, utilities.handleErrors(invController.createCategory))

//Route to the Inventory adder view
router.get("/addInv", invController.buildAddInv);

//Route to the Inventory adder post view
router.post('/addInv', invValidator.inventoryRules(), invValidator.checkInvData, utilities.handleErrors(invController.createInventory))

//Route to build a 500 error
router.get("/500", (req, res, next) => {
    next(new Error("Cause a 500"))
})

module.exports = router;