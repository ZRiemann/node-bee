const amqp = require('amqplib/callback_api');
const Rabbit = require('./rabbit');
const logBee = require('../../base/log');

function Fanout(){}

Fanout.prototype = Object.create(Rabbit.prototype);
Fanout.prototype.constructor = Fanout;
Fanout.prototype.run = function(exName, cb = function(err){},
                                    url = 'amqp://localhost'){
    let fanout = this;
    this.connect(url, function(err){
        if(err){
            cb(err);
            return;
        }
        fanout.ch.assertExchange(exName, 'fanout', {durable: false},
                                 function(err, ok){
                                     if(null == err){
                                         fanout.fanout = exName;
                                     }
                                     cb(err);
                                 });
    });
};
Fanout.prototype.publish = function(msg, cb = function(err){}){
    if(this.fanout == undefined){
        cb(new Error('exchange not ready.'));
        return;
    }
    //logBee.dbg(`publish ${msg}`);
    this.ch.publish(this.fanout, '', Buffer.from(JSON.stringify(msg)));
    cb(null);
};

Fanout.prototype.subscribe = function(cb = function(err, msg){}){
    if(this.fanout == undefined){
        cb(new Error('exchange not ready.'));
        return;
    }
    let fanout = this;
    this.ch.assertQueue('', {exclusive: true}, function(err, q){
        if(err){
            cb(err, null);
            return;
        }
        fanout.ch.bindQueue(q.queue, fanout.fanout, '');
        fanout.ch.consume(q.queue, function(msg){
            cb(null, JSON.parse(msg.content.toString()));
        }, {noAck:true});
    });
};

module.exports = Fanout;