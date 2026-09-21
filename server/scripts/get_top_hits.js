const CryptoJS = require('crypto-js');

function decrypt(cipher) {
  if (!cipher) return null;
  const key = CryptoJS.enc.Utf8.parse('38346591');
  const d = CryptoJS.DES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(cipher) },
    key,
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
  );
  const u = d.toString(CryptoJS.enc.Utf8);
  return u ? u.replace(/_96\.mp4$/, '_320.mp4') : null;
}

async function get(q) {
  const r = await fetch('https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=1&p=1&q=' + encodeURIComponent(q), {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const j = await r.json();
  const s = j.results?.[0];
  if (!s) return console.log(q, 'NOT FOUND');
  console.log(JSON.stringify({
    title: (s.title || '').replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
    artist: (s.more_info?.singers || s.subtitle || '').replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
    album: (s.album || '').replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
    duration: s.more_info?.duration,
    image: (s.image || '').replace('150x150', '500x500'),
    audio: decrypt(s.more_info?.encrypted_media_url)
  }, null, 2));
}

(async () => {
  await get('Chuttamalle Telugu Devara');
  await get('Naatu Naatu Telugu');
  await get('Kesariya Hindi Brahmastra');
  await get('Apna Bana Le Hindi');
  await get('Hukum Tamil Jailer');
  await get('Badass Tamil Leo');
})();
