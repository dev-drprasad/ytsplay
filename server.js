const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const app = express();

const DELUGE_UI_URL = `http://localhost:${process.env.DELUGE_UI_PORT || 8112}/json`;

app.use(express.json()) ;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "OPTIONS,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});


app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const changeHost = (url) => {
  const urlObject = new URL(url);
  return `http://localhost:8080${urlObject.pathname}`;
}

app.get('/api/search', function(req, res) {
  const query = req.query.query || null;
  if (!query) {
    return res.json([]);
  }

  const searchUrl = new URL('https://yts.am/ajax/search');
  searchUrl.searchParams.append('query', query);
  fetch(searchUrl.toString())
    .then((ytsResponse) =>  ytsResponse.json())
    .then((jsonResponse) => {
      res.json(jsonResponse.data.map(({ title, url, year, img }) => ({ name: title, url, year, imageUrl: changeHost(img) })));
    })
    .catch((err) => {
      console.log(err);
      res.json([]);
    });
});

app.get('/api/add', (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.json({error: true });
  }
  
  const cookieMatch = req.headers.cookie && req.headers.cookie.match(/_session_id=\w+/);
  if (!cookieMatch) return res.json({ error: { message: 'Not authenticated', code: 1 }});

  fetch(url)
    .then((ytsResponse) =>  ytsResponse.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const magnetLink = $('#modal-quality-720p ~ a.magnet').first().attr('href');
      
      if (!magnetLink) res.json({ error: true });

      console.log('magnetLink :', magnetLink);
      fetch(DELUGE_UI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieMatch[0],
        },
        body: JSON.stringify({
          method: 'core.add_torrent_magnet',
          params: [magnetLink, {}],
          id: 4,
        }),
      })
        .then((delugeResponse) => delugeResponse.json())
        .then((jsonResponse) => {
          res.json(jsonResponse)
        })
        .catch((err) => res.json({ error: true, message: err.message }));

    })
    .catch((err) => res.json({ error: true, message: err.message }));
});

app.get('/api/list', function(req, res) {

  const cookieMatch = req.headers.cookie && req.headers.cookie.match(/_session_id=\w+/);
  if (cookieMatch) {
    fetch(DELUGE_UI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieMatch[0],
      },
      body: JSON.stringify({
        method: 'web.update_ui',
        params: [["name", "progress", "state", "num_seeds"], {}],
        id: 4,
      }),
    })
      .then((delugeResponse) => delugeResponse.json())
      .then((jsonResponse) => {
        res.json(jsonResponse)
      })
      .catch((err) => res.json({ error: true, message: err.message }));
  }
});

app.post('/api/login', (req, res) => {
  const password = req.body.password;
  let cookie = null;
  fetch(DELUGE_UI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': req.headers.Cookie,
    },
    body: JSON.stringify({
      method: 'auth.login',
      params: [password],
      id: 0,
    }),
  })
    .then((delugeResponse) => {
      console.log('delugeResponse.headers :', delugeResponse.headers);
      cookie = delugeResponse.headers.get('Set-Cookie');
      return delugeResponse.json()
    })
    .then((jsonResponse) => {
      res.json({ ...jsonResponse, cookie });
    })
    .catch((err) => res.json({ error: true, message: err.message }));
});

app.get('/assets/*', (req, res) => {
  res.type('image/jpeg');
  fetch(`https://img.yts.am${req.path}`)
    .then(response => response.body.pipe(res))
});

app.listen(process.env.PORT || 8080, () => {
  console.log('app started.');
});
