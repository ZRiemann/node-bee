const RPC = require('../../modules/MQ/rabbit/RPC');
const logBee = require('../../modules/base/log');

let rpc = new RPC();
let cnt = 0;
rpc.run(function(err){},
        true,
        echoBack);

/**
setTimeout(function(){
    console.log('closing rabbitmq');
    rpc.close();
}, 3000);
*/
function echoBack(msg) {
    cnt++;
    if(0 == (cnt % 10000)){
        logBee.dbg(cnt);
    }
    return msg;
}
