/**
 * topic exchange
 * '*' (star) can substitute for exactly one word.
 * '#' (hash) can substitute for zero or more words.
 */
const amqp = require('amqplib/callback_api');
const Rabbit = require('./rabbit');
const logBee = require('../../base/log');

function Topic(){}

Topic.prototype = Object.create(Rabbit.prototype);
Topic.prototype.constructor = Topic;
Topic.prototype.run = function(exName, cb = function(err){},
                                    url = 'amqp://localhost'){
    let topic = this;
    this.connect(url, function(err){
        if(err){
            cb(err);
            return;
        }
        topic.ch.assertExchange(exName, 'topic', {durable: false},
                                 function(err, ok){
                                     if(null == err){
                                         topic.topic = exName;
                                     }
                                     cb(err);
                                 });
    });
};
Topic.prototype.publish = function(title, msg){
    this.ch.publish(this.topic, title, Buffer.from(JSON.stringify(msg)));
};
Topic.prototype.subscribe = function(titles, cb = function(err, msg){}){
    if(this.topic == undefined){
        cb(new Error('exchange not ready.'));
        return;
    }
    let topic = this;
    this.ch.assertQueue('', {exclusive: true}, function(err, q){
        if(err){
            cb(err, null);
            return;
        }
        titles.forEach(function(title, index, array){
            topic.ch.bindQueue(q.queue, topic.topic, title);
        });
        topic.ch.consume(q.queue, function(msg){
            cb(null, JSON.parse(msg.content.toString()));
        }, {noAck:true});
    });
};

module.exports = Topic;