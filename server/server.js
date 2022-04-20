const express = require('express');
const app = express();
const elasticsearch = require('elasticsearch');
const cors = require('cors');
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 5000 );
app.use(cors());
app.use(bodyParser.json());

const client = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
 });

client.ping({ requestTimeout: 30000 }, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

app.get('/search', function (req, res){
    // let body = {
    //   size: 100,
    //   from: 0,
    //   query: {
    //     match: {
    //         symptoms: {
    //             query: req.query['q'],
    //             analyzer: "search_grams"
    //         }
    //     }
    // }   
    // let symptoms = req.query['q'].split(',')
    // let symptomsArray = []
    // for (symptom of symptoms) {
    //     if(symptom.split(' ').length == 1) {
    //         symptomsArray.push({
    //             match: {
    //                 symptoms: {
    //                     query: symptom,
    //                     analyzer: "search_grams",
    //                     fuzziness: "1"
    //                 }
    //             }
    //         })
    //     } else {
    //         symptomsArray.push({
    //             match_phrase: {
    //                 symptoms: {
    //                     query: symptom,
    //                     analyzer: "search_grams",
    //                 }
    //             }
    //         })
    //     }
    // }
    // let body = {
    //     size: 100,
    //     from: 0,
    //     query: {
    //         bool: {
    //             should: symptomsArray
    //         }
    //      }
    // }
    let body = {
        size: 100,
        from: 0,
        query: {
            bool: {
                must: [],
                should: []
            }
        }
    }
    let queryObj = JSON.parse(req.query['q'])
    if(queryObj['title'].length > 0) {
        mp = {match_phrase: {title: queryObj['title']}}
        body.query.bool.must.push(mp)
    }
    if(queryObj['director'].length > 0) {
        mp = {'match_phrase': {'crew.name': queryObj['director']}}
        body.query.bool.must.push(mp)
    }
    if(queryObj['genres'].length > 0) {
        genres = queryObj['genres'].join(' ')
        mp1 = {'match_phrase': {'genres.name': genres}}
        mp2 = {'match_phrase': {'keywords.name': genres}}
        // mp3 = {'match_phrase': {'overview': genres}}
        // mp4 = {'match_phrase': {'belongs_to_collection.name': genres}}
        // mp5 = {'match_phrase': {'tagline': genres}}
        body.query.bool.should.push(mp1)
        body.query.bool.should.push(mp2)
        // body.query.bool.should.push(mp3)
        // body.query.bool.should.push(mp4)
        // body.query.bool.should.push(mp5)
    }
    if(queryObj['casts'].length > 0) {
        mm = {'match_phrase': {'cast.name': queryObj['casts'].join(' ')}}
        body.query.bool.should.push(mm)
    }
   
    client.search({index:'movies-icare-default', body:body})
    .then(results => {
            res.send(results.hits);
        
    })
    .catch(err=>{
        console.log(err)
        res.send([]);
    });

})

app.listen(app.get('port'), function() {
    console.log('Your node.js server is running on PORT: ',app.get('port'));
});