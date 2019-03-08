/**
 * MIT License
 * https://github.com/zriemann/node-bee
 */
//'use strict';

const mongoose = require('mongoose');

function MongoBee(url,
                  options = {useNewUrlParser: true,
                             keepAlive: true,
                             keepAliveInitialDelay: 300000}){
    this.url = url;
    this.options = options;
}

MongoBee.prototype.connect = function(){
    mongoose.connect(this.url, this.options);
    const db = mongoose.connection;
    this.conn = db;
    db.on('error', console.error.bind(console, `MongoDB Connect ${this.url} Failed!`));
    db.on('open', function(){
        console.log(this.url + 'ok');
        console.log(`connect to ${this.url} ok.`);
    });
    db.on('disconnected', function(){
        console.log(`${this.url} disconnected.`);
    });
    db.on('reconnected', function(){
        console.log(`${this.url} reconnected.`);
    });
};

MongoBee.prototype.model = function(name, schema){
    this.conn.model(name, schema);
}
module.exports = MongoBee;