const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const ObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
const { static } = require('express');
require('dotenv').config();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('services'));
app.use(fileUpload())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhonm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appoinmentCollection = client.db("lovePet").collection("appoinments");

  app.post('/addAppoinment', (req, res) => {
    const appoinment = req.body;
    console.log(appoinment);
    appoinmentCollection.insertOne(appoinment)
      .then(result => {
        console.log('inserted count :', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/allAppointmets', (req, res) => {
    appoinmentCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


    app.post('/appoinmentsByDate', (req, res) => {
      const date = req.body;
      const email = req.body.email
      console.log(date.date);
      appoinmentCollection.find({date : date.date})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })


 


  const servicesCollection = client.db("lovePet").collection("services");

  app.post('/addAService', (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService)
      .then(result => {
        console.log('inserted count :', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  const reviewsCollection = client.db("lovePet").collection("reviews");


  app.post('/addAReview', (req, res) => {
    const newReview = req.body;
    reviewsCollection.insertOne(newReview)
      .then(result => {
        console.log('inserted count :', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/reviews', (req, res) => {
    reviewsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  // client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


