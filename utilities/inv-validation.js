const utilities = require(".")
  const { body, validationResult } = require("express-validator")
 const invModel = require("../models/inventory-model")

  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [
      // make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."), // on error this message is sent.
  
      // model is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."), // on error this message is sent.

      // year is required and must be string
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a year."), // on error this message is sent.

      // description is required and must be string
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a description."), // on error this message is sent.

      // price is required and must be string
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a price."), // on error this message is sent.

      // miles is required and must be string
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide miles."), // on error this message is sent.

      // color is required and must be string
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a color."), // on error this message is sent.
  

  
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inv/addInv", {
      errors,
      title: "Create Inventory",
      nav,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id,
    })
    return
  }
  next()
}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.categoryRules = () => {
    return [
  
      // password is required and must be strong password
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("Classification name does not meet requirments."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to Creation
 * ***************************** */
validate.checkCatData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inv/addCat", {
      errors,
      title: "Create Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate