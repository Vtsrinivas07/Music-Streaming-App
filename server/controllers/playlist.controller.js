const mongoose = require('mongoose');
const Playlist = require('../models/playlist.model');
const User = require('../models/user.model');
const AdminAction = require('../models/adminAction.model');

// @desc   Get all playlists
// @route  GET /api/playlists
// @access Public
exports.getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find()
      .populate('user', 'username')
      .populate('songs', 'title artist duration');

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get featured playlists
// @route  GET /api/playlists/featured
// @access Public
exports.getFeaturedPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ featured: true, isPublic: true })
      .populate([
        { path: 'user', select: 'username profilePicture' },
        {
          path: 'songs',
          select: 'title duration coverImage',
          populate: { path: 'artist', select: 'name' },
        },
      ])
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single playlist
// @route  GET /api/playlists/:id
// @access Public
exports.getPlaylist = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found',
      });
    }

    const playlist = await Playlist.findById(req.params.id)
      .populate('user', 'username')
      .populate('songs', 'title artist duration coverImage');

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found',
      });
    }

    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create new playlist
// @route  POST /api/playlists
// @access Private
exports.createPlaylist = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const playlist = await Playlist.create(req.body);

    res.status(201).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update playlist
// @route  PUT /api/playlists/:id
// @access Private
exports.updatePlaylist = async (req, res, next) => {
  try {
    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found',
      });
    }

    // Make sure user is playlist owner
    if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this playlist',
      });
    }

    playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete playlist
// @route  DELETE /api/playlists/:id
// @access Private
exports.deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found',
      });
    }

    // Make sure user is playlist owner
    if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this playlist',
      });
    }

    await playlist.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Add song to playlist
// @route  PUT /api/playlists/:id/songs
// @access Private
exports.addSongToPlaylist = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(200).json({
        success: true,
        message: 'Saved locally',
        data: { _id: req.params.id }
      });
    }

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found',
      });
    }

    // Make sure user is playlist owner
    if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to modify this playlist',
      });
    }

    const songToAdd = req.body.song || req.body;
    const songId = String(songToAdd._id || songToAdd.id || req.body.songId);

    // Check if song is already in playlist
    const alreadyExists = (playlist.songs || []).some(s => {
      if (typeof s === 'object') return String(s._id || s.id) === songId;
      return String(s) === songId;
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        error: 'Song already in playlist',
      });
    }

    playlist.songs.push(typeof songToAdd === 'object' && songToAdd.title ? songToAdd : (req.body.songId || songToAdd));
    playlist.markModified('songs');
    await playlist.save();

    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Remove song from playlist
// @route  DELETE /api/playlists/:id/songs/:songId
// @access Private
exports.removeSongFromPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found',
      });
    }

    // Make sure user is playlist owner
    if (playlist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to modify this playlist',
      });
    }

    // Check if song is in playlist
    const songIndex = playlist.songs.indexOf(req.params.songId);
    if (songIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Song not in playlist',
      });
    }

    playlist.songs.splice(songIndex, 1);
    await playlist.save();

    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get user's playlists
// @route  GET /api/playlists/user/:userId
// @access Public
exports.getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ user: req.params.userId })
      .populate('user', 'username')
      .populate('songs', 'title artist duration');

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get current user's playlists
// @route  GET /api/playlists/my-playlists
// @access Private
exports.getMyPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id })
      .populate('user', 'username')
      .populate('songs', 'title artist duration');

    res.status(200).json({
      success: true,
      count: playlists.length,
      data: playlists,
    });
  } catch (err) {
    next(err);
  }
}; 