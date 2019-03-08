const Rabbit = require('../../modules/MQ/rabbit/rabbit_pro');
const logBee = require('../../modules/base/log');

async function main(){
    let rabbit = new Rabbit();
    let cnt = 0;
    function handler(msg){
        if(cnt%10000 === 0){
            logBee.msg(msg);
        }
        cnt++;
    }
    try{
        await rabbit.connect();
        await rabbit.assertQueue('pro_queue');
        //await rabbit.consume(msg => logBee.dbg(msg));
        await rabbit.consume(handler);
        logBee.dbg('timing...');
        await new Promise(resolve => {setTimeout(() => {
            logBee.dbg('timeout');
            resolve('resolved');
        }, 60000);});
        await rabbit.close();
    }catch(err){
        logBee.dumpError(err);
    }finally{
        logBee.dbg('test done.');
    }
}
main();
