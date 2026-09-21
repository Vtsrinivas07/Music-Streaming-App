const express = require('express');
const {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  getArtistSongs,
  getArtistAlbums,
  getFeaturedArtists,
} = require('../controllers/artist.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Get all artists
 *     description: Get a list of all artists
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: List of artists
 */
router.get('/', getArtists);

/**
 * @swagger
 * /api/artists/featured:
 *   get:
 *     summary: Get featured artists
 *     description: Get artists marked as featured by admins
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: List of featured artists
 */
router.get('/featured', getFeaturedArtists);

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Get single artist
 *     description: Get an artist by ID
 *     tags: [Artists]
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
router.get('/:id', getArtist);

/**
 * @swagger
 * /api/artists:
 *   post:
 *     summary: Create new artist
 *     description: Create a new artist (admin only)
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               image:
 *                 type: string
 *               genre:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Artist created
 */
router.post('/', protect, authorize('admin'), createArtist);

/**
 * @swagger
 * /api/artists/{id}:
 *   put:
 *     summary: Update artist
 *     description: Update an artist (admin only)
 *     tags: [Artists]
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
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               image:
 *                 type: string
 *               genre:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Artist updated
 */
router.put('/:id', protect, authorize('admin'), updateArtist);

/**
 * @swagger
 * /api/artists/{id}:
 *   delete:
 *     summary: Delete artist
 *     description: Delete an artist (admin only)
 *     tags: [Artists]
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
 *         description: Artist deleted
 */
router.delete('/:id', protect, authorize('admin'), deleteArtist);

/**
 * @swagger
 * /api/artists/{id}/songs:
 *   get:
 *     summary: Get artist's songs
 *     description: Get all songs by an artist
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of artist's songs
 */
router.get('/:id/songs', getArtistSongs);

/**
 * @swagger
 * /api/artists/{id}/albums:
 *   get:
 *     summary: Get artist's albums
 *     description: Get all albums by an artist
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of artist's albums
 */
router.get('/:id/albums', getArtistAlbums);

module.exports = router; 