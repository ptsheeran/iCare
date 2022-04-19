const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200']
});

client.indices.delete({
    index: 'movies-icare-default'
  }, function(error, response, status) {
    if (error) {
        console.log(error);
    } else {
        console.log("deleted index", response);
    }
  });
  