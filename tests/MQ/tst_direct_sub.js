const Direct = require('../../modules/MQ/rabbit/direct');
const logBee = require('../../modules/base/log');

let direct = new Direct();
direct.run('direct_tst');

setTimeout(function(){
    let i = 0;
    direct.subscribe(['titleA', 'titleB'], function(err, msg){
        if(err){
            logBee.err(err.message);
        }else{
            i++;
            if(i%1000 == 0){
                logBee.dbg(`subscribe[${i}]`);
            }
            logBee.dbg(`${msg} ${i}`);
        }
    });
}, 500);
