const Fanout = require('../../modules/MQ/rabbit/fanout');
const logBee = require('../../modules/base/log');

let fanout = new Fanout();
fanout.run('fanout_tst');

setTimeout(function(){
    let i = 0; 
    fanout.subscribe(function(err, msg){
        if(err){
            logBee.err(err.message);
        }else{
            i++;
            if(i%1000 == 0){
                logBee.dbg(`subscribe[${i}]`);
            }
            //logBee.dbg(`${msg} ${i}`);
        }
    });
}, 500);
