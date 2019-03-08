const errBee = require('../../modules/base/error');
const logBee = require('../../modules/base/log');
let map = new Map();
map.set(0, {name: 'bob', age:32});
map.set(1, {name: 'bob1', age:32});
logBee.dbg(logBee.objString(map));
/*
function throwError(){
    logBee.dbg('throwError 1111');
    throw new errBee.MyError('Whoops!');
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
    logBee.dumpError('111');
    logBee.dumpError(null);
    logBee.dumpError(e);
}finally{
    logBee.msg('fanally workers...');
}
*/
/*
let obj = {
    name: {
        first: 'bob',
        last: 'smith'
    },
    age: 30,
    intr: [
        {haha: {
            hq: 'aaa',
            jj: {
                kk: 'kk'
            }
        },
         bb: 32,
         aa: ['aaa', 'bbb', 'ccc']},
        {
            bb: 'nobbb',
            aa: ['xxx', 123, 'yyy']
        }
    ],
    end: 'bye'
};
logBee.dbg('\n' + logBee.objString(obj));
*/
/*
try{
    setTimeout(throwAgain, 1000); // can not cache in callback;
}catch(e){
    dumpError(e);
}finally{
    logBee.msg('fanally workers...');
}
*/