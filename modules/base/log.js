//'use strict'
/**
 * Loge template
 */
function LogBee(){}
LogBee.prototype.now = function(){
    let date = new Date();
    return `${date.getDate()}.${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()} `;
};
LogBee.prototype.output = console.log; // can change to 'debug'/'log4js'
LogBee.prototype.log = function(msg, level = '[DBG]',
                                date = LogBee.prototype.now(),
                                title = '',
                                fn = LogBee.prototype.output){
    fn(`${date}${title}${level}${msg}`);
};
LogBee.prototype.dbg = function(msg){
    LogBee.prototype.log(msg);
};
LogBee.prototype.msg = function(msg){
    LogBee.prototype.log(msg, '[MSG]');
};
LogBee.prototype.inf = function(msg){
    LogBee.prototype.log(msg, '[INF]');
};
LogBee.prototype.war = function(msg){
    LogBee.prototype.log(msg, '[WAR]');
};

LogBee.prototype.err = function(msg){
    LogBee.prototype.log(msg, '[ERR]');
};
LogBee.prototype.dumpError = function(e){
    if(e && e instanceof Error){
        logBee.err(e.toString());
        logBee.err(e.stack);
    }else{
        logBee.err(`logBee.prototype.dumpError(${e}) parameter invalid`);
    }
};
LogBee.prototype.indent = function(deep, prefix){
    let offset = '';
    while(deep--){
        offset += prefix;
    }
    return offset;
};
LogBee.prototype.toJSON = function(o){
    JSON.stringify(o);
};

LogBee.prototype.objString = function(o, deep = 0, indent = '  ', isBegin = false,
                                      max_deep = 5){
    let prefix = '';//LogBee.prototype.indent(deep, indent);
    let suffix = LogBee.prototype.indent(deep, indent);
    if(isBegin){
        prefix = LogBee.prototype.indent(deep, indent);
    }
    if(null == o){
        return 'null,\n';
    }
    let str = 'unknown';//`${prefix}${o.toString()},\n`;
    if(deep > max_deep){
        return `(max-deep-${max_deep}),\n`;
    }
    if(typeof(o) === 'string'){
        str = `${prefix}'${o.toString()}',\n`;
    }else if(typeof(o) === 'number' ||
             typeof(o) === 'boolean'){
        str = `${prefix}${o.toString()},\n`;
    }else if(typeof(o) === 'object'){
        if(o instanceof Date){
            str = o.toString();
            str += ',\n';
        }else if(o instanceof Array){
            // Array
            str = prefix + '[\n';
            let i = 0;
            for(i in o){
                str += LogBee.prototype.objString(o[i], deep + 1, indent, true,
                                                  max_deep);
            }
            // TODO: remofe the last item's ','
            str += suffix + '],\n';
        }else if(o instanceof Map){
            str = prefix + '[<map>\n';
            str += `${prefix}size: ${o.size},\n`;
            o.forEach(function(value, key, map){
                str += `${suffix}${indent}${key}: `;
                str += LogBee.prototype.objString(value, deep + 1, indent, false,
                                                  max_deep);
            });
            str += suffix + '<map>]\n';
        }else if(o instanceof Buffer){
            str = '<Buffer>,\n';
        }else{
            // normal Object
            str = prefix + '{\n';
            for(i in o){
                str += `${suffix}${indent}${i}: `;
                str += LogBee.prototype.objString(o[i], deep + 1, indent, false,
                                                  max_deep);
            }
            str += suffix + '},\n';
        }
    }else if(typeof(o) === 'function'){
        str = '<fn>,\n';
    }else{
        str = `(type=${typeof(o)})\n`;
    }
    return str;
};

module.exports = new LogBee();