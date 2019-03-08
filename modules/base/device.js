const logBee = require('./log');
function Device(name = ''){
    this.name = name;
    this.modules = new Array();
    this.parent = null;
}

Device.prototype.root = new Device('root');
Device.prototype.attach = function(baseModule, subModule){
    if(subModule instanceof Device &&
       baseModule instanceof Device){
        baseModule.modules.push(subModule);
        subModule.parent = baseModule;
    }else{
        throw new TypeError('parameters are not instance of Device');
    }
};

Device.prototype.forEach = (callback, hint, ...args){
    this.modules.forEach(device => {
        callback(device, hint, args);
    });
}

Device.prototype.init = function(hint = null, ...args){
    this.modules.forEach(device => {
        device.init(hint, args);
    });
    logBee.dbg(`${this.name} initial`);
};

Device.prototype.run = function(hint = null, ...args){
    this.modules.forEach(device => {
        device.run(hint, args);
    });
    logBee.dbg(`${this.name} run`);
};

Device.prototype.stop = function(hint = null, ...args){
    this.modules.forEach(device => {
        device.stop(hint, args);
    });
    logBee.dbg(`${this.name} stop`);
};

Device.prototype.fini = function(hint = null, ...args){
    this.modules.forEach(device => {
        device.fini(hint, args);
    });
    logBee.dbg(`${this.name} finish`);
};


module.exports.Device = Device;
