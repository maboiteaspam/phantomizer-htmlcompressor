// see also https://github.com/joeferner/node-java for better java finding

'use strict'

var fs = require('fs')
var cp = require('child_process')

cp.exec('java -version',
  function (error, stdout, stderr) {

    var pkg = fs.readFileSync(__dirname+'/package.json', 'utf8');
    pkg = JSON.parse(pkg)

    var ver = stderr.match(/java version "([^"]+)"/);
    if( ver ){
      console.log('OK, Java '+ver[0]+' found on command line.')
      process.exit(0)
    }else{
      console.log('Ko ... Mhhh seems like Java can not be found on your path');
      console.log("\tplease ensure it is installed on your system")
      console.log("\talso  check the content of your PATH variable.")
      console.log("")
      console.log("If you think it is an error, please post your output at ")
      console.log("\t"+pkg.bugs.url)
      console.log("Output:")
      console.log(stderr)
      console.log("")
      throw new Error('Wrong version')
    }
  });
