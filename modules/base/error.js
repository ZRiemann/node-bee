//'use strict';
//const logBee = require('./log');

/**
 * User define error template
 */

function MyError(message){
    this.name = 'MyError';
    this.message = message || 'Default error';
    this.stack = (new Error()).stack;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;
MyError.prototype.static_val = 100;
module.exports.MyError = MyError;
/*
module.exports.dumpError = function(e){
    if(e && e instanceof Error){
        logBee.err(e.toString());
        logBee.err(e.stack);
    }else{
        logBee.err(`module.exprots.dumpError(${e}) parameter invalid`);
    }
};
*/

/* Usage:

function throwError(){
    logBee.dbg('throwError 1111');
    throw new MyError('Whoops!');
    logBee.dbg('throwError 22222');
}

function throwAgain(){
    logBee.dbg('throwAgain 11111');
    throwError();
    logBee.dbg('throwAgain 22222');
}
//throwAgain();

try{
    throwAgain();
}catch(e){
    dumpError(e);
}finally{
    logBee.msg('fanally workers...');
}

try{
    setTimeout(throwAgain, 1000); // can not cache in callback;
}catch(e){
    dumpError(e);
}finally{
    logBee.msg('fanally workers...');
}
*/
/* Outputs:

[DBG] throwAgain 11111
[DBG] throwError 1111
[ERR] MyError: Whoops!
[ERR] Error
    at new MyError (/mnt/ext/git/node-bee/modules/base/error.js:10:19)
    at throwError (/mnt/ext/git/node-bee/modules/base/error.js:26:11)
    at throwAgain (/mnt/ext/git/node-bee/modules/base/error.js:32:5)
    at Object.<anonymous> (/mnt/ext/git/node-bee/modules/base/error.js:38:5)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
[MSG] fanally workers...
 */