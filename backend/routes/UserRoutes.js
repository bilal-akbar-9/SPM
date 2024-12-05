const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const { VerifyToken, VerifyAdmin } = require("../utils/Authentication");


/**
 * @route GET /api/users/mydata
 * @desc Get user data
 */

router.get("/mydata", VerifyToken, userController.getMyData);

/**
 * @route GET /api/users
 * @desc Get all users
 */
router.get("/", VerifyToken, VerifyAdmin, userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 */
router.get("/:id", VerifyToken, VerifyAdmin, userController.getUserById);

/**
 * @route POST /api/users
 * @desc Create a new user
 */
router.post("/", VerifyToken, VerifyAdmin, userController.createUser);

/**
 * @route PUT /api/users/:id
 * @desc Update user details
 */
router.put("/:id", VerifyToken, VerifyAdmin, userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 */
router.delete("/:id", VerifyToken, VerifyAdmin, userController.deleteUser);

/**
 * @route POST /api/users/login
 * @desc User login
 */
router.post("/login", userController.loginUser);


//register a new user
/**
 * @route POST /api/users/register
 * @desc Register a new user
 */
router.post("/register", userController.createUser);

module.exports = router;
