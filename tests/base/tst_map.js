let logBee = require('../../modules/base/log');
let map = new Map();

map.set(0, {name: 'bob', age: 32});
map.set(1, {name: 'bob1', age: 32});
map.set(2, {name: 'bob2', age: 32});
map.set(3, {name: 'bob3', age: 32});

try{
map.forEach(function(value, key, map){
    console.log(key);
    if(key == 2){
        map.delete(key);
        throw new Error('test');
    }
});
}catch(e){
    console.log(e.message);
    logBee.dbg(logBee.objString(map));
}