const pro = require('../../modules/base/promise');
const logBee = require('../../modules/base/log');
const proWait = pro.proWait;
/*
function demoWait(){
    proWait(1000).then(()=>{
        logBee.dbg('do after 1000+ ms');
        throw new Error('test error');
    }).catch(()=>{
        logBee.dbg('error');
    });
}
demoWait();
*/
/*
let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
        //resolve('foo');
        reject('bar');
        throw new Error('reject error');
    }, 500);
});
promise1.then(function(value){
    logBee.dbg(value);
}, function(value){
    logBee.dbg(`reject ${value}`);
}).catch(function(value){
    logBee.dbg(`catch ${value}`);
}).finally(function(v){
    logBee.dbg(`finally ${v}`);
});
setTimeout(function(){
    logBee.dbg(promise1);
}, 1000);
logBee.dbg(promise1);
*/
/*
let foo = function bar(){
    // bar()/foo()/arguments.callee() == 递归调用
};

function addSquares(a, b){
    function square(x){
        return x * x;
    }
    return square(a) + square(b);
}
logBee.dbg(addSquares(2,3));

function outside(x){
    function inside(y){
        return x + y;
    }
    return inside;
}

fn_inside = outside(3);
result = fn_inside(5);
result1 = outside(3)(5);
logBee.dbg(fn_inside, result, result1);

function myConcat(separator){
    let result = '';
    let i;
    for(i = 1; i < arguments.length; i++){
        result += arguments[i] + separator;
    }
    return result;
}
logBee.dbg(myConcat(',', 'red','orange','blue'));

function multiply(multiplier, ...theArgs) {
  return theArgs.map(x => multiplier * x);
}

var arr = multiply(2, 1, 2, 3);
logBee.dbg(arr); // [2, 4, 6]
*/

/* 捕获异常后继续执行
new Promise((resolve, reject) => {
    logBee.dbg('Initial');

    resolve();
})
.then(() => {
    throw new Error('Something failed');

    logBee.dbg('Do this');
})
.catch(() => {
    logBee.dbg('Do that');
})
.then(() => {
    logBee.dbg('Do this whatever happened before');
});
*/
/* 改进
 */
/*
function doSomething(){
    return 'doSomethingResult';
}
function doSomeThingElse(value){
    logBee.dbg(value);
    return 'doSomeThingElseResult';
}
function doThirdThing(value){
    logBee.dbg(value);
    return 'theFinalResult';
}
try{
    let result = doSomething();
    let newResult = doSomeThingElse(result);
    let fainalResult = doThirdThing(newResult);
    logBee.dbg(`Got the fianl result: ${finalResult}`);
}catch(error){
    logBee.dbg(error.message);
}
*/
/* async/await 语法糖
 */
/*
async function fooAsync(){
    try{
        let result = await doSomething();
        let newResult = await doSomeThingElse(result);
        let fainalResult = await doThirdThing(newResult);
        logBee.dbg(`Got the fianl result: ${finalResult}`);
    }catch(error){
        logBee.dbg(error.message);
    }
}
fooAsync();
*/
/* use promise

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
wait(1000).then(()=> logBee.dbg('1second')).catch(()=>{logBee.dbg('exception');});
*/
/*
function proFirst(value){
    return new Promise((resolve, reject)=>{
        proWait(1000).then(()=>{
            logBee.dbg(value);
            resolve(`${value} => first`);
        });
    });
}
function proSecond(value){
    return new Promise((resolve, reject)=>{
        proWait(2000).then(()=>{
            logBee.dbg(value);
            resolve(`${value} => second`);
        });
    });
}
function proThird(value){
    return new Promise((resolve, reject)=>{
        proWait(3000).then(()=>{
            logBee.dbg(value);
            resolve(`${value} => third`);
        });
    });
}

async function doSteps(){
    try{
        let first = await proFirst('begin');
        logBee.dbg(`first: ${first}`);
        let second = await proSecond(first);
        logBee.dbg(`second: ${second}`);
        let third = await proThird(second);
        logBee.dbg(`third: ${third}`);
    }catch(err){
        logBee.dbg(err.message);
    }
}
doSteps();
*/
/*
proFirst('begin')
    .then(value => proSecond(value))
    .then(value => proThird(value))
    .then(value => {
        proWait(3000).then(()=>{
            logBee.dbg(`result=> ${value}`);
        });
    })
    .catch(function(err){
        logBee.dbg(err);
    });
*/

/*
function proAsyncFunction(url){
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHTTPRequest();
        xhr.open("GET", url);
        xhr.onload = ()=>resolve(xhr.responseText);
        xhr.onerror = ()=> reject(xhr.statusText);
        xhr.send();
    });
}
proAsyncFunction('www.baido.com')
    .then(function(value){
        logBee.dbg('ok');
    })
    .catch(function(err){
        logBee.dbg('err');
    });
*/


/*
var resolveAfter2Seconds = function() {
  logBee.dbg("starting slow promise");
    return new Promise(resolve => {
        proWait(2000)
            .then(()=>{
                resolve(20);
                logBee.dbg("slow promise is done");
            });
  });
};

var resolveAfter1Second = function() {
  logBee.dbg("starting fast promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(10);
      logBee.dbg("fast promise is done");
    }, 1000);
  });
};

var sequentialStart = async function() {
  logBee.dbg('==SEQUENTIAL START==');

  // 如果 await 操作符后的表达式不是一个 Promise 对象, 则它会被转换成一个 resolved 状态的 Promise 对象
  const slow = await resolveAfter2Seconds();

  const fast = await resolveAfter1Second();
  logBee.dbg(slow);
  logBee.dbg(fast);
}

var concurrentStart = async function() {
  logBee.dbg('==CONCURRENT START with await==');
  const slow = resolveAfter2Seconds(); // 立即启动计时器
  const fast = resolveAfter1Second();

  logBee.dbg(await slow);
  logBee.dbg(await fast); // 等待 slow 完成, fast 也已经完成。
}

var stillSerial = function() {
  logBee.dbg('==CONCURRENT START with Promise.all==');
  Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(([slow, fast]) => {
    logBee.dbg(slow);
    logBee.dbg(fast);
  });
}

var parallel = function() {
  logBee.dbg('==PARALLEL with Promise.then==');

  // 这种情况下可以简写成 resolveAfter2Seconds().then(logBee.dbg);
  resolveAfter2Seconds().then((message)=>logBee.dbg(message)); 
  resolveAfter1Second().then((message)=>logBee.dbg(message));
}

sequentialStart(); // 两秒后，输出 “slow”，1秒之后，输出“fast”
// 等到 sequentialStart() 完成
setTimeout(concurrentStart, 4000); // 两秒之后，输出“slow”，然后输出“fast”
// 等到 setTimeout(concurrentStart, 4000) 完成
setTimeout(stillSerial, 7000); // 和concurrentStart一样
// 等到 setTimeout(stillSerial, 7000) 完成
setTimeout(parallel, 10000); // 真正的并行运行：一秒之后，输出“fast”，然后1秒之后，输出“slow”
*/
/*
function amqp_connect(url){
    return new Promise((resolve, reject)=>{
        if(true){
            logBee.dbg('connection ok');
            resolve({cnn: 'conn'});
        }else{
            logBee.dbg('connection err');
            reject({cnn: 'err'});
            //throw new Error('connection error');
        }
    });
}
function createChannel(cnn){
    return new Promise((resolve, reject)=>{
        if(true){
            logBee.dbg(`create channel ok ${JSON.stringify(cnn)}`);
            resolve({ch: 'ch'});
        }else{
            logBee.dbg(`create channek failed ${JSON.stringify(cnn)}`);
            reject({ch: 'errch'});
            //throw new Error('channel error');
        }
    });
}

function Rabbit(){}
Rabbit.prototype.connect = function(url){
    return amqp_connect(url)
        .then(conn => createChannel(conn))
        .then(ch => {
            this.ch = ch;
        })
        .catch(err => {
            logBee.err(`catched error!! ${JSON.stringify(err)}`);
            //logBee.dumpError(err);
            throw new Error('new error');
         });
};

async function main(){
    try{
        rabbit = new Rabbit();
        await rabbit.connect('amqp://localhost');
        logBee.dbg(logBee.objString(rabbit.ch));
    }catch(err){
        logBee.err('error accepted');
        logBee.dumpError(err);
    };
}

main();
*/