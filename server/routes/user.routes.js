const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  getFavorites,
  toggleFavorite,
  getHistory,
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Get a list of all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', protect, authorize('admin'), getUsers);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update currently logged in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', protect, updateProfile);
router.get('/profile', protect, (req, res) => res.json({ success: true, data: req.user }));

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get user's favorite songs
 *     description: Get list of songs liked by the logged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite songs
 */
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, toggleFavorite);

/**
 * @swagger
 * /api/users/history:
 *   get:
 *     summary: Get user's listening history
 *     description: Get list of songs played by the logged in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listening history
 */
router.get('/history', protect, getHistory);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get single user
 *     description: Get a user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:id', protect, authorize('admin'), getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Update any user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', protect, authorize('admin'), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router; 