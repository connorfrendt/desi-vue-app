const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');

console.log('******************************');
app.get('/api/files', (req, res) => {
    const subdirectory = req.query.subdirectory || '';
    console.log('\n******SUB DIRECT 0******: \n', req.query);
    console.log('\n******SUB DIRECT 1******: \n', subdirectory);
    const directoryPath = path.join(__dirname, 'public/json/new-json-files/', subdirectory);
    console.log('\n******DIRECTORY PATH 1******: \n', directoryPath);
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
    console.log('\n******SUB DIRECT 2******: \n', req.params);
    console.log('\n******SUB DIRECT 2******: \n', subdirectory);
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public/json/new-json-files/', subdirectory, filename);
    console.log('\n******DIRECTORY PATH 2******: \n', filePath);
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