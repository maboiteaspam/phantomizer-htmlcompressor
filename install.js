//

/*
see also https://github.com/joeferner/node-java for better java finding
 */

'use strict'

var cp = require('child_process')

cp.exec('java -version',
function (error, stdout, stderr) {

    if( stderr.match(/java version "[^"]+"/) ){
        console.log('OK, Java found on command line.')
        process.exit(0)
    }else{
        console.log('Mhhh it is Ko ... Java can not be found on your path, please ensure it is installed on your system and PATH..')
        throw new Error('Wrong version')
    }
});
