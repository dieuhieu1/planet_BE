const dotenv = require('dotenv').config();

const express = require('express');
const initRoutes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Routes
initRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
