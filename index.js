const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho0d8c2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         res.status(401).send({ message: 'Unauthorized access' })
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, function (err, decoded) {
//         if (err) {
//             res.status(401).send({ message: 'Unauthorized access' });
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

async function run() {
    try {
        const addressCollection = client.db('AddressBook').collection('address');
        // const reviewsCollection = client.db('lensQueen').collection('reviews');


        app.get('/address', async (req, res) => {
            const query = {};
            const cursor = addressCollection.find(query);
            const address = await cursor.toArray();
            res.send(address);
        })

        app.get('/address/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await addressCollection.findOne(query);
            res.send(review);
        })

        app.post('/address', async (req, res) => {
            const address = req.body;
            const result = await addressCollection.insertOne(address);
            res.send(result);
        })

        app.patch('/address/:id', async (req, res) => {
            const id = req.params.id;
            const name = req.body.name;
            const email = req.body.email;
            const phone = req.body.phone;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: name,
                    email: email,
                    phone: phone
                }
            }
            const result = await addressCollection.updateOne(query, updateDoc);
            res.send(result);

        })

        app.delete('/address/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addressCollection.deleteOne(query);
            res.send(result);

        })

    }
    finally {

    }
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('addressBook server running!')
})

app.listen(port, () => {
    console.log(`AddressBook server listening on port ${port}`)
})