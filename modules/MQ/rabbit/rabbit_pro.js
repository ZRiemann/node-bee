/**
 * MIT License
 * https://github.com/zriemann/node-bee
 */
const amqp = require('amqplib');
const logBee = require('../../base/log');

function Rabbit(){}

Rabbit.prototype.connect = function(url = 'amqp://localhost'){
    let self = this;
    return amqp.connect(url)
        .then(conn => {
            self.conn = conn;
            logBee.dbg(`connect ${url} ok`);
            return conn.createChannel();})
        .then(ch => {
            logBee.dbg(`create Channel ok!`);
            self.ch = ch;
        }).catch(err => {
            logBee.dumpError(err);
            throw err;
        });
};

Rabbit.prototype.close = function(){
    let self = this;
    return new Promise((resolve, reject)=>{
        if(self.ch !== undefined && self.conn !== undefined){
            logBee.dbg('closing both');
            self.ch.close()
                .then(()=>{
                    logBee.dbg('closed channel');
                    self.conn.close().then(()=>{
                        logBee.dbg('closed connection');
                        resolve(null);
                    }).catch(err=>{
                        reject(err);
                    });
                }).catch(err =>{
                    logBee.dumpError(err);
                    reject(err);
                });
        }else{
            self.conn.close().then(()=>{
                logBee.dbg('closed connection');
                resolve(null);
            }).catch(err=>{
                reject(err);
            });
        }
    });
};

Rabbit.prototype.assertQueue = function(queue){
    let self = this;
    return this.ch.assertQueue(queue)
        .then(q => {
            logBee.dbg(`assertQueue[${q.queue}] ok`);
            self.queue = q.queue;
        }).catch(err => {
            logBee.dbg(err);
            throw err;
        });
};
Rabbit.prototype.consume = function(callback, options = {noAck: true}){
    let self = this;
    return self.ch.consume(self.queue,
                           msg => callback(JSON.parse(msg.content.toString())),
                           options)
        .then(ok => {
            logBee.dbg(`consume ${self.queue} OK`);
        }).catch(err => {
            logBee.dumpError(err);
            throw err;
        });
};
Rabbit.prototype.sendToQueue = function(msg){
    return this.ch.sendToQueue(this.queue, Buffer.from(JSON.stringify(msg)));
};
module.exports = Rabbit;