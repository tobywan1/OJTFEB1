// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); 
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/TollGateData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB schemas and models
const tollGateDataSchema = new mongoose.Schema({
  expressway: String,
  entry: String,
  exit: String,
  vehicle: String,
  vehicleClass: String,
  price: String,
});

const TollGateData = mongoose.model('TollGateData', tollGateDataSchema);

// API routes
app.post('/addTollGateData', async (req, res) => {
  try {
    const newData = req.body;
    const tollGateData = new TollGateData(newData);
    await tollGateData.save();
    res.json({ success: true, message: 'Data added successfully', data: tollGateData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.get('/getAllTollGateData', async (req, res) => {
  try {
    const data = await TollGateData.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/updateTollGateData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedData } = req.body;

    const result = await TollGateData.findByIdAndUpdate(id, updatedData, { new: true });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Data not found for update' });
    }

    res.json({ success: true, message: 'Data updated successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.delete('/deleteTollGateData/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await TollGateData.findByIdAndDelete(id);

    res.json({ success: true, message: 'Data deleted successfully', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('/getAllTollGateData', async (req, res) => {
  try {
    const data = await TollGateData.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/getTollGateData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await TollGateData.findById(id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Modify the route that fetches all toll gate data
app.get('/getUserTollGateData', async (req, res) => {
  try {
    // Assume user ID is available in req.user.id after authentication
    const userId = req.user.id; // Replace this with the actual way you get the user ID

    const userTollGateData = await TollGateData.find({ userId });
    res.json(userTollGateData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Modify the route for adding data
app.post('/addUserTollGateData', async (req, res) => {
  try {
    const newData = req.body;
    newData.userId = req.user.id; // Associate the data with the logged-in user

    const tollGateData = new TollGateData(newData);
    await tollGateData.save();
    res.json({ success: true, message: 'Data added successfully', data: tollGateData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


const server = http.createServer({ maxHttpHeaderSize: 16384 }, app);
// Add other CRUD routes (update, delete) as needed

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

