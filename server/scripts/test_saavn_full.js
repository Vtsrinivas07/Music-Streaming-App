const CryptoJS = require('crypto-js');

function decryptMediaUrl(cipherText) {
  if (!cipherText) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse('38346591');
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(cipherText) },
      key,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    const url = decrypted.toString(CryptoJS.enc.Utf8);
    if (!url) return null;
    // Prefer high quality 320kbps or 160kbps
    return url.replace(/_96\.mp4$/, '_320.mp4');
  } catch (e) {
    return null;
  }
}

async function searchJioSaavn(query, limit = 10) {
  const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=${limit}&p=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const data = await res.json();
  const results = data.results || [];
  
  return results.map(s => {
    const directAudio = decryptMediaUrl(s.more_info?.encrypted_media_url);
    const artwork = (s.image || '')
      .replace('150x150', '500x500')
      .replace('50x50', '500x500');
    
    const durationSeconds = parseInt(s.more_info?.duration || 210, 10);
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const cleanTitle = (s.title || '')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&');

    const cleanArtist = (s.more_info?.singers || s.subtitle || s.more_info?.music || 'Unknown')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&');

    return {
      _id: `saavn-${s.id}`,
      title: cleanTitle,
      artist: {
        _id: `saavn-artist-${s.more_info?.artistMap?.primary_artists?.[0]?.id || 1}`,
        name: cleanArtist
      },
      album: {
        _id: `saavn-album-${s.album_id || 1}`,
        title: (s.album || cleanTitle).replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&')
      },
      coverImage: artwork || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
      audioUrl: directAudio,
      audioFile: directAudio,
      duration: formattedDuration,
      durationSeconds: durationSeconds,
      isFullSong: true,
      genre: s.language ? `${s.language.charAt(0).toUpperCase() + s.language.slice(1)} Hits` : 'Indian',
      likes: []
    };
  }).filter(s => !!s.audioUrl);
}

async function run() {
  console.log('Testing Tollywood full songs:');
  const tollywood = await searchJioSaavn('Pushpa 2 Telugu', 2);
  console.log(JSON.stringify(tollywood, null, 2));

  console.log('\nTesting Bollywood full songs:');
  const bollywood = await searchJioSaavn('Arijit Singh Hindi', 2);
  console.log(JSON.stringify(bollywood, null, 2));

  console.log('\nTesting Kollywood full songs:');
  const kollywood = await searchJioSaavn('Leo Tamil Anirudh', 2);
  console.log(JSON.stringify(kollywood, null, 2));
}

run().catch(console.error);
