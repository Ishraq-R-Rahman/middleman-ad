let path = require('path');
let execSync = require('child_process').execSync
const fs = require('fs')

let sitesArr = process.env.SITES
sites = sitesArr.split(',')


let file_path = path.join(__dirname, '../scraper/crawl.py')
// let variantName = 'Dove Beauty Bar'
let fileName;
file_path = '"' + file_path + '"'

const runScript = async (variantName) => {
    
    
    for (let i = 0; i < sites.length; i++) {
        variantName = variantName.split(" ").join("_");

        fileName = sites[i] + '-' + variantName + '.json'

        // console.log(`File: ${fileName}`);

        let command = 'python ' + file_path + " \"" + variantName + "\" \"" + fileName + "\""

        execSync(command, { stdio: 'inherit' }); //Basically ignores the stderr

    }
}



module.exports = {
    runScript
}
