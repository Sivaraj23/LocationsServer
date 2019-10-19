var express = require('express');
const bodyParser = require('body-parser');

var locationRouter = express.Router();

const Locations = require('../models/Location');

/* GET locations listing. */
locationRouter.route('/')
.get((req, res, next)=> {
    Locations.find().then((data)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    },err=>{
        res.send('Internal error');
    });
})
.post((req,res,next)=>{
    res.send('POST not supported at this endpoint (/locations)');
})
.put((req,res,next)=>{
    res.send('PUT not supported at this endpoint (/locations)');
})
.delete((req,res,next)=>{
    res.send('DELETE not supported at this endpoint (/locations)');
});

locationRouter.route('/:id')
.get((req, res, next)=> {
    
    Locations.find().then((data)=>{
       
        Locations.findById(req.params.id).then((current)=>{
            var distanceMap=[];
            data.forEach((location)=>{
                if(location._id!=req.params.id)
                distanceMap.push({distance : distance(current.latitude, current.longitude, location.latitude, location.longitude, "K"),location :location});
            });
            keysSorted = distanceMap.sort(function(x,y){
                var a=x.distance;
                var b=y.distance;
                return a>b?1:a>b?0:-1;
            })
            if(Number(req.query.limit)>keysSorted.length || Number(req.query.limit)==0){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            console.log(keysSorted)
            res.json(keysSorted);
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(keysSorted.splice(0,Number(req.query.limit)));
            }
        });
    },err=>{
        res.send('No such location with id '+req.params.id);
    });
})
.post((req,res,next)=>{
    res.send('POST not supported at this endpoint (/locations/'+req.params.id+')');
})
.put((req,res,next)=>{
     res.send('PUT not supported at this endpoint (/locations/'+req.params.id+')');
})
.delete((req,res,next)=>{
    res.send('DELETE not supported at this endpoint (/locations/'+req.params.id+')');
});




//https://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        
        if (unit=="K") { dist = dist * 1.609344; }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}



module.exports = locationRouter;
