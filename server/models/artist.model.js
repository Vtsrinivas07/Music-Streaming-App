const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an artist name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Artist name cannot be more than 50 characters'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    image: {
      type: String,
      default: 'default-artist.jpg',
    },
    genres: [
      {
        type: String,
      },
    ],
    featuredArtist: {
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
ArtistSchema.virtual('songs', {
  ref: 'Song',
  localField: '_id',
  foreignField: 'artist',
  justOne: false,
});

// Reverse populate with albums
ArtistSchema.virtual('albums', {
  ref: 'Album',
  localField: '_id',
  foreignField: 'artist',
  justOne: false,
});

module.exports = mongoose.model('Artist', ArtistSchema); 