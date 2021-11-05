const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const db = require('./db/db');

const upload = multer({dest: 'uploads/'});
const app = express();

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/home', async (req, res) => {
  /*
  console.log('hey we hit the home route');

  response.send('hello this is a response');
  */
  const posts = await db.models.post.findAll();

  res.render('home', {posts: posts});
});

app.get('/list-directory', (req, res) => {
  const files = fs.readdirSync(__dirname);

  console.log('__dirname = ' + __dirname);

  res.send(files);
});

app.get('/math', (req, res) => {
  console.log(req.query);
  const {
    query: {a, b},
  } = req;

  const aNum = parseInt(a, 10);
  const bNum = parseInt(b, 10);

  // res.send(`The sum of ${a} and ${b} is ${aNum + bNum}`);
  res.render('math', {a, b, sum: aNum + bNum});
});

app.get('/post', (req, res) => {
  res.render('post', {error: null});
});

async function uploadPhoto(path) {
  console.log(`photo is at ${path}`);

  const data = new FormData();

  const file = fs.readFileSync(path);
  data.append('image', file);

  const config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: {
      'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      ...data.getHeaders(),
    },
    data,
  };

  const response = await axios(config);

  console.log(response.data);

  return response.data.data.link;
}

app.post('/post', upload.single('photo'), async (req, res) => {
  const caption = req.body.caption;

  if (!caption) {
    res.render('post', {error: 'Please provide a caption'});
    return;
  }

  const photoUrl = await uploadPhoto(req.file.path);

  await db.models.post.create({caption, photoUrl});

  console.log('Saved in db');

  res.redirect('home');
});

app.listen(45678, () => {
  console.log('Successfully started back-end server!');
});
