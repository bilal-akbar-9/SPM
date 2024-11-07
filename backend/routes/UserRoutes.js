const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

/**
 * @route GET /api/users
 * @desc Get all users
 */
router.get("/", userController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 */
router.get("/:id", userController.getUserById);

/**
 * @route POST /api/users
 * @desc Create a new user
 */
router.post("/", userController.createUser);

/**
 * @route PUT /api/users/:id
 * @desc Update user details
 */
router.put("/:id", userController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 */
router.delete("/:id", userController.deleteUser);

/**
 * @route POST /api/users/login
 * @desc User login
 */
router.post("/login", userController.loginUser);

module.exports = router;