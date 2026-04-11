const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildSignup(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/signup", {
    title: "Signup",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildActMan(req, res, next) {
  let nav = await utilities.getNav()
  const data = res.locals.accountData
  const display = await utilities.buildWelcome(data)
  res.render("account/actMan", {
    title: "Account Manager",
    nav,
    display,
    errors: null
  })
}

/* ****************************************
*  Deliver Editor view
* *************************************** */
async function buildEditor(req, res, next) {
  let nav = await utilities.getNav()
  const data = res.locals.accountData
  res.render("account/update", {
    title: "Account Editor",
    nav,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
    errors: null
    
  })
}

/* ***************************
 *  Update Account Data
 * ************************** */
async function editInfo(req, res, next) {
  let nav = await utilities.getNav()
  //const account_id = parseInt(req.body.account_id)

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body
  console.log(account_id, "HERE")
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  if (updateResult) {
    const accountInfo = updateResult.account_firstname + " " + updateResult.account_lastname + " " + updateResult.account_email
    req.flash("notice", `${accountInfo} was successfully updated.`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("/account/update", {
    title: "Account Editor",
    nav,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    })
  }
}

/* ****************************************
*  Change Password
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    res.status(500).render("account/update", {
      title: "Account Editor",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.changePassword(
    hashedPassword,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Your password has been changed`
    )
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, password change failed.")
    res.status(501).render("account/update", {
      title: "Account Editor",
      nav,
    })
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/signup", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Logout
* *************************************** */
async function logout(req, res, next) {
  const data = res.locals.accountData
  res.clearCookie("jwt");
  res.redirect("/")
}

/* ***************************
 *  Build My Reviews view
 * ************************** */
async function buildMyReviews(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const data = await accountModel.getReviewByAccountId(account_id)
  const grid = await utilities.buildReviewGrid(data)
  res.render("./account/myReview", {
    title: "My Reviews",
    nav,
    grid,
    errors: null
  })
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
async function buildDelete (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const data = await accountModel.getReviewByReviewId(review_id)
  const itemData = data[0]
  res.render("./account/delete-confirm", {
    title: "Delete Confirm",
    nav,
    errors: null,
    review: itemData.review,
    review_id: itemData.review_id
  })
}

/* ***************************
 *  Delete Review Data
 * ************************** */
async function deleteReview(req, res, next) {
  let nav = await utilities.getNav()
  const review_id = parseInt(req.body.review_id)

  const deleteResult = await accountModel.deleteReview(review_id)

  if (deleteResult) {
    req.flash("notice", `The review was successfully delete.`)
    res.redirect("/account/myReviews")
  } else {
    req.flash("notice", "Sorry, the Delete failed.")
    res.redirect("/account/myReviews")
  }
}

module.exports = { buildLogin, buildSignup, buildActMan, registerAccount, accountLogin, buildEditor, editInfo, changePassword, logout, buildMyReviews, buildDelete, deleteReview }
