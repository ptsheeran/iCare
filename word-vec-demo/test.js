require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const fs = require('fs');
const path = require("path");


// Load the model sample.
// use.load().then(model => {
//     // Embed an array of sentences.
//     const sentences = [
//       'Hello.',
//       'How are you?'
//     ];
//     model.embed(sentences).then(embeddings => {
//       // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
//       // So in this example `embeddings` has the shape [2, 512].
//       embeddings.print(true /* verbose */);
//     });
//   });

// Here are something I would like to do
const articlesRaw = fs.readFileSync(path.resolve(__dirname, 'data.json'))
const articles = JSON.parse(articlesRaw);

use.load().then(model => {
    
    vectorData = []

    articles.forEach(article => {
        
        // Embed an array of sentences.
        const sentences = [
            article['illness'],
            article['symptoms']
        ]

        model.embed(sentences).then(embeddings => {
            // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
            // So in this example `embeddings` has the shape [2, 512].
            // embeddings.print(true /* verbose */);

            item = {
                'illness': embeddings[0],
                'symptoms': embeddings[1],
                'url': article['url'],
                'img': article['img']
            } 

            vectorData.push(item)
          });
        
    });

    return vectorData
  });

console.log(data)