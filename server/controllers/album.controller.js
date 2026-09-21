const Album = require('../models/album.model');
const Song = require('../models/song.model');
const Artist = require('../models/artist.model');
const AdminAction = require('../models/adminAction.model');

// @desc   Get all albums
// @route  GET /api/albums
// @access Public
exports.getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find()
      .populate('artist', 'name image')
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

// @desc   Get single album
// @route  GET /api/albums/:id
// @access Public
exports.getAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name image bio')
      .populate('songs', 'title duration coverImage');

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

// @desc   Create new album
// @route  POST /api/albums
// @access Private/Admin
exports.createAlbum = async (req, res, next) => {
  try {
    // Check if artist exists
    const artist = await Artist.findById(req.body.artist);
    if (!artist) {
      return res.status(404).json({
        success: false,
        error: 'Artist not found',
      });
    }

    const album = await Album.create(req.body);

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Album Added',
      details: `Album "${album.title}" added`,
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

// @desc   Update album
// @route  PUT /api/albums/:id
// @access Private/Admin
exports.updateAlbum = async (req, res, next) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

// @desc   Delete album
// @route  DELETE /api/albums/:id
// @access Private/Admin
exports.deleteAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        error: 'Album not found',
      });
    }

    // Delete all songs in this album
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

// @desc   Add song to album
// @route  PUT /api/albums/:id/songs
// @access Private/Admin
exports.addSongToAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        error: 'Album not found',
      });
    }

    // Check if song exists
    const song = await Song.findById(req.body.songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found',
      });
    }

    // Check if song is already in album
    if (album.songs.includes(req.body.songId)) {
      return res.status(400).json({
        success: false,
        error: 'Song already in album',
      });
    }

    album.songs.push(req.body.songId);
    await album.save();

    // Update song's album reference
    song.album = album._id;
    await song.save();

    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Remove song from album
// @route  DELETE /api/albums/:id/songs/:songId
// @access Private/Admin
exports.removeSongFromAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        error: 'Album not found',
      });
    }

    // Check if song is in album
    const songIndex = album.songs.indexOf(req.params.songId);
    if (songIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'Song not in album',
      });
    }

    album.songs.splice(songIndex, 1);
    await album.save();

    // Remove album reference from song
    const song = await Song.findById(req.params.songId);
    if (song) {
      song.album = undefined;
      await song.save();
    }

    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get featured albums
// @route  GET /api/albums/featured
// @access Public
exports.getFeaturedAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find({ featured: true })
      .populate('artist', 'name image')
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

// @desc   Get album songs
// @route  GET /api/albums/:id/songs
// @access Public
exports.getAlbumSongs = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id).populate('songs');
    
    if (!album) {
      return res.status(404).json({
        success: false,
        error: 'Album not found',
      });
    }

    res.status(200).json({
      success: true,
      count: album.songs.length,
      data: album.songs,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get new releases
// @route  GET /api/albums/new-releases
// @access Public
exports.getNewReleases = async (req, res, next) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const albums = await Album.find({
      releaseDate: { $gte: oneMonthAgo },
    })
      .populate({ path: 'artist', select: 'name' })
      .sort('-releaseDate')
      .limit(10);

    res.status(200).json({
      success: true,
      count: albums.length,
      data: albums,
    });
  } catch (err) {
    next(err);
  }
}; 