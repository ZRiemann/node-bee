const amqp = require('amqplib/callback_api');
const Rabbit = require('./rabbit');
const logBee = require('../../base/log');

function Direct(){}

Direct.prototype = Object.create(Rabbit.prototype);
Direct.prototype.constructor = Direct;
Direct.prototype.run = function(exName, cb = function(err){},
                                    url = 'amqp://localhost'){
    let direct = this;
    this.connect(url, function(err){
        if(err){
            cb(err);
            return;
        }
        direct.ch.assertExchange(exName, 'direct', {durable: false},
                                 function(err, ok){
                                     if(null == err){
                                         direct.direct = exName;
                                     }
                                     cb(err);
                                 });
    });
};
Direct.prototype.publish = function(title, msg){
    this.ch.publish(this.direct, title, Buffer.from(JSON.stringify(msg)));
};
Direct.prototype.subscribe = function(titles, cb = function(err, msg){}){
    if(this.direct == undefined){
        cb(new Error('exchange not ready.'));
        return;
    }
    let direct = this;
    this.ch.assertQueue('', {exclusive: true}, function(err, q){
        if(err){
            cb(err, null);
            return;
        }
        titles.forEach(function(title, index, array){
            direct.ch.bindQueue(q.queue, direct.direct, title);
        });
        direct.ch.consume(q.queue, function(msg){
            cb(null, JSON.parse(msg.content.toString()));
        }, {noAck:true});
    });
};

module.exports = Direct;