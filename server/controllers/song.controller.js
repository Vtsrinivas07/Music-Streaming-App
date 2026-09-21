const mongoose = require('mongoose');
const Song = require('../models/song.model');
const User = require('../models/user.model');
const AdminAction = require('../models/adminAction.model');

// @desc   Get all songs
// @route  GET /api/songs
// @access Public
exports.getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
      .populate('artist', 'name image')
      .populate('album', 'title coverImage');

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single song
// @route  GET /api/songs/:id
// @access Public
exports.getSong = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: 'Song not found in local database',
      });
    }

    const song = await Song.findById(req.params.id)
      .populate('artist', 'name image bio')
      .populate('album', 'title coverImage releaseDate');

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create new song
// @route  POST /api/songs
// @access Private/Admin
exports.createSong = async (req, res, next) => {
  try {
    const song = await Song.create(req.body);

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Song Added',
      details: `Song "${song.title}" added`,
      entityType: 'Song',
      entityId: song._id,
    });

    res.status(201).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update song
// @route  PUT /api/songs/:id
// @access Private/Admin
exports.updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Song Updated',
      details: `Song "${song.title}" updated`,
      entityType: 'Song',
      entityId: song._id,
    });

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete song
// @route  DELETE /api/songs/:id
// @access Private/Admin
exports.deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    await song.deleteOne();

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Song Deleted',
      details: `Song "${song.title}" deleted`,
      entityType: 'Song',
      entityId: song._id,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Increment song plays
// @route  PUT /api/songs/:id/play
// @access Private
exports.incrementPlays = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(200).json({
        success: true,
        message: 'External song play registered',
        data: { _id: req.params.id, plays: 1 }
      });
    }

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    await song.incrementPlays();

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Toggle song like
// @route  PUT /api/songs/:id/like
// @access Private
exports.toggleLike = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      // Save or toggle external song in user favorites
      const user = await User.findById(req.user.id);
      if (user) {
        const idStr = String(req.params.id);
        const songToSave = req.body.song || (typeof req.body === 'object' && req.body.title ? req.body : { _id: idStr });
        const existingIdx = (user.favorites || []).findIndex(f => {
          if (typeof f === 'object') return String(f._id || f.id) === idStr;
          return String(f) === idStr;
        });

        let liked = false;
        if (existingIdx > -1) {
          user.favorites.splice(existingIdx, 1);
          liked = false;
        } else {
          user.favorites.unshift(songToSave);
          liked = true;
        }

        user.markModified('favorites');
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
          success: true,
          liked,
          message: liked ? 'Song added to favorites' : 'Song removed from favorites',
          data: user.favorites
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Favorite updated',
        data: { _id: req.params.id }
      });
    }

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    await song.toggleLike(req.user.id);

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get featured songs
// @route  GET /api/songs/featured
// @access Public
exports.getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({ featured: true })
      .populate('artist', 'name image')
      .populate('album', 'title coverImage');

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (err) {
    next(err);
  }
}; 