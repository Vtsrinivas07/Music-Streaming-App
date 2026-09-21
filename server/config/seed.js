const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Song = require('../models/song.model');
const Playlist = require('../models/playlist.model');

async function seedDatabase() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Artist.deleteMany({});
        await Album.deleteMany({});
        await Song.deleteMany({});
        await Playlist.deleteMany({});

        console.log('Cleared existing data');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            username: 'admin',
            email: 'admin@beatbox.com',
            password: adminPassword,
            role: 'admin'
        });

        console.log('Created admin user');

        // Create sample artist
        const artist = await Artist.create({
            name: 'Sample Artist',
            bio: 'This is a sample artist for testing purposes',
            image: 'https://example.com/artist.jpg',
            featured: true
        });

        console.log('Created sample artist');

        // Create sample album
        const album = await Album.create({
            title: 'Sample Album',
            artist: artist._id,
            releaseDate: new Date(),
            coverImage: 'https://example.com/album.jpg',
            genre: 'Pop'
        });

        console.log('Created sample album');

        // Create sample songs
        const songs = await Song.create([
            {
                title: 'Sample Song 1',
                artist: artist._id,
                album: album._id,
                duration: 180,
                genre: 'Pop',
                featured: true
            },
            {
                title: 'Sample Song 2',
                artist: artist._id,
                album: album._id,
                duration: 200,
                genre: 'Pop'
            }
        ]);

        console.log('Created sample songs');

        // Create sample playlist
        await Playlist.create({
            name: 'Welcome Playlist',
            description: 'A sample playlist to get you started',
            user: admin._id,
            songs: songs.map(song => song._id),
            isPublic: true
        });

        console.log('Created sample playlist');

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

module.exports = seedDatabase; 