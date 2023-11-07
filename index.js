const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
require("dotenv").config()
const port = process.env.PORT || 3000
const app = express()

// middleware
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true

}))
app.use(cookieParser())


// mongodb database connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERS_DB}:${process.env.DB_PASS}@cluster0.kndeci6.mongodb.net/?retryWrites=true&w=majority`;

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
        const bidsCollection = database.collection("bidsCollection")


        // jwt 
        app.post("/jwt", async (req, res) => {
            const user = req.body
            // console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1h'
            })
            res
            .cookie('token', token, {
            httpOnly: true,
            secure: false
            })
            res.send({success:true})
        })


        // jobCollection
        // get :: (specefic job category)
        app.get("/api/v1/job-category", async (req, res) => {
            const result = await jobCollection.find().toArray()
            res.send(result)

        })


        // get :: (job-details)
        app.get("/api/v1/:jobId/job-details", async (req, res) => {
            const jobId = req.params.jobId
            const query = { _id: new ObjectId(jobId) }
            const result = await jobCollection.findOne(query)
            res.send(result)
        })


        // get :: (my-posted-job, user based )
        app.get("/api/v1/my-posted-jobs", async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await jobCollection.find(query).toArray()
            res.send(result)
        })


        // post :: (add-job)
        app.post("/api/v1/add-job", async (req, res) => {
            const addJob = req.body
            const result = await jobCollection.insertOne(addJob)
            res.send(result)
        })


        // patch :: (update-posted-job)
        app.patch("/api/v1/:postedJobId/update-posted-job", async (req, res) => {
            const postedJobId = req.params.postedJobId
            const query = { _id: new ObjectId(postedJobId) }
            const updatePostedJob = req.body
            const postedJob = {
                $set: {
                    email: updatePostedJob.email,
                    jobTitle: updatePostedJob.jobTitle,
                    deadline: updatePostedJob.deadline,
                    description: updatePostedJob.description,
                    category: updatePostedJob.category,
                    minimumPrice: updatePostedJob.minimumPrice,
                    maximumPrice: updatePostedJob.maximumPrice
                }
            }
            const result = await jobCollection.updateOne(query, postedJob)
            res.send(result)
        })


        // delete :: (delete-posted-job)
        app.delete("/api/v1/:postedJobId/delete-posted-job", async (req, res) => {
            const postedJobId = req.params.postedJobId
            const query = { _id: new ObjectId(postedJobId) }
            const result = await jobCollection.deleteOne(query)
            res.send(result)
        })



        // bidsCollection
        // get :: (my-bids, user based)
        app.get("/api/v1/my-bids", async (req, res) => {
            let query = {}
            if (req.query.biddingEmail) {
                query = { biddingEmail: req.query.biddingEmail }
            }
            // console.log(req.query.biddingEmail);
            const result = await bidsCollection.find(query).toArray()
            res.send(result)
        })


        // get :: (bid-req) (vol houar somvhabona ase)
        app.get("/api/v1/bid-request", async (req, res) => {
            let query = {}
            if (req.query.clientEmail) {
                query = { clientEmail: req.query.clientEmail }
            }
            // console.log(req.query.clientEmail);
            const result = await bidsCollection.find(query).toArray()
            res.send(result)
        })



        // post :: (bid-on-the-project)
        app.post("/api/v1/bid-on-the-project", async (req, res) => {
            const bidOnTheProject = req.body
            const result = await bidsCollection.insertOne(bidOnTheProject)
            res.send(result)
        })


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