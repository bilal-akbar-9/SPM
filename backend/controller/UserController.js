const UserSchema = require('../models/User.schema');
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");


const generateShortId = () => {
	// Get full UUID and remove hyphens
	const fullUuid = uuidv4().replace(/-/g, "");
	// Take first 6-8 characters
	const length = Math.floor(Math.random() * 3) + 6; // Random length between 6-8
	return fullUuid.substring(0, length).toUpperCase();
};


const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await UserSchema.find().select('-password').populate('pharmacyId');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await UserSchema.findById(req.params.id).select('-password').populate('pharmacyId');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const { username, password, name, role, pharmacyId } = req.body;

            const existingUser = await UserSchema.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const newUser = new UserSchema({
                userId: generateShortId(),
                username,
                password, // Store plain text password
                name,
                role,
                pharmacyId
            });

            await newUser.save();
            
            const userResponse = newUser.toObject();
            delete userResponse.password;
            
            res.status(201).json(userResponse);
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { username, password, name, role, pharmacyId } = req.body;
            const user = await UserSchema.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (username) user.username = username;
            if (password) user.password = password; // Store plain text password
            if (name) user.name = name;
            if (role) user.role = role;
            if (pharmacyId) user.pharmacyId = pharmacyId;

            await user.save();

            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json(userResponse);
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await UserSchema.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await UserSchema.findOne({ username });

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            if (password !== user.password) { // Direct password comparison
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const userResponse = user.toObject();
            delete userResponse.password;
            const token = jwt.sign({
                userId: userResponse._id,
                role: userResponse.role
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            userResponse.token = token;

            res.status(200).json({ message: 'Login successful', user: userResponse, token });
        } catch (error) {
            res.status(500).json({ message: 'Error during login', error: error.message });
        }
    },

    // UserController.js
    getMyData: async (req, res) => {
        try {
            const user = await UserSchema.findById(req.decoded.userId)
                .select('-password')
                .populate({
                    path: 'pharmacyId',
                    localField: 'pharmacyId',
                    foreignField: 'pharmacyId',
                    model: 'Pharmacy'
                });
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ 
                message: 'Error fetching user data', 
                error: error.message 
            });
        }
    }
};

module.exports = userController;