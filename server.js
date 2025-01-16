const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');
console.log('******************************');
app.get('/api/files', (req, res) => {
    console.log('HERE HERE');
    const directoryPath = path.join(__dirname, 'public/json/JSON-files/Bittel');
    fs.readdir(directoryPath, (err, files) => {
        if(err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        res.json(files);
    })
});

app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});