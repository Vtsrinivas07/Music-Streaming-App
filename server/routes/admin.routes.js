const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAdminActions,
  getDashboardStats,
  toggleFeatured
} = require('../controllers/admin.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Debug middleware
const debugMiddleware = (req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  console.log('User:', req.user);
  next();
};

// Apply debug middleware to all admin routes
router.use(debugMiddleware);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Get a list of all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.route('/users')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get single user
 *     description: Get a user by ID (admin only)
 *     tags: [Admin]
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
router.route('/users/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

/**
 * @swagger
 * /api/admin/artists:
 *   get:
 *     summary: Get all artists
 *     description: Get a list of all artists (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of artists
 */
router.route('/artists')
  .get(protect, authorize('admin'), getArtists)
  .post(protect, authorize('admin'), createArtist);

/**
 * @swagger
 * /api/admin/artists/{id}:
 *   get:
 *     summary: Get single artist
 *     description: Get an artist by ID (admin only)
 *     tags: [Admin]
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
 *         description: Artist details
 */
router.route('/artists/:id')
  .get(protect, authorize('admin'), getArtist)
  .put(protect, authorize('admin'), updateArtist)
  .delete(protect, authorize('admin'), deleteArtist);

/**
 * @swagger
 * /api/admin/songs:
 *   get:
 *     summary: Get all songs
 *     description: Get a list of all songs (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of songs
 */
router.route('/songs')
  .get(protect, authorize('admin'), getSongs)
  .post(protect, authorize('admin'), createSong);

/**
 * @swagger
 * /api/admin/songs/{id}:
 *   get:
 *     summary: Get single song
 *     description: Get a song by ID (admin only)
 *     tags: [Admin]
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
 *         description: Song details
 */
router.route('/songs/:id')
  .get(protect, authorize('admin'), getSong)
  .put(protect, authorize('admin'), updateSong)
  .delete(protect, authorize('admin'), deleteSong);

/**
 * @swagger
 * /api/admin/albums:
 *   get:
 *     summary: Get all albums
 *     description: Get a list of all albums (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of albums
 */
router.route('/albums')
  .get(protect, authorize('admin'), getAlbums)
  .post(protect, authorize('admin'), createAlbum);

/**
 * @swagger
 * /api/admin/albums/{id}:
 *   get:
 *     summary: Get single album
 *     description: Get an album by ID (admin only)
 *     tags: [Admin]
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
 *         description: Album details
 */
router.route('/albums/:id')
  .get(protect, authorize('admin'), getAlbum)
  .put(protect, authorize('admin'), updateAlbum)
  .delete(protect, authorize('admin'), deleteAlbum);

/**
 * @swagger
 * /api/admin/actions:
 *   get:
 *     summary: Get admin actions
 *     description: Get a log of all admin actions (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin actions
 */
router.get('/actions', protect, authorize('admin'), getAdminActions);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard stats
 *     description: Get dashboard statistics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', protect, authorize('admin'), getDashboardStats);

/**
 * @swagger
 * /api/admin/feature/{type}/{id}:
 *   put:
 *     summary: Toggle featured status
 *     description: Toggle featured status for songs, artists, or albums (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [song, artist, album]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Featured status toggled
 */
router.put('/feature/:type/:id', protect, authorize('admin'), toggleFeatured);

module.exports = router; 