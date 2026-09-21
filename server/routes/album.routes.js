const express = require('express');
const {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum,
  getFeaturedAlbums,
  getNewReleases,
  getAlbumSongs
} = require('../controllers/album.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Get all albums
 *     description: Get a list of all albums with filtering, pagination and sorting
 *     tags: [Albums]
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
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort fields (e.g. -releaseDate,title)
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to select (e.g. title,artist,releaseDate)
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
 *         description: List of albums
 */
router.get('/', getAlbums);

/**
 * @swagger
 * /api/albums/featured:
 *   get:
 *     summary: Get featured albums
 *     description: Get albums marked as featured by admins
 *     tags: [Albums]
 *     responses:
 *       200:
 *         description: List of featured albums
 */
router.get('/featured', getFeaturedAlbums);

/**
 * @swagger
 * /api/albums/new-releases:
 *   get:
 *     summary: Get new releases
 *     description: Get albums released in the last month
 *     tags: [Albums]
 *     responses:
 *       200:
 *         description: List of new releases
 */
router.get('/new-releases', getNewReleases);

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: Get single album
 *     description: Get an album by ID
 *     tags: [Albums]
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
router.get('/:id', getAlbum);

/**
 * @swagger
 * /api/albums/{id}/songs:
 *   get:
 *     summary: Get album songs
 *     description: Get all songs in an album
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of album songs
 */
router.get('/:id/songs', getAlbumSongs);

/**
 * @swagger
 * /api/albums:
 *   post:
 *     summary: Create new album
 *     description: Create a new album (admin only)
 *     tags: [Albums]
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
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Album created
 */
router.post('/', protect, authorize('admin'), createAlbum);

/**
 * @swagger
 * /api/albums/{id}:
 *   put:
 *     summary: Update album
 *     description: Update an album (admin only)
 *     tags: [Albums]
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
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Album updated
 */
router.put('/:id', protect, authorize('admin'), updateAlbum);

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: Delete album
 *     description: Delete an album (admin only)
 *     tags: [Albums]
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
 *         description: Album deleted
 */
router.delete('/:id', protect, authorize('admin'), deleteAlbum);

/**
 * @swagger
 * /api/albums/{id}/songs:
 *   put:
 *     summary: Add song to album
 *     description: Add a song to an album (admin only)
 *     tags: [Albums]
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
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song added to album
 */
router.put('/:id/songs', protect, authorize('admin'), addSongToAlbum);

/**
 * @swagger
 * /api/albums/{id}/songs/{songId}:
 *   delete:
 *     summary: Remove song from album
 *     description: Remove a song from an album (admin only)
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song removed from album
 */
router.delete('/:id/songs/:songId', protect, authorize('admin'), removeSongFromAlbum);

module.exports = router; 