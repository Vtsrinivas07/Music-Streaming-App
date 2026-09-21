const mongoose = require('mongoose');
const User = require('../models/user.model');
const Song = require('../models/song.model');
const AdminAction = require('../models/adminAction.model');

// @desc   Get all users
// @route  GET /api/users
// @access Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single user
// @route  GET /api/users/:id
// @access Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update user
// @route  PUT /api/users/:id
// @access Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Log admin action
    if (req.user.role === 'admin') {
      await AdminAction.create({
        admin: req.user.id,
        action: 'User Updated',
        details: `User ${user.username} (${user._id}) updated`,
        entityType: 'User',
        entityId: user._id,
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete user
// @route  DELETE /api/users/:id
// @access Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Make sure user is not deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'User cannot delete themselves',
      });
    }

    await user.deleteOne();

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'User Deleted',
      details: `User ${user.username} (${user._id}) deleted`,
      entityType: 'User',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

    // Only update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get user favorites
// @route  GET /api/users/favorites
// @access Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const resolvedFavorites = [];
    for (const item of user.favorites || []) {
      if (item && typeof item === 'object' && item.title) {
        resolvedFavorites.push(item);
      } else if (item && mongoose.Types.ObjectId.isValid(item)) {
        try {
          const localSong = await Song.findById(item).populate('artist', 'name');
          if (localSong) resolvedFavorites.push(localSong);
        } catch (e) {}
      }
    }

    res.status(200).json({
      success: true,
      count: resolvedFavorites.length,
      data: resolvedFavorites,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Toggle or add song to user favorites
// @route  POST /api/users/favorites
// @access Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const song = req.body.song || req.body;
    if (!song || (!song._id && !song.id)) {
      return res.status(400).json({ success: false, error: 'Song details required' });
    }

    const songId = String(song._id || song.id);
    const existingIndex = (user.favorites || []).findIndex(f => {
      if (typeof f === 'object') return String(f._id || f.id) === songId;
      return String(f) === songId;
    });

    let liked = false;
    if (existingIndex > -1) {
      user.favorites.splice(existingIndex, 1);
      liked = false;
    } else {
      user.favorites.unshift(song);
      liked = true;
    }

    user.markModified('favorites');
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      liked,
      data: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get user history
// @route  GET /api/users/history
// @access Private
exports.getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'history.song',
      populate: {
        path: 'artist',
        select: 'name',
      },
    });

    // Sort history by timestamp (most recent first)
    user.history.sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json({
      success: true,
      count: user.history.length,
      data: user.history,
    });
  } catch (err) {
    next(err);
  }
}; 