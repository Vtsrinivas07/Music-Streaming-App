const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an album title'],
      trim: true,
      maxlength: [100, 'Album title cannot be more than 100 characters'],
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Please provide a release date'],
    },
    genre: {
      type: String,
      required: [true, 'Please provide a genre'],
    },
    coverImage: {
      type: String,
      default: 'default-album.jpg',
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with songs
AlbumSchema.virtual('songs', {
  ref: 'Song',
  localField: '_id',
  foreignField: 'album',
  justOne: false,
});

module.exports = mongoose.model('Album', AlbumSchema); 