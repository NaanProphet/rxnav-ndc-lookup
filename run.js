// start the timer
console.time("Processing time");

const fs = require('fs');
const path = require('path');
const request = require('sync-request');
const sprintf = require('sprintf-js').sprintf;

const RXNAV_BASEURL = 'https://rxnav.nlm.nih.gov';
const GET_NDC_STATUS_ENDPOINT = '/REST/ndcstatus.json';

// single column, each NDC on a new line
const INPUT_FILE = path.join(__dirname, 'input.csv');
const OUTPUT_HEADERS = 'NDC,CUI,Status,Concept Status,Concept Name';
const OUTPUT_FILE = path.join(__dirname, 'output.csv');
// overwrite the output file each run
fs.writeFileSync(OUTPUT_FILE, OUTPUT_HEADERS);
const logger = fs.createWriteStream(OUTPUT_FILE, {
    flags: 'a' // for append
})

var lineCount = 0;
var zeroPadFixes = 0;

const LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(INPUT_FILE);

lr.on('error', function (err) {
    logger.write(err);
});

lr.on('line', function (line) {
    lineCount = lineCount + 1;
    // 'line' contains the current line without the trailing newline character.
    // zero pad NDCs so that they are all 11 characters
    var ndcToLookup;
    if (line.length === 11) {
        ndcToLookup = line;
    } else {
        zeroPadFixes = zeroPadFixes + 1;
        ndcToLookup = sprintf('%011d', line);
    }

    console.warn('Lookup up NDC: ' + ndcToLookup);
    const response = request('GET', RXNAV_BASEURL + GET_NDC_STATUS_ENDPOINT + '?' + 'ndc=' + ndcToLookup);
    const resData = JSON.parse(response.getBody()).ndcStatus;
    const outputLine = `${resData.ndc11},${resData.rxcui},${resData.status},${resData.conceptStatus},${resData.conceptName}`;
    logger.write('\n' + outputLine);
});

lr.on('end', function () {
    // All lines are read, file is closed now.
    console.log(`Processed ${lineCount} lines and fixed ${zeroPadFixes} zero paddings`);
    console.timeEnd("Processing time");
    console.log('K thanks bye');
});
