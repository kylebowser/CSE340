const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build Car View by Car view
 * ************************** */
invCont.buildByCar = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const display = await utilities.buildDetailsDisplay(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/carDetails", {
    title: className,
    nav,
    display,
  })
}

  /* ***************************
 *  Build Add Details view
 * ************************** */
invCont.buildManipulator = async function (req, res, next) {
  const display = await utilities.buildManipulatorDisplay()
  let nav = await utilities.getNav()
  res.render("./inventory/addDetails", {
    title: "Inventory Manipulator",
    nav,
    display,
    errors: null
  })
}

  /* ***************************
 *  Build Add Category view
 * ************************** */
invCont.buildAddCat = async function (req, res, next) {
  const display = await utilities.buildAddCatDisplay()
  let nav = await utilities.getNav()
  res.render("./inventory/addCat", {
    title: "Add Category",
    nav,
    display,
    errors: null
  })
}

  /* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildAddInv = async function (req, res, next) {
  const classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("./inventory/addInv", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Add Category
* *************************************** */
invCont.createCategory = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const regResult = await invModel.addCat(
    classification_name,

  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, ${classification_name}. Added.`
    )
    res.redirect("/inv/addCat")
  } else {
    req.flash("notice", "Sorry, the category addition failed.")
    res.status(501).render("/inv/addCat", {
      title: "Add Category",
      nav,
    })
  }
}

/* ****************************************
*  Create Inventory
* *************************************** */
invCont.createInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body

  console.log(invModel)
  const regResult = await invModel.addInv(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, created ${inv_make} ${inv_model}.`
    )
    res.redirect("/inv/addInv")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/addInv", {
      title: "Create Inventory",
      nav,
      classificationList
    })
  }
}


  module.exports = invCont