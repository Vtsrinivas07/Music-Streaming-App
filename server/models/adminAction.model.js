const mongoose = require('mongoose');

const AdminActionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: [true, 'Please provide an action description'],
      enum: [
        'User Created',
        'User Updated',
        'User Deleted',
        'Song Added',
        'Song Updated',
        'Song Deleted',
        'Album Added',
        'Album Updated',
        'Album Deleted',
        'Artist Added',
        'Artist Updated',
        'Artist Deleted',
        'Playlist Featured',
        'Playlist Unfeatured',
        'Other',
      ],
    },
    details: {
      type: String,
      required: [true, 'Please provide action details'],
    },
    entityType: {
      type: String,
      enum: ['User', 'Song', 'Album', 'Artist', 'Playlist', 'Other'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminAction', AdminActionSchema); 