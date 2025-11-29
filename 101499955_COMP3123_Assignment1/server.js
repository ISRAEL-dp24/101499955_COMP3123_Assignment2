const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/comp3123_assignment1';

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
