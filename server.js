import express from 'express';
import config from './config';
import fs from 'fs';
import apiRouter from './api';
import {MongoClient} from 'mongodb';
import assert from 'assert';

MongoClient.connect()

var csvParser = require('csv-parse');
const csv=require('csvtojson')

var buf = new Buffer(10024);

const server = express();
server.set('view engine', 'ejs');

// server.get('/', (req, res) => {
//   res.render('index', {
//     content: '<em>Hello</em> again!!!'
//   });
// });

fs.readFile('Australian_Post_Codes_Lat_Lon.csv', {
            encoding: 'utf-8'
        }, function(err, csvData) {
            if (err) {
                console.log(err);
            }

            csvParser(csvData, {
                delimiter: ','
            }, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);

                    csv()
                      .fromFile('Australian_Post_Codes_Lat_Lon.csv')
                      .on('json',(jsonObj)=>{
                          // combine csv header row and csv line to a json object
                          // jsonObj.a ==> 1 or 4
                      })
                      .on('done',(error)=>{
                          console.log('end')
                      })



                    MongoClient.connect(config.mongodbUri, (err, db) => {
                      assert.equal(null, err);

                      db.collection('contests').insertMany(data).then(response => {
                        console.info('Contests', response.insertedCount);
                      });
                    });
                }
            });
        });


//
// console.log("Going to open file!");
// fs.open('Australian_Post_Codes_Lat_Lon.csv', 'r+', function(err, fd) {
//    if (err) {
//       return console.error(err);
//    }
//   console.log("File opened successfully!");
//   console.log("Going to read the file");
//    fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
//       if (err){
//          console.log(err);
//       }
//       console.log(bytes + " bytes read");
//
//       // Print only read bytes to avoid junk.
//       if(bytes > 0){
//          console.log(buf.slice(0, bytes).toString());
//       }
//    });
// });


server.use('/api', apiRouter);
server.use(express.static('public'));


server.listen(config.port, () => {
  console.info(config.port);
});
