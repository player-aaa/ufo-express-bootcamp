import express from 'express';
import { read, add, edit, write } from './jsonFileStorage.js';
import methodOverride from 'method-override'

const app = express();
app.set('view engine', 'ejs');

// Configure Express to parse request body data into request.body
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'))

const PORT = 3004;

app.get('/sighting', (req, res) => {
  // read('data.json', (err, jsonContentObj) => {
  //   if (err) {
  //     res.status(500).send('DB read error.');
  //   }

  //   // const {sightings} = jsonContentObj
    
  // })
  res.render('sighting');
})

app.post('/sighting', (req, res) => {
  const form = req.body;
  form.duration += ' minutes';
  const datetimeArray = form.date_time.split('T');
  const dateArray = datetimeArray[0].split('-');
  const datetime = `${dateArray[2]}/${Number(dateArray[1])}/${dateArray[0].substr(2,2)} ${datetimeArray[1]}`;
  form.date_time = datetime;

  add('data.json', 'sightings', form, (err) => {
    if (err) {
      res.status(500).send('DB write error.');
      return;
    }
    // Acknowledge recipe saved.
    res.send('Saved sighting!');
  });
})

app.get('/sighting/:index', (req, res) => {
  read('data.json', (err, jsonContentObj) => {
    if (err) {
      res.status(500).send('DB write error.');
    }

    const {sightings} = jsonContentObj;
    const {index} = req.params;
    const singleSighting = sightings[index];
    const ejsObject = {singleSighting, index};
    console.log(ejsObject);
    res.render('viewSighting', ejsObject);
  })
})

app.get('/', (req,res) => {
  read('data.json', (err, jsonContentObj) => {
    if (err) {
      res.status(500).send('DB read error.');
    }

    const {sightings} = jsonContentObj;
    const ejsObject = {sightings};

    res.render('viewSighting', ejsObject);
  });
})

app.get('/sighting/:index/edit', (req, res) => {
  read('data.json', (err, jsonContentObj) => {
    if (err) {
      res.status(500).send('DB read error.');
    }

    const {sightings} = jsonContentObj;
    const {index} = req.params;
    const singleSighting = sightings[index];
    const ejsObject = {singleSighting, index};

    res.render('sighting', ejsObject);
  });
})

app.put('/sighting/:index/edit', (req, res) => {
  const index = Number(req.body.index);
  delete req.body.index;
  const form = req.body;
  form.duration += ' minutes';
  const datetimeArray = form.date_time.split('T');
  const dateArray = datetimeArray[0].split('-');
  const datetime = `${dateArray[2]}/${Number(dateArray[1])}/${dateArray[0].substr(2,2)} ${datetimeArray[1]}`;
  form.date_time = datetime;

  edit('data.json', (readErr, jsonContentObj) => {
    if (readErr) {
      res.status(500).send('DB read error.');
    }

    const {sightings} = jsonContentObj
    sightings[index] = form;
    jsonContentObj.sightings = sightings
    console.log(jsonContentObj.sightings[index])

  }, (writeErr) => {
    if (writeErr) {
      res.status(500).send('DB write error.');
    }
    
    res.send('Sighting edited!');
  });
})

app.delete('/sighting/:index/delete', (req, res) => {

})

app.get('/shapes', (req,res) => {

})

app.get('/shapes/:shape', (req,res) => {
  
})

// Save new recipe data sent via POST request from our form
app.post('/recipe', (request, response) => {

  // Add new recipe data in request.body to recipes array in data.json.
  add('data.json', 'recipes', request.body, (err) => {
    if (err) {
      response.status(500).send('DB write error.');
      return;
    }
    // Acknowledge recipe saved.
    response.send('Saved recipe!');
  });
});

// Render the form to input new recipes
app.get('/recipe', (request, response) => {
  response.render('recipe');
});

app.listen(PORT);