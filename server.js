const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');

console.log('******************************');
app.get('/api/files', (req, res) => {
    console.log('APP GET');
    console.log('sub dir?', req.query);
    const directoryPath = path.join(__dirname, 'public/json/JSON-files/');
    
    fs.readdir(directoryPath, (err, files) => {
        if(err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        // console.log('\n\nDirectory Read\n\n', files, '\n\n');
        res.json(files);
        return files;
    });
});

app.get('/api/files/:subdirectory/:filename', (req, res) => {
    console.log('***********REQ*********\n', req.params.filename);
    const filePath = path.join(__dirname, 'public/json/JSON-files/', req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        console.log('***********DATA*********\n', data);
        if (err) {
            return res.status(500).send('Unable to read file: ' + err);
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});