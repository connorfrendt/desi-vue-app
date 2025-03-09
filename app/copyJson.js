const fs = require('fs');
const path = require('path');

const sourceFilePath = path.join(__dirname, 'public', 'json', '10075.json');
// const destinationFilePath = path.join(__dirname, 'public', 'json', '10075-copy.json');

fs.readFile(sourceFilePath, 'utf8', (err, data) => {
    
    for(let i = 0; i < 20; i++) {
        console.log(data[i], typeof data[i], data.charCodeAt(i));
    }
    // console.log(typeof JSON.parse(data));
    const cleanJsonData = (someJson) => {
        
        let output = "";
        for(let i = 0; i < someJson.length; i++) {
            if(someJson.charCodeAt(i) <= 127) {
                output += someJson.charAt(i);
            }
        }
        
        console.log('Output: ', typeof output);
        let parsedData = JSON.parse(output);
        console.log('Parsed Data: ', typeof parsedData);
        return parsedData;
    }
    // cleanJsonData(data);

    // cleanJsonData(data);

    // fs.writeFile(sourceFilePath, data, (err) => {
    //     if(err) {
    //         console.error('ERROR: ', err);
    //         return;
    //     }
        // try {
        //     console.log('herehere');
        //     let output = '';
        //     for(let i = 0; i < data.length; i++) {
        //         if(data.charCodeAt(i) <= 127) {
        //             console.log(data);
        //             // output += data.charAt(i);
        //         }
        //     }
            
        //     return output;
        // }
        // catch(parseError) {
        //     console.error('Error: ', parseError);
        // }
    // });
});