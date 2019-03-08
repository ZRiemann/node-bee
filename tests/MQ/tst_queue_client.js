const Rabbit = require('../../modules/MQ/rabbit/rabbit');
const logBee = require('../../modules/base/log');
let rabbit = new Rabbit();

rabbit.connect();

setTimeout(function(){
    rabbit.assertQueue('queue-test');
}, 500);

setTimeout(function(){
    let j = 0;
    for(let i = 0; i < 1000; i++){
        j = `msg[${i}]`;
        logBee.dbg(j);
        rabbit.sendToQueue(j);
    }
}, 600);

setTimeout(function(){
    rabbit.close();
}, 30000);
