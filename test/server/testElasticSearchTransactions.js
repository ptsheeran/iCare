const axios = require('axios')
const fs = require('fs')
const path = require('path')

async function testBadInputs(){
    const inputsRaw = await fs.readFileSync(path.resolve(__dirname,'data/blns.json'))
    const inputs = JSON.parse(inputsRaw);
    let numFailed = 0
    for(let input of inputs) {
        let query = String(input)
        query = encodeURI(query);
        await axios.get('http://localhost:5000/search?q='+query)
              .then(response => {
                if(response.request.error) {
                    numFailed++
                    console.log('error for tests case ' + input)
                    console.log(response.request.error)
                } 
          })
    }
    console.log('successfully passed ' + (inputs.length - numFailed) + ' tests out of ' + inputs.length)
}

testBadInputs()