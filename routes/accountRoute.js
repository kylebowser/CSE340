// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


//Route for account login screen
router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Route for account logout
router.get("/logout", utilities.handleErrors(accountController.logout))

//Route for the signup screen
router.get("/signup",utilities.handleErrors(accountController.buildSignup))

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildActMan))

//Route for the edit account info
router.get("/editAccount", utilities.handleErrors(accountController.buildEditor))

//Route for user reviews
router.get("/myReviews", utilities.handleErrors(accountController.buildMyReviews))

//Route to build the delete inventory view
router.get("/confirm/:review_id", utilities.handleErrors(accountController.buildDelete))

// Route for posting delete review
router.post("/delete/", utilities.handleErrors(accountController.deleteReview))

//Route to edit account info
router.post("/editInfo/", regValidate.updateRules(), utilities.handleErrors(accountController.editInfo))

//Route to change password
router.post("/changePassword", regValidate.passwordRules(), utilities.handleErrors(accountController.changePassword))

//Route for the post of signup
router.post('/signup', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login", utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;