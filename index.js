const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config()

//middleware 

// app.use(cors());
const corsConfig={
    origin: true,
    Credentials: true,
}
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aetvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


console.log(uri)


async function run(){

    try{
        await client.connect();
        const taskCollection = client.db('doctor-portal').collection('todo-task');

        app.post('/task', async(req, res)=>{
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        });

        app.get('/task', async(req, res)=>{
            const query = {};
            const cursor = taskCollection.find(query);
            const result = await (cursor.toArray());
            res.send(result);

        });

        app.delete('/task/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await taskCollection.deleteOne(query);
            res.send(result);

        });

    }
    


    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('My Todo server is running')
});

app.listen(port, () => {
    console.log('Todo  server port is', port)
});