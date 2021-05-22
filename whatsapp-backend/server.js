//import package
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Rooms from "./dbRooms.js";
import Pusher from "pusher";
import cors from "cors";
//app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
  appId: "1204233",
  key: "5be31c0d421971904201",
  secret: "89b8e04cc173074e854f",
  cluster: "ap2",
  useTLS: true,
});

//middleware
app.use(express.json());

//secure messges
app.use(cors());






//DB config
const connection_url =
  "mongodb+srv://admin:ZaS5gjHs5rFa62yn@cluster0.y1otv.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB is connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  const rooms = db.collection('rooms');
  const roomsStream = rooms.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        recieved: messageDetails.recieved,
      });
    } else {
      console.log("error in pusher");
    }
  });


  roomsStream.on('change', change => {
    if (change.operationType === 'insert') {
        const roomDetails = change.fullDocument;
        pusher.trigger('rooms', 'inserted', {
            _id: roomDetails._id,
            name: roomDetails.name,
            image: roomDetails.image
        });
    } else if (change.operationType === 'delete') {
        pusher.trigger('rooms', 'deleted', {
            _id: change.documentKey._id
        })
    } else {
        console.log('Error triggered Pusher');
    }
})
});






// api routes for rooms
app.get("/rooms", (req, res) => {
  Rooms.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});


app.get("/room", async (req, res) => {
  const { _id } = req.query;
  try {
    const rooms = await Rooms.findOne({ _id });

    return res.status(200).json({ rooms });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/room/new", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.json({ error: "Choose a name for the Room" });

  try {
    await Rooms.create(req.body);
    const rooms = await Rooms.find();
    return res.status(200).json({ rooms });
  } catch (err) {
    return res.status(500).json({ error: "Error on server" });
  }
});

app.delete("/room", async (req, res) => {
  const { _id, username } = req.query;

  try {
    const room = await Rooms.findOne({ _id });
    if (username !== room.createdBy) {
      return res.json({ error: "Only the creator that room can delete it" });
    }

    await Messages.deleteMany({ room_id: _id });
    await Rooms.findByIdAndDelete(_id);
    return res.status(200).send("deleted");
  } catch (err) {
    return res.status(500).json({ error: "Error on server" });
  }
});


//api route for messages
app.get("/", (req, res) => res.status(200).send("Ok"));

app.post("/message/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(`new mwssage created: \n  ${data}`);
    }
  });
});

app.get("/messages/sync", async (req, res) => {
  const { room_id } = req.query;

  if (!room_id) {
    return res.status(400).json({ error: "Undefined room" });
  }
  try {
    const messages = await Messages.find({ room_id });

    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});








//listen
app.listen(port, () => console.log(`Listling on localhost:${port}`));
