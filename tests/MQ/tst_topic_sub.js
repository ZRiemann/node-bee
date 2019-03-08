const Topic = require('../../modules/MQ/rabbit/topic');
const logBee = require('../../modules/base/log');

let topic = new Topic();
topic.run('topic_tst');

setTimeout(function(){
    let i = 0;
    topic.subscribe(['titleA.*', 'titleB.#'], function(err, msg){
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
