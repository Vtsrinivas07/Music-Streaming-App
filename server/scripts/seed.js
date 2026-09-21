require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Song = require('../models/song.model');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Playlist = require('../models/playlist.model');
const bcrypt = require('bcryptjs');

async function runSeed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beatbox', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Song.deleteMany({});
        await Artist.deleteMany({});
        await Album.deleteMany({});
        await Playlist.deleteMany({});

        console.log('Cleared existing data');

        // Create admin user
        const plainPassword = 'admin123';
        const admin = await User.create({
            username: 'admin',
            email: 'admin@musicbox.com',
            password: plainPassword,
            role: 'admin',
            profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
        });
        console.log('Created admin user with ID:', admin._id);

        // Create regular user
        const regularUser = await User.create({
            username: 'user',
            email: 'user@musicbox.com',
            password: 'user123',
            role: 'user',
            profilePicture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400'
        });
        console.log('Created regular user with ID:', regularUser._id);

        // Create real artists
        const artists = await Artist.insertMany([
            {
                name: 'The Weeknd',
                bio: 'Canadian singer, songwriter, and record producer known for sonic versatility and dark lyricism.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
                featuredArtist: true,
                addedBy: admin._id
            },
            {
                name: 'Dua Lipa',
                bio: 'English and Albanian singer and songwriter, global pop icon behind Future Nostalgia.',
                image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
                featuredArtist: true,
                addedBy: admin._id
            },
            {
                name: 'Billie Eilish',
                bio: 'Academy Award and multiple Grammy-winning American singer-songwriter.',
                image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600',
                featuredArtist: true,
                addedBy: admin._id
            },
            {
                name: 'Taylor Swift',
                bio: 'One of the best-selling music artists of all time with record-breaking global tours.',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
                featuredArtist: true,
                addedBy: admin._id
            },
            {
                name: 'Bruno Mars',
                bio: 'Renowned singer, songwriter, and multi-instrumentalist known for retro showmanship.',
                image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600',
                featuredArtist: true,
                addedBy: admin._id
            }
        ]);

        console.log('Created artists:', artists.length);

        // Create real albums
        const albums = await Album.insertMany([
            {
                title: 'After Hours',
                artist: artists[0]._id,
                releaseYear: 2020,
                coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600',
                addedBy: admin._id,
                genre: 'R&B / Synthwave',
                featured: true,
                releaseDate: new Date('2020-03-20')
            },
            {
                title: 'Future Nostalgia',
                artist: artists[1]._id,
                releaseYear: 2020,
                coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
                addedBy: admin._id,
                genre: 'Dance-Pop',
                featured: true,
                releaseDate: new Date('2020-03-27')
            },
            {
                title: 'WHEN WE ALL FALL ASLEEP',
                artist: artists[2]._id,
                releaseYear: 2019,
                coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
                addedBy: admin._id,
                genre: 'Alternative Pop',
                featured: true,
                releaseDate: new Date('2019-03-29')
            },
            {
                title: 'Lover',
                artist: artists[3]._id,
                releaseYear: 2019,
                coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
                addedBy: admin._id,
                genre: 'Pop',
                featured: true,
                releaseDate: new Date('2019-08-23')
            },
            {
                title: '24K Magic',
                artist: artists[4]._id,
                releaseYear: 2016,
                coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600',
                addedBy: admin._id,
                genre: 'Funk Pop',
                featured: true,
                releaseDate: new Date('2016-11-18')
            }
        ]);

        console.log('Created albums:', albums.length);

        // Create real songs with working streaming audio and high-res artwork
        const songs = await Song.insertMany([
            {
                title: 'Blinding Lights',
                artist: artists[0]._id,
                album: albums[0]._id,
                duration: 200,
                audioUrl: 'https://aac.saavncdn.com/077/0b02a92687d1ae3369b6859f44872e52_320.mp4',
                audioFile: 'https://aac.saavncdn.com/077/0b02a92687d1ae3369b6859f44872e52_320.mp4',
                addedBy: admin._id,
                genre: 'Pop / Synthwave',
                featured: true,
                coverImage: 'https://c.saavncdn.com/077/After-Hours-English-2020-20260804045014-500x500.jpg',
                likes: [admin._id]
            },
            {
                title: 'Levitating',
                artist: artists[1]._id,
                album: albums[1]._id,
                duration: 203,
                audioUrl: 'https://aac.saavncdn.com/665/7790c3b9097592113008eaf1031d6e57_320.mp4',
                audioFile: 'https://aac.saavncdn.com/665/7790c3b9097592113008eaf1031d6e57_320.mp4',
                addedBy: admin._id,
                genre: 'Dance-Pop',
                featured: true,
                coverImage: 'https://c.saavncdn.com/665/Levitating-English-2020-20201002043641-500x500.jpg',
                likes: [admin._id, regularUser._id]
            },
            {
                title: 'Bad Guy',
                artist: artists[2]._id,
                album: albums[2]._id,
                duration: 194,
                audioUrl: 'https://aac.saavncdn.com/025/3b05d69eea7b4fec5e71c8a8a36007ad_320.mp4',
                audioFile: 'https://aac.saavncdn.com/025/3b05d69eea7b4fec5e71c8a8a36007ad_320.mp4',
                addedBy: admin._id,
                genre: 'Alternative Pop',
                featured: true,
                coverImage: 'https://c.saavncdn.com/025/WHEN-WE-ALL-FALL-ASLEEP-WHERE-DO-WE-GO-English-2019-20190329043232-500x500.jpg',
                likes: []
            },
            {
                title: 'Cruel Summer',
                artist: artists[3]._id,
                album: albums[3]._id,
                duration: 178,
                audioUrl: 'https://aac.saavncdn.com/243/cf6b522de1390996fdbe109298873c72_320.mp4',
                audioFile: 'https://aac.saavncdn.com/243/cf6b522de1390996fdbe109298873c72_320.mp4',
                addedBy: admin._id,
                genre: 'Pop',
                featured: true,
                coverImage: 'https://c.saavncdn.com/243/The-Cruelest-Summer-English-2023-20231109123211-500x500.jpg',
                likes: [regularUser._id]
            },
            {
                title: '24K Magic',
                artist: artists[4]._id,
                album: albums[4]._id,
                duration: 226,
                audioUrl: 'https://aac.saavncdn.com/938/869f2f86745affa8a3a6fd080ae70c7b_320.mp4',
                audioFile: 'https://aac.saavncdn.com/938/869f2f86745affa8a3a6fd080ae70c7b_320.mp4',
                addedBy: admin._id,
                genre: 'Funk Pop',
                featured: true,
                coverImage: 'https://c.saavncdn.com/938/24K-Magic-English-2016-500x500.jpg',
                likes: []
            }
        ]);

        console.log('Created songs:', songs.length);

        // Create rich playlists
        await Playlist.insertMany([
            {
                name: "Today's Top Hits",
                description: 'The hottest tracks on the planet right now. Handpicked daily.',
                user: admin._id,
                songs: songs.map(s => s._id),
                isPublic: true,
                featured: true,
                coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'
            },
            {
                name: 'Pop Rising & Anthems',
                description: 'Future pop anthems and breakthrough sounds.',
                user: admin._id,
                songs: [songs[1]._id, songs[3]._id],
                isPublic: true,
                featured: true,
                coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600'
            },
            {
                name: 'Midnight Vibes & Synthwave',
                description: 'Late night driving beats, neo-noir atmospheres, and retro synths.',
                user: regularUser._id,
                songs: [songs[0]._id, songs[2]._id, songs[4]._id],
                isPublic: true,
                featured: true,
                coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600'
            }
        ]);

        console.log('Created playlists successfully!');
        console.log('Database re-seeded with real music hits!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

runSeed();