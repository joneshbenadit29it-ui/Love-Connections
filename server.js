const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const componentRoutes = require('./routes/componentRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/components', componentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Love Connections Server running on port ${PORT}`);
});