const Device = require('../../modules/base/device');
const logBee = require('../../modules/base/log');

Device.root.init();
Device.root.run();
Device.root.stop();
Device.root.fini();
logBee.dbg(JSON.stringify(Device.root));
