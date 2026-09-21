require('dotenv').config();
const mongoose = require('mongoose');

const updatedSongs = [
  {
    title: 'Blinding Lights',
    audioUrl: 'https://aac.saavncdn.com/077/0b02a92687d1ae3369b6859f44872e52_320.mp4',
    duration: 200,
    coverImage: 'https://c.saavncdn.com/077/After-Hours-English-2020-20260804045014-500x500.jpg'
  },
  {
    title: 'Levitating',
    audioUrl: 'https://aac.saavncdn.com/665/7790c3b9097592113008eaf1031d6e57_320.mp4',
    duration: 203,
    coverImage: 'https://c.saavncdn.com/665/Levitating-English-2020-20201002043641-500x500.jpg'
  },
  {
    title: 'Bad Guy',
    audioUrl: 'https://aac.saavncdn.com/025/3b05d69eea7b4fec5e71c8a8a36007ad_320.mp4',
    duration: 194,
    coverImage: 'https://c.saavncdn.com/025/WHEN-WE-ALL-FALL-ASLEEP-WHERE-DO-WE-GO-English-2019-20190329043232-500x500.jpg'
  },
  {
    title: 'Cruel Summer',
    audioUrl: 'https://aac.saavncdn.com/243/cf6b522de1390996fdbe109298873c72_320.mp4',
    duration: 178,
    coverImage: 'https://c.saavncdn.com/243/The-Cruelest-Summer-English-2023-20231109123211-500x500.jpg'
  },
  {
    title: '24K Magic',
    audioUrl: 'https://aac.saavncdn.com/938/869f2f86745affa8a3a6fd080ae70c7b_320.mp4',
    duration: 226,
    coverImage: 'https://c.saavncdn.com/938/24K-Magic-English-2016-500x500.jpg'
  }
];

async function update() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beatbox');
  const Song = mongoose.model('Song', new mongoose.Schema({}, { strict: false }));
  
  for (const item of updatedSongs) {
    const updated = await Song.findOneAndUpdate(
      { title: item.title },
      { 
        $set: { 
          audioUrl: item.audioUrl, 
          duration: item.duration,
          coverImage: item.coverImage
        } 
      },
      { new: true }
    );
    console.log('Updated in DB:', item.title, '->', updated ? 'SUCCESS' : 'NOT FOUND');
  }

  await mongoose.disconnect();
  console.log('Database updated successfully!');
}

update().catch(err => {
  console.error('Error updating DB:', err);
  process.exit(1);
});
