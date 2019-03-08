const fs = require('fs');
const logBee = require('../../modules/base/log');
const async = require('async');
async function test(){
    let a,b;
    try{
        a = await setTimeout(function(){console.log('1-> seleep 2000'); return 1;}, 2000);
        b = await setTimeout(function(){console.log('2-> seleep 1000'); return 2;}, 1000);
        await console.log('after await');
    }catch(e){
        console.error(e.message);
    }
    console.log(`after all [${a}, ${b}]`);
}
//test();
/*
async.map(['base', 'package.json', 'MQ'], fs.stat, function(err, results){
    if(err){
        logBee.dumpError(err);
    }
    logBee.dbg(logBee.objString(results));
});
*/
/*
async.reduce([1,2,3], 0, function(memo, item, callback) {
    // pointless async:
    //process.nextTick(function() {
        logBee.dbg(`memo: ${memo}, item: ${item}`);
        callback(null, memo + item);
    //});
}, function(err, result) {
    // result is now equal to the last value of memo, which is 6
    logBee.dbg(`redude: ${result}`);
});
*/

/**
 * test callback parameters
 */
async.series([
    function(callback) {
        // do some stuff ...
        console.log('one');
        callback(null);
    },
    function(callback) {
        // do some more stuff ...
        console.log('two');
        callback(null);
    },function(callback){
        console.log('three');
        for(let i = 0; i < 100; i++){
            console.log(i);
        }
        callback(null);
    }
], function(err, results){
    console.log(results);
});