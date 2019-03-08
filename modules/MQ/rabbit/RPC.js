const amqp = require('amqplib/callback_api');
const Rabbit = require('./rabbit');
const logBee = require('../../base/log');

/*================================================================================
 * usage:
 *  - server
 *  - client
 */
function RPC(){
    this.map = new Map(); /** requests map
                           * <uuid, {request: Object,
                           *         response: Object,
                           *         timestemp: Date,
                           *         timeout: Int(ms)}>
                           * elapsed = Date.now() - timestemp
                           */
    // this.Timer = setInterval(); /clearInterval();
}

RPC.prototype = Object.create(Rabbit.prototype);
RPC.prototype.constructor = RPC;
RPC.prototype.uuid = 0;
RPC.prototype.rpc_queue = 'rpc_bee_queue';
RPC.prototype.generateUuid = function(){
    let uuid = RPC.prototype.uuid++;
    return uuid.toString();
};

/**
 * 启动RPC服务
 * type: 'request'|'response'
 * url: '<rabbitmq url>'
 */
RPC.prototype.run = function(
    callback = function(err){},
    isServer = true,
    server = function(msg){return msg;},
    url = 'amqp://localhost'){

    let rpc = this;
    this.connect(url, function(err){
        if(err){
            callback(err);
            return;
        }
        if(isServer){
            // response loop
            rpc.ch.assertQueue(RPC.prototype.rpc_queue, {durable: false});
            rpc.ch.prefetch(1);
            logBee.dbg(' [X] Awaiting RPC request');
            rpc.ch.consume(RPC.prototype.rpc_queue, function(msg){
                rpc.ch.sendToQueue(msg.properties.replyTo,
                                   Buffer.from(JSON.stringify(
                                       server(JSON.parse(msg.content).toString()))),
                                   {correlationId: msg.properties.correlationId});
                //rpc.ch.ack(msg);
            }, {noAck: true});
        }else{
            // request loop
            rpc.ch.assertQueue('', {exclusive: true}, function(err, q){
                if(err){
                    logBee.dumpError(err);
                    callback(err);
                    return;
                }
                logBee.dbg('assertQueue(reqlyTo) ok');
                rpc.replyTo = q.queue;
                rpc.ch.consume(q.queue, function(msg){
                    // callback requests
                    let value = rpc.map.get(msg.properties.correlationId);
                    if(value != undefined){
                        // callback replyCb
                        value.replyCb(null, value.request,
                                           JSON.parse(msg.content.toString()));
                        // delete value, and if map empty stop timer
                        rpc.map.delete(msg.properties.correlationId);
                        if(rpc.map.size === 0){
                            logBee.dbg('clearInterval(rpc.timer)');
                            clearInterval(rpc.timer);
                        }
                    }
                }, {noAck: true});
                callback(err);
            });
        }
    });
};
/**
 * RPC请求
 * msg = {
 *  request: Buffer
 *  response: Buffer
 * }
 *
 * 定时检查，请求队列，回调超时请求；
 */
RPC.prototype.req = function(req, repCb = function(err, req, msg){
    if(err){
        logBee.dumpError(err);
    }else{
        logBee.msg(`Got response ${logBee.objString(msg)}`);
    }
}, timeout = 3000){
    if(this.replyTo === undefined || this.replyTo === null){
        repCb(new Error('RPC not ready!'), null);
        return;
    }
    // Map requests
    let uuid = this.generateUuid();
    let rpc = this;
    this.map.set(uuid, {request: req,
                        replyCb: repCb,
                        timestemp: Date.now(),
                        timeout: timeout,
                        id: uuid});
    if(this.map.size === 1){
        // begin a timer for check requests timeout
        logBee.dbg('rpc.timer = setInterval()');
        rpc.timer = setInterval(function(){
            // check timeout
            try{
                rpc.map.forEach(function(value, key, map){
                    if(Date.now() - value.timestemp >= value.timeout){
                        value.replyCb(new Error('tiemout'),
                                      value.request,
                                      null);
                        // delete item, and if empty map just stop timer
                        rpc.map.delete(value.id);
                        if(rpc.map.size === 0){
                            logBee.dbg('clearInterval(rpc.timer)');
                            clearInterval(rpc.timer);
                        }
                    }else{
                        throw new Error('break');
                    }
                });
            }catch(e){
                // e.message == 'break';
            }
        },1000);
    }
    // Send requests
    this.ch.sendToQueue(RPC.prototype.rpc_queue,
                        Buffer.from(JSON.stringify(req)),
                        {correlationId: uuid,
                         replyTo: this.replyTo});
};

module.exports = RPC;