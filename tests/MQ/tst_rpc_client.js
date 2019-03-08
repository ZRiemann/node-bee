const async = require('async');

const RPC = require('../../modules/MQ/rabbit/RPC');
const logBee = require('../../modules/base/log');

let rpc = new RPC();

async.series([
    function(cb){
        rpc.run(cb, false);
    },function(cb){
        tst_timeout(cb);
    },function(cb){
        test(cb);
    },function(cb){
        setTimeout(function(){rpc.close(cb);}, 500);
    }], function(err, results){
        logBee.dbg(results);
    }
);

function tst_timeout(cb){
    rpc.req('aaa', function(err, req, rep){
        if(err){
            logBee.err(err.message);
        }else{
            logBee.dbg(`${req} => ${rep}`);
        }
        cb(null);
    }, 1000);
}
function test(cb){
    let buf = 0;
    let cnt = 0;
    for(let i = 0; i < 500000; ++i){
        if(0 == i%10000){
            logBee.dbg(`send[${i}]`);
        }
        rpc.req(`hello world! ${i}`,
                function(err, req, rep){
                    if(err){
                        logBee.dumpError(err);
                    }else{
                        //logBee.dbg(`${req} => ${rep}`);
                        ++cnt;
                        if(0 == cnt%10000){
                            logBee.dbg(`reply: ${cnt}`);
                        }
                        if(cnt == 500000){
                            cb(null); // test done
                        }
                    }
                }, 70000);
    }
}


/*
setTimeout(()=>{
    rpc.close();
}, 6000);
*/