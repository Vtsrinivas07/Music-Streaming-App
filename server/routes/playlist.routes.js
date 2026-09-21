const express = require('express');
const {
  getPlaylists,
  getFeaturedPlaylists,
  getMyPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylists,
} = require('../controllers/playlist.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', getPlaylists);
router.get('/featured', getFeaturedPlaylists);
router.get('/my-playlists', protect, getMyPlaylists);

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     summary: Get single playlist
 *     description: Get a playlist by ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist details
 */
router.get('/:id', getPlaylist);

/**
 * @swagger
 * /api/playlists:
 *   post:
 *     summary: Create new playlist
 *     description: Create a new playlist
 *     tags: [Playlists]
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
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Playlist created
 */
router.post('/', protect, createPlaylist);

/**
 * @swagger
 * /api/playlists/{id}:
 *   put:
 *     summary: Update playlist
 *     description: Update a playlist
 *     tags: [Playlists]
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
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Playlist updated
 */
router.put('/:id', protect, updatePlaylist);

/**
 * @swagger
 * /api/playlists/{id}:
 *   delete:
 *     summary: Delete playlist
 *     description: Delete a playlist
 *     tags: [Playlists]
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
 *         description: Playlist deleted
 */
router.delete('/:id', protect, deletePlaylist);

/**
 * @swagger
 * /api/playlists/{id}/songs:
 *   put:
 *     summary: Add song to playlist
 *     description: Add a song to a playlist
 *     tags: [Playlists]
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
 *         description: Song added to playlist
 */
router.put('/:id/songs', protect, addSongToPlaylist);

/**
 * @swagger
 * /api/playlists/{id}/songs/{songId}:
 *   delete:
 *     summary: Remove song from playlist
 *     description: Remove a song from a playlist
 *     tags: [Playlists]
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
 *         description: Song removed from playlist
 */
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

/**
 * @swagger
 * /api/playlists/user/{userId}:
 *   get:
 *     summary: Get user's playlists
 *     description: Get all playlists created by a specific user
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's playlists
 */
router.get('/user/:userId', getUserPlaylists);

module.exports = router; 