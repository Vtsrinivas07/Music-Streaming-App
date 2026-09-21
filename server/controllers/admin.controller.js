const User = require('../models/user.model');
const Song = require('../models/song.model');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Playlist = require('../models/playlist.model');
const AdminAction = require('../models/adminAction.model');

// @desc   Get all users
// @route  GET /api/admin/users
// @access Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

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
// @route  GET /api/admin/users/:id
// @access Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

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
// @route  PUT /api/admin/users/:id
// @access Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'User Updated',
      details: `User "${user.username}" updated`,
      entityType: 'User',
      entityId: user._id,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete user
// @route  DELETE /api/admin/users/:id
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

    // Delete user's playlists
    await Playlist.deleteMany({ user: user._id });

    // Use deleteOne instead of remove
    await user.deleteOne();

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'User Deleted',
      details: `User "${user.username}" deleted`,
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

// @desc   Get admin actions
// @route  GET /api/admin/actions
// @access Private/Admin
exports.getAdminActions = async (req, res, next) => {
  try {
    const actions = await AdminAction.find()
      .populate('admin', 'username')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: actions.length,
      data: actions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get dashboard stats
// @route  GET /api/admin/stats
// @access Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalSongs,
      totalArtists,
      totalAlbums,
      totalPlaylists,
      recentActions,
    ] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Artist.countDocuments(),
      Album.countDocuments(),
      Playlist.countDocuments(),
      AdminAction.find()
        .populate('admin', 'username')
        .sort('-createdAt')
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSongs,
        totalArtists,
        totalAlbums,
        totalPlaylists,
        recentActions,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Toggle featured status
// @route  PUT /api/admin/feature/:type/:id
// @access Private/Admin
exports.toggleFeatured = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    let model, entity;

    switch (type) {
      case 'song':
        model = Song;
        break;
      case 'artist':
        model = Artist;
        break;
      case 'album':
        model = Album;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid entity type',
        });
    }

    entity = await model.findById(id);

    if (!entity) {
      return res.status(404).json({
        success: false,
        error: `${type} not found`,
      });
    }

    entity.featured = !entity.featured;
    await entity.save();

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: `${type} Featured`,
      details: `${type} "${entity.title || entity.name}" ${entity.featured ? 'featured' : 'unfeatured'}`,
      entityType: type.charAt(0).toUpperCase() + type.slice(1),
      entityId: entity._id,
    });

    res.status(200).json({
      success: true,
      data: entity,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all artists
// @route  GET /api/admin/artists
// @access Private/Admin
exports.getArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find()
      .populate('songs', 'title duration')
      .populate('albums', 'title releaseDate');

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single artist
// @route  GET /api/admin/artists/:id
// @access Private/Admin
exports.getArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate('songs', 'title duration')
      .populate('albums', 'title releaseDate');

    if (!artist) {
      return res.status(404).json({
        success: false,
        error: 'Artist not found',
      });
    }

    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create artist
// @route  POST /api/admin/artists
// @access Private/Admin
exports.createArtist = async (req, res, next) => {
  try {
    const artist = await Artist.create({
      ...req.body,
      addedBy: req.user.id
    });

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Artist Created',
      details: `Artist "${artist.name}" created`,
      entityType: 'Artist',
      entityId: artist._id,
    });

    res.status(201).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update artist
// @route  PUT /api/admin/artists/:id
// @access Private/Admin
exports.updateArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!artist) {
      return res.status(404).json({
        success: false,
        error: 'Artist not found',
      });
    }

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Artist Updated',
      details: `Artist "${artist.name}" updated`,
      entityType: 'Artist',
      entityId: artist._id,
    });

    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete artist
// @route  DELETE /api/admin/artists/:id
// @access Private/Admin
exports.deleteArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        error: 'Artist not found',
      });
    }

    // Delete associated songs and albums
    await Song.deleteMany({ artist: artist._id });
    await Album.deleteMany({ artist: artist._id });

    await artist.deleteOne();

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Artist Deleted',
      details: `Artist "${artist.name}" deleted`,
      entityType: 'Artist',
      entityId: artist._id,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create user
// @route  POST /api/admin/users
// @access Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'User Created',
      details: `User "${username}" created`,
      entityType: 'User',
      entityId: user._id,
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    next(err);
  }
};

// Songs CRUD Operations
exports.getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
      .populate('artist', 'name')
      .populate('album', 'title');

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name')
      .populate('album', 'title');

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

exports.createSong = async (req, res, next) => {
  try {
    const song = await Song.create({
      ...req.body,
      addedBy: req.user.id,
    });

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Song Created',
      details: `Song "${song.title}" created`,
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

exports.updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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

// Albums CRUD Operations
exports.getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find()
      .populate('artist', 'name')
      .populate('songs', 'title duration');

    res.status(200).json({
      success: true,
      count: albums.length,
      data: albums,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name')
      .populate('songs', 'title duration');

    if (!album) {
      return res.status(404).json({
        success: false,
        error: 'Album not found',
      });
    }

    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (err) {
    next(err);
  }
};

exports.createAlbum = async (req, res, next) => {
  try {
    const album = await Album.create({
      ...req.body,
      addedBy: req.user.id,
    });

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Album Created',
      details: `Album "${album.title}" created`,
      entityType: 'Album',
      entityId: album._id,
    });

    res.status(201).json({
      success: true,
      data: album,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAlbum = async (req, res, next) => {
  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!album) {
      return res.status(404).json({
        success: false,
        error: 'Album not found',
      });
    }

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Album Updated',
      details: `Album "${album.title}" updated`,
      entityType: 'Album',
      entityId: album._id,
    });

    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        error: 'Album not found',
      });
    }

    // Delete associated songs
    await Song.deleteMany({ album: album._id });

    await album.deleteOne();

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Album Deleted',
      details: `Album "${album.title}" deleted`,
      entityType: 'Album',
      entityId: album._id,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
}; 