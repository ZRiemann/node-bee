const Direct = require('../../modules/MQ/rabbit/direct');
const logBee = require('../../modules/base/log');

let direct = new Direct();
direct.run('direct_tst');

setTimeout(function(){
    for(i = 0; i<500000; ++i){
        if(i%10000 == 0){
            logBee.dbg(`publish[${i}]`);
        }
        direct.publish('titleA',`titleA subscribers ${i}`);
        direct.publish('titleB',`titleB subscribers ${i}`);
    }
}, 1000);
