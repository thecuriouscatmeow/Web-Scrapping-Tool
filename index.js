const express = require('express');
const app = express();
const getRoutes = require('./routes/getRoutes');

const PORT = 3001;

//middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false}));

app.use('/api/v1', getRoutes);


// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});