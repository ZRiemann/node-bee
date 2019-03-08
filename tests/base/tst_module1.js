const Device = require('../../modules/base/device');
const logBee = require('../../modules/base/log');

Device.root.initChain.push('tst_module1');
exports.module1 = new Device('module1');