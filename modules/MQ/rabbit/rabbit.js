'use strict';
const amqp = require('amqplib/callback_api');
const logBee = require('../../base/log');

function Rabbit(){
}

Rabbit.prototype.connect = function(url = 'amqp://localhost', cb = function(err){}){
    if(null == url){
        throw new Error('parameter url is null');
    }
    let that = this;
    that.url = url;
    amqp.connect(url, function(connerr, conn){
        if(connerr){
            logBee.dumpError(connerr);
            cb(connerr);
        }else{
            that.conn = conn;
            logBee.dbg(`connect to ${url} OK.`);
            conn.createChannel(function(cherr, ch){
                if(cherr){
                    logBee.dumpError(cberr);
                }else{
                    that.ch = ch;
                    logBee.dbg(`createChannel OK`);
                }
                cb(cherr);
            });
        }
    });
};
Rabbit.prototype.close = function(callback = function(err){}){
    if(this.conn != undefined){
        //logBee.dbg(logBee.objString(this.conn));
        this.conn.close(function(err){
            if(err){
                logBee.dumpError(err);
            }else{
                logBee.dbg('rabbitmq connection closed.');
            }
            callback(err);
        });
    }else{
        callback(new Error('rabbitmq not connected!'));
    }
};

Rabbit.prototype.assertQueue = function(queue, options = {durable: false},
                                        cb = function(err, ok){}){
    this.assertedQueue = queue;
    this.ch.assertQueue(queue, options, cb);
};
/* type: direct, topic, headers, fanout
 */
Rabbit.prototype.assertExchange = function(exName, type, options = {durable: false},
                                           cb = function(err, ok){
                                               logBee.dumpError(err);
                                           }){
    this.exchange = exName;
    this.ch.assertExchange(exName, type, options, cb);
}
Rabbit.prototype.consume = function(cb = function(msg){}, options = {noAck: true}){
    this.ch.prefetch(1);
    this.ch.consume(this.assertedQueue, function(msg){
        cb(JSON.parse(msg.content.toString()));
    }, options);
};
Rabbit.prototype.sendToQueue = function(msg, options = null){
    this.ch.sendToQueue(this.assertedQueue, Buffer.from(JSON.stringify(msg)), options);
};
module.exports = Rabbit;