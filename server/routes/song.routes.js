const express = require('express');
const {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
  incrementPlays,
  toggleLike,
  getFeaturedSongs,
} = require('../controllers/song.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Get all songs
 *     description: Get a list of all songs with filtering, pagination and sorting
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: Filter by artist ID
 *       - in: query
 *         name: album
 *         schema:
 *           type: string
 *         description: Filter by album ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. -plays,title)
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to select (e.g. title,artist,duration)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of songs
 */
router.get('/', getSongs);

/**
 * @swagger
 * /api/songs/featured:
 *   get:
 *     summary: Get featured songs
 *     description: Get songs marked as featured by admins
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: List of featured songs
 */
router.get('/featured', getFeaturedSongs);

/**
 * @swagger
 * /api/songs/{id}:
 *   get:
 *     summary: Get single song
 *     description: Get a song by ID
 *     tags: [Songs]
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
router.get('/featured', getFeaturedSongs);
router.get('/favorites', protect, require('../controllers/user.controller').getFavorites);
router.get('/:id', getSong);

/**
 * @swagger
 * /api/songs:
 *   post:
 *     summary: Create new song
 *     description: Add a new song (admin only)
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *               - genre
 *               - duration
 *               - audioFile
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               album:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: number
 *               coverImage:
 *                 type: string
 *               audioFile:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Song created
 */
router.post('/', protect, authorize('admin'), createSong);

/**
 * @swagger
 * /api/songs/{id}:
 *   put:
 *     summary: Update song
 *     description: Update a song (admin only)
 *     tags: [Songs]
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
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               album:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: number
 *               coverImage:
 *                 type: string
 *               audioFile:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Song updated
 */
router.put('/:id', protect, authorize('admin'), updateSong);

/**
 * @swagger
 * /api/songs/{id}:
 *   delete:
 *     summary: Delete song
 *     description: Delete a song (admin only)
 *     tags: [Songs]
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
 *         description: Song deleted
 */
router.delete('/:id', protect, authorize('admin'), deleteSong);

/**
 * @swagger
 * /api/songs/{id}/play:
 *   put:
 *     summary: Increment song plays
 *     description: Increment play count for a song
 *     tags: [Songs]
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
 *         description: Play count incremented
 */
router.put('/:id/play', protect, incrementPlays);

/**
 * @swagger
 * /api/songs/{id}/like:
 *   put:
 *     summary: Toggle song like
 *     description: Like or unlike a song
 *     tags: [Songs]
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
 *         description: Like status toggled
 */
router.put('/:id/like', protect, toggleLike);
router.get('/favorites', protect, require('../controllers/user.controller').getFavorites);

module.exports = router; 