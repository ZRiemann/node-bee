const Topic = require('../../modules/MQ/rabbit/topic');
const logBee = require('../../modules/base/log');

let topic = new Topic();
topic.run('topic_tst');

setTimeout(function(){
    for(i = 0; i<500000; ++i){
        if(i%10000 == 0){
            logBee.dbg(`publish[${i}]`);
        }
        topic.publish('titleA',`titleA subscribers ${i}`);
        topic.publish('titleA.a1',`titleA.a1 subscribers ${i}`);
        topic.publish('titleB',`titleB subscribers ${i}`);
    }
}, 1000);
