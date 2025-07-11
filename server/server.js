const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');
const cors = require('cors');

console.log('******************************');

app.use(cors());

app.get('/api/files', (req, res) => {
    const subdirectory = req.query.subdirectory || '';
    const directoryPath = path.join(__dirname, '../app/public/json/new-json-files/', subdirectory);
    fs.readdir(directoryPath, (err, files) => {
        if(err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        res.json(files);
        return files;
    });
});

app.get('/api/files/:subdirectory/:filename', (req, res) => {
    const subdirectory = req.params.subdirectory;
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../app/public/json/new-json-files/', subdirectory, filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Unable to read file: ', err);
            return res.status(500).send('Unable to read file: ' + err);
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});