import '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as fs from 'fs';
import * as path from 'path';
import { clear } from 'console';
// const fs = require('fs');
// const path = require("path");


//Load the model sample.
// use.load().then(model => {
//     // Embed an array of sentences.
//     const sentences = [
//       'Hello.',
//       'How are you?'
//     ];
//     model.embed(sentences).then(embeddings => {
//       // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
//       // So in this example `embeddings` has the shape [2, 512].
//       // embeddings.print(true /* verbose */);
//       // console.log(embeddings.arraySync());
//     });
//   });


// // Here are something I would like to do
const articlesRaw = fs.readFileSync('data.json')
const articles = JSON.parse(articlesRaw);

async function f(model, article){

    // Embed an array of sentences.
    const sentences = [
        article['illness'],
        article['symptoms']
    ]

    const data = model.embed(sentences).then(embeddings => {
        // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
        // So in this example `embeddings` has the shape [2, 512].
        // embeddings.print(true /* verbose */);

        let vectors = embeddings.arraySync()

        item = {
            'illness': vectors[0],
            'symptoms': vectors[1],
            'url': article['url'],
            'img': article['img']
        } 

        console.log(item)
        
        return item;
    });

    return data

}

async function loadModel() {

    let vectorData = []
    
    await use.load().then(model => {
    
        articles.forEach(article => {
            
            let data = f(model, article);
            console.log(data);
            vectorData.push(data)
            
        })
    });

    return vectorData;

}

// await use.load().then(model => {
    

//     articles.forEach(article => {
        
//         // Embed an array of sentences.
//         const sentences = [
//             article['illness'],
//             article['symptoms']
//         ]

//         model.embed(sentences).then(embeddings => {
//             // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
//             // So in this example `embeddings` has the shape [2, 512].
//             // embeddings.print(true /* verbose */);

//             let vectors = embeddings.arraySync()

//             item = {
//                 'illness': vectors[0],
//                 'symptoms': vectors[1],
//                 'url': article['url'],
//                 'img': article['img']
//             } 

//             console.log(item)
//             vectorData.push(item)
        
//           });
        
//     })


// })

let d = await loadModel();
console.log(d)