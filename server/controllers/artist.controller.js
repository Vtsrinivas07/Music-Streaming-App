const Artist = require('../models/artist.model');
const Song = require('../models/song.model');
const Album = require('../models/album.model');
const AdminAction = require('../models/adminAction.model');

// @desc   Get all artists
// @route  GET /api/artists
// @access Public
exports.getArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find()
      .populate('songs', 'title duration')
      .populate('albums', 'title coverImage');

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
// @route  GET /api/artists/:id
// @access Public
exports.getArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate('songs', 'title duration coverImage')
      .populate('albums', 'title coverImage releaseDate');

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

// @desc   Create new artist
// @route  POST /api/artists
// @access Private/Admin
exports.createArtist = async (req, res, next) => {
  try {
    const artist = await Artist.create(req.body);

    // Log admin action
    await AdminAction.create({
      admin: req.user.id,
      action: 'Artist Added',
      details: `Artist "${artist.name}" added`,
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
// @route  PUT /api/artists/:id
// @access Private/Admin
exports.updateArtist = async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
// @route  DELETE /api/artists/:id
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

    // Delete all songs by this artist
    await Song.deleteMany({ artist: artist._id });

    // Delete all albums by this artist
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

// @desc   Get artist's songs
// @route  GET /api/artists/:id/songs
// @access Public
exports.getArtistSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({ artist: req.params.id })
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

// @desc   Get artist's albums
// @route  GET /api/artists/:id/albums
// @access Public
exports.getArtistAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find({ artist: req.params.id })
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

// @desc   Get featured artists
// @route  GET /api/artists/featured
// @access Public
exports.getFeaturedArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find({ $or: [{ featured: true }, { featuredArtist: true }] })
      .populate('songs', 'title duration')
      .populate('albums', 'title coverImage');

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists,
    });
  } catch (err) {
    next(err);
  }
}; 