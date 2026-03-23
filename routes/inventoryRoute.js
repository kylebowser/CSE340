// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build car view
router.get("/detail/:invId", invController.buildByCar);

//Route to build a 500 error
router.get("/500", (req, res, next) => {
    next(new Error("Cause a 500"))
})

module.exports = router;