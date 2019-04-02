const Rabbit = require('../../modules/MQ/rabbit/rabbit');
const logBee = require('../../modules/base/log');
let rabbit = new Rabbit();

rabbit.connect();

setTimeout(function(){
    rabbit.assertQueue('queue-test');
}, 500);

setTimeout(function(){
    rabbit.consume(function(msg){
        logBee.dbg(msg);
    }, {noAck: true,
        consumerTag: "consumerTag.queue-test.1"});
}, 600);

setTimeout(function(){
    rabbit.close();
}, 300000);
