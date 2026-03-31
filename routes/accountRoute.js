// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


//Route for account login screen
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Route for the signup screen
router.get("/signup",utilities.handleErrors(accountController.buildSignup))

//Route for the post of signup
router.post('/signup', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;