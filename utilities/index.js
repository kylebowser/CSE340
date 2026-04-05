const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

//module.exports = Util


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildDetailsDisplay = async function(data){
  let display
  if(data.length > 0){
    display = '<section id="car-display">'
    data.forEach(vehicle => { 
    display += '<div id=car-pic><img src="' + vehicle.inv_image 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></div>'
    display += '<div id=car-info><h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details' + '</h2>'
    display += '<p>' + 'Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    display += '<p>' + 'Description: ' + vehicle.inv_description + '</p>'
    display += '<p>' + 'Color: ' + vehicle.inv_color + '</p>'
    display += '<p>' + 'Miles: ' + vehicle.inv_miles + '</p></div>'
    display += '</section>'
    })
  } else { 
    display += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return display
}

Util.buildManipulatorDisplay = async function(){
  let display
  display = '<p><a href="/inv/addCat" >Add Category</a></p>' +
  '<p><a href="/inv/addInv" >Add Inventory</a></p>'

  return display
}

Util.buildAddCatDisplay = async function(){
  let display
  display = `
  <form method="post" action="/inv/addCat" class="wf1">
  <fieldset>
    <label for="classification_name"
      >Add Category: <span>New classification name cannot contain a space or special character of any kind</span><input
        type="text"
        name="classification_name"
        id="classification_name"
        required
        pattern="^[A-Za-z0-9]+$"
    /></label>
    <label for="submit"
      ><input type="submit" id="submit" value="Create"
    /></label>
  </fieldset>
</form>
`
return display
}


Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

Util.buildWelcome = async function(data) {
  let display = '<h2>Welcome ' + data.account_firstname + '</h2>' +
  '<p>You\'re logged in</p>' + '<p><a href="/account/editAccount">Update Account Info</a></p>'
  if (data.accountype != 'Client') {
    display += '<h3>Inventory Managment</h3>' +
    '<p><a href="../inv/inventory">Manage Inventory</a></p>'
  }
  return display

 }

Util.tools = (req, res, next) => {
    let tools = '<div id="tools">'
    if (res.locals.loggedin) {
      const data = res.locals.accountData
      const firstName = data.account_firstname
      tools += '<a title="Click to accout managment" href="/account/">Welcome '+ firstName + '</a>' +
      '<a title="click to logout" href="/account/logout">Logout</a></div>'
  } else {
    tools += '<a title="Click to log in" href="/account/login">My Account</a> </div>'
  }
  res.locals.tools = tools
  next()
 }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util