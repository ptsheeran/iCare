const elasticsearch = require('elasticsearch');
const fs = require('fs');
const path = require("path");

const client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200']
});

ESsetting = {
  "settings": {
    "analysis": {
      "filter": {
        "index_filter": { 
          "type": "common_grams",
          "common_words": "_english_" 
        },
        "search_filter": { 
          "type": "common_grams",
          "common_words": "_english_", 
          "query_mode":   true
        },
        "stop_words_filter": {
          "type": "stop",
          "common_words": "_english_",
          "ignore_case": true
        }
      },
      "analyzer": {
        "index_grams": { 
          "tokenizer":  "standard",
          "filter":   [ "lowercase", "index_filter", "stop_words_filter"]
        },
        "search_grams": { 
          "tokenizer": "standard",
          "filter":  [ "lowercase", "stop_words_filter"]
        }
      }
    }
  }
}

client.indices.create({
    index: 'symptoms-icare-default',
    body: ESsetting
}, function(error, response, status) {
    if (error) {
        console.log(error);
    } else {
        console.log("created a new index", response);
    }
});

const bulkIndex = function bulkIndex(index, data) {
    let bulkBody = [];
  
    data.forEach(item => {
      bulkBody.push({
        index: {
          _index: index
        }
      });
      bulkBody.push(item);
    });
  
client.bulk({body: bulkBody})
    .then(response => {
      let errorCount = 0;
      response.items.forEach(item => {
        if (item.index && item.index.error) {
          console.log(++errorCount, item.index.error);
        }
      });
      console.log(
        `Successfully indexed ${data.length - errorCount}
         out of ${data.length} items`
      );
    })
    .catch(console.err);
  };

async function indexData() {
    const articlesRaw = await fs.readFileSync(path.resolve(__dirname, 'data.json'))
    const articles = JSON.parse(articlesRaw);
    console.log(`${articles.length} items parsed from data file`);
    bulkIndex('symptoms-icare-default', articles);
  }

  indexData();