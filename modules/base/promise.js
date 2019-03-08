exports.proWait = ms => new Promise(resolve => setTimeout(resolve, ms)/*, reject*/);
function demoWait(){
    proWait(1000).then(()=>{
        console.log('do after 1000+ ms');
        throw new Error('test error');
    }).catch(function(){
        console.log('error');
    });
}

//exports.makePromise = (fn, resolve, reject, ...args) => new Promise(fn(resolve, reject));
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
        console.log('ok');
    })
    .catch(function(err){
        console.log('err');
    });
*/