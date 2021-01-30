const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ostva.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const port = 5000
const app = express()
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("ema-john-store").collection("ema-john-collection");
   const OrdersCollection = client.db("ema-john-store").collection("Orders");
 
  app.post('/addProduct', (req, res)=>{
      const products = req.body
      console.log(products)
      collection.insertMany(products)
      .then(result =>{
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
         
      })

  })
  app.get('/products',(req, res) =>{
    collection.find({})
    .toArray((err, document)=>{
      res.send(document)
    })
  })
   
  app.get('/product/:key',(req, res) =>{
    collection.find({key: req.params.key})
      .toArray((err, document)=>{
        res.send(document[0])
      })
  })
   
  app.post('/productsByKeys', (req, res)=>{
    const productkeys = req.body;
    collection.find({key:{$in:productkeys}})
    .toArray((err, document)=>{
       res.send(document)
    })
  })

  app.post('/addOrder', (req, res)=>{
    const Order = req.body
    OrdersCollection.insertOne(Order)
    .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
       
    })

})


});


app.listen(process.env.PORT || port)