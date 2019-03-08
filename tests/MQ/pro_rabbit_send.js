const Rabbit = require('../../modules/MQ/rabbit/rabbit_pro');
const logBee = require('../../modules/base/log');

async function main(){
    let rabbit = new Rabbit();
    try{
        await rabbit.connect();
        await rabbit.assertQueue('pro_queue');
        await baseTest(rabbit);
        await stressTesting(rabbit);
        await rabbit.close();
    }catch(err){
        logBee.dumpError(err);
    }finally{
        logBee.dbg('test done');
    }
}
main();

function baseTest(rabbit){
    let msg = 0;
    return new Promise((resolve, reject)=>{
        for(let i = 0; i < 3; ++i){
            msg = `message[${i}]`;
            rabbit.sendToQueue(msg);
            logBee.dbg(msg);
        }
        resolve(null);
    });
}

function stressTesting(rabbit){
    return new Promise((resolve, reject) =>{
        for(let i = 0; i < 500000; ++i){
            if(i%10000 === 0){
                logBee.msg(`message[${i}]`);
            }
            rabbit.sendToQueue(`message[${i}]`);
        }
        resolve(null);
    });
}