const Fanout = require('../../modules/MQ/rabbit/fanout');
const logBee = require('../../modules/base/log');

let fanout = new Fanout();
fanout.run('fanout_tst');

setTimeout(function(){
    for(i = 0; i<500000; ++i){
        if(i%10000 == 0){
            logBee.dbg(`publish[${i}]`);
        }
        fanout.publish(`hello subscribers ${i}`);
    }
}, 1000);
