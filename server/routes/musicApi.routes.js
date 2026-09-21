const express = require('express');
const router = express.Router();
const { searchSongs, getTrending, getIndianSongs } = require('../controllers/musicApi.controller');

router.get('/search', searchSongs);
router.get('/trending', getTrending);
router.get('/indian', getIndianSongs);

module.exports = router;
