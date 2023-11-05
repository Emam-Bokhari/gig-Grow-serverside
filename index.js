const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
require("dotenv").config()
const port = process.env.PORT || 3000
const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// username and passwod
// gigGrow
// 23BItNYL3Cl2VJFr

// mongodb database connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://gigGrow:23BItNYL3Cl2VJFr@cluster0.kndeci6.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // database collection
        const database = client.db("gigGrowDB")
        const jobCollection = database.collection("jobCollection")



        // jobCollection
       


        // Send a ping to confirm a successful connection
        client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Server is running...")
})

app.listen(port, (req, res) => {
    console.log(`port${port}`);
})