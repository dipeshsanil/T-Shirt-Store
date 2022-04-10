var express = require('express');
var router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category")
const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user")
const {isSignedIn,isAdmin, isAuthenticated} = require("../controllers/auth")

//params
router.param("userId", getUserById);
router.param("categoryId",getCategoryById);

//create
router.post("/category/create/:userId", isSignedIn, isAdmin, isAuthenticated, createCategory);

//read
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAdmin, isAuthenticated, updateCategory);

//delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAdmin, isAuthenticated, removeCategory);

module.exports = router;