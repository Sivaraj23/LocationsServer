var express = require('express');
const bodyParser = require('body-parser');
const csvParser = require('fast-csv');
const multer = require('multer');
const fs = require('fs');
const Location = require('../models/Location');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/csv');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const csvFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(csv)$/)) {
        return cb(new Error('You can upload only csv files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: csvFileFilter });


var postCSVRouter = express.Router();


postCSVRouter.use(bodyParser.json());

postCSVRouter.route('/')
    .get((req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /csvUpload');
    })
    .post(upload.single('csvFile'), (req, res) => {
        const locations = [];
        csvParser.parseFile(req.file.path)
            .on("data", function (data) {
                locations.push(data); // push each row
            })
            .on("end", function () {
                var obj;
                locations.forEach((data) => {// not duplicate, create
                    obj = new Location({ location: data[0], latitude: data[1], longitude: data[2] }).save().then((data) => {
                        console.log('Saved data successfully')
                    }, (error) => { //if duplicate , update
                        obj = new Location({ location: data[0], latitude: data[1], longitude: data[2] });
                        Location.findOneAndUpdate({ location: obj.location }, { latitude: obj.latitude, longitude: obj.longitude }).then(() => {
                            console.log('Updated latitude and longitude for ' + obj.location);
                        });
                    });
                });
                fs.unlinkSync(req.file.path);
            })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json("Data added to DB");
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /csvUpload');
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /csvUpload');
    });

module.exports = postCSVRouter;