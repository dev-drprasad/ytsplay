const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const app = express();

const DELUGE_UI_URL = `http://${process.env.DELUGE_UI_HOST || 'localhost:8112'}/json`;

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
  if (!url) return null

  const urlObject = new URL(url);
  return urlObject.pathname;
}

app.get('/api/search', function(req, res) {
  const query = req.query.query || null;
  const type = req.query.type || 'movies';
  if (!query) {
    return res.json([]);
  }

  if (type === 'shows') {
    const searchUrl = new URL('http://ytsyify.cc');
    searchUrl.searchParams.append('s', query);
    fetch(searchUrl.toString())
      .then((response) => response.text())
      .then((html) => {
        const $ = cheerio.load(html);
        const searchListElems = $('.main-content .movies-list div[data-movie-id] > a')
        const searchList =  searchListElems.map((_, el) => {
          const $el = $(el);
          return {
            name: $el.attr('oldtitle'),
            url: $el.attr('href'),
            year: null,
            imageUrl: changeHost($el.children('img').attr('data-original').trim())
          }
        }).get().filter(({ url }) => url.match(/\/series\//));

        res.json(searchList)
      });
  }

  if (type === 'movies') {
    const searchUrl = new URL('https://yts.am/ajax/search');
    searchUrl.searchParams.append('query', query);
    fetch(searchUrl.toString())
      .then((ytsResponse) =>  ytsResponse.json())
      .then((jsonResponse) => {
        res.json((jsonResponse.data || []).map(({ title, url, year, img }) => ({ name: title, url, year, imageUrl: changeHost(img) })));
      })
      .catch((err) => {
        console.log(err);
        res.json([]);
      });
  }
});

app.get('/api/show', (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({error: true });
  }

  fetch(url)
    .then((response) =>  response.text())
    .then((html) => {
      const $ = cheerio.load(html);
      const episodeList = [];
      $('#seasons .tvseason').each((_, el) => {
        const seasonNo = $(el).find('.les-title strong').text().trim();
        $(el).find('.les-content > a').each((_, el) => {
          const $el = $(el);
          episodeList.push( {
            title: seasonNo + ' ' + $el.text().trim(),
            url: $el.attr('href')
          })
        });
      })
      
      res.json(episodeList)

    })
    .catch((err) => res.json({ error: true, message: err.message }));
});

app.get('/api/add', (req, res) => {
  const url = req.query.url;
  const type = req.query.type;
  if (!url) {
    return res.json({error: {message: 'no URL present'} });
  }
  
  const cookieMatch = req.headers.cookie && req.headers.cookie.match(/_session_id=\w+/);
  if (!cookieMatch) return res.json({ error: { message: 'Not authenticated', code: 1 }});

  fetch(url)
    .then((ytsResponse) =>  ytsResponse.text())
    .then((html) => {
      const $ = cheerio.load(html);

      let magnetLink = null;
      if (type === 'movies') {
        magnetLink = $('#modal-quality-720p ~ a.magnet').first().attr('href');
      }

      if (type === 'shows') {
        const [el720p] = $('#list-dl .lnk-lnk').filter((_, el) => $(el).text().trim().includes('720p')).get() || []
        if (el720p) {
          magnetLink = $(el720p).attr('href');
        } else {
          const [firstMagnetEl] = $('#list-dl .lnk-lnk').filter((_, el) => $(el).text().trim().includes('Magnet')).get() || []
          if (firstMagnetEl) {
            magnetLink = $(firstMagnetEl).attr('href');
          }
        }
      }
      
      if (!magnetLink) {
        res.json({ error: { message: 'No magnet link present '} })
        return;
      };
      
      if (magnetLink.startsWith('http')) {
        magnetLink = new URL(magnetLink).toString();
      }
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
        params: [["name", "progress", "state", "num_seeds", "hash"], {}],
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

app.get('/t/p/*', (req, res) => {
  res.type('image/jpeg');
  fetch(`https://image.tmdb.org${req.path}`)
    .then(response => response.body.pipe(res))
});

app.listen(process.env.PORT || 8080, () => {
  console.log('app started.');
});
