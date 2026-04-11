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
  const data = res.locals.accountData
  if (!data || data.account_type == "Client") {
    req.flash("notice", "RESTRICTED ZONE! PLEASE LOGIN WITH CORRECT PERMISSIONS!")
    res.redirect("../account/login")
  } else {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/addDetails", {
    title: "Inventory Manipulator",
    nav,
    display,
    classificationSelect,
    errors: null
  })
}
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEdit = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  const itemData = data[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/inventory")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDelete = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  const itemData = data[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `The item was successfully delete.`)
    res.redirect("/inv/inventory")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the Delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

  /* ***************************
 *  Build Reviews view
 * ************************** */
invCont.buildReviews = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.params.inv_id
  const data = await invModel.getReviewByInvId(inv_id)
  const grid = await utilities.buildReviewGrid(data)
  let account_id = res.locals.accountData?.account_id ?? 0
  let reviewView = await utilities.buildReviews(res.locals.loggedin, inv_id, account_id)
  res.render("./inventory/review", {
    title: "Reviews",
    nav,
    reviewView,
    grid,
    errors: null
  })
}

/* ****************************************
*  Create Review
* *************************************** */
invCont.createReview = async function (req, res) {
  let nav = await utilities.getNav()
  const { review, inv_id, account_id } = req.body

  console.log(invModel)
  const regResult = await invModel.addReview(
    review, 
    inv_id, 
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, created new review.`
    )
    res.redirect("/account/myReviews")
  } else {
    req.flash("notice", "Sorry, the review failed.")
    res.redirect("/account/myReviews")
  }
}


  module.exports = invCont