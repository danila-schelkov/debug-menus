var malloc = new NativeFunction(Module.findExportByName('libc.so', 'malloc'), 'pointer', ['int']);

function createString(message) {
    var charPtr = malloc(message.length + 1);
    Memory.writeUtf8String(charPtr, message);
    return charPtr;
}

function Hook(parameters, base) {
    this.base = base;
    this.host = 'YOUR HOST\'S IP'; 
}

Hook.prototype.redirect = function () {
    var host = this.host;

    Interceptor.attach(Module.findExportByName(null, 'getaddrinfo'), {
        onEnter: function (args) {
            this.path = args[0].readUtf8String();
            if (this.path === 'game.boombeachgame.com') {
                this.z = args[0] = Memory.allocUtf8String(host);
            }
        }
    });
};

Hook.prototype.enableOfflineMode = function () {
    this.base.add(0x30F870).writeU8(1);
	
	/*Interceptor.replace(this.base.add(0xB7278 + 1), new NativeCallback(function () {
		return 1;
	}, 'int', [])); // BattleSimulator */
};

Hook.prototype.loadSC = function (filename) {
    var addFilePtr = this.base.add(0x11C528 + 1);
    var addFileFunction = new NativeFunction(addFilePtr, 'int', ['pointer', 'pointer', 'int', 'int']);

    var addResourcesToLoad = Interceptor.attach(this.base.add(0xAB804 + 1), {
        onEnter: function (args) {
			addResourcesToLoad.detach();
			
            addFileFunction(args[1], createString(filename), -1, -1)
            console.log(filename + ' loaded!');
        }
    });
};

Hook.prototype.showDebugMenu = function (debugPtr) {
    var debugConstructor = new NativeFunction(debugPtr, 'pointer', ['pointer']);
    var debugMemory = malloc(300);

    var stageAddChildPtr = this.base.add(0x12A9AE + 1);
    var stageAddChild = new NativeFunction(stageAddChildPtr, 'int', ['pointer', 'pointer']);

    /* Interceptor.attach(base.add(0x69DFC + 1), {
        onEnter: function (args) {
            debugMenuBaseUpdate(debugMemory, 20);
        }
    }); */

    var stageAddress;
    Interceptor.attach(stageAddChildPtr, {
        onEnter: function (args) {
            stageAddress = args[0];
        }
    });
	
	var base = this.base;

	Interceptor.attach(this.base.add(0x6D9A4 + 1), {
        onEnter: function (args) {
            var debug = debugConstructor(debugMemory);

            stageAddChild(stageAddress, debug);
            console.log('Debug opened!');
        }
    });

    return debug;
};

rpc.exports = {
    init: function (stage, parameters) {
        var base = Module.findBaseAddress('libg.so');
        if (base) {
			var i = 0;
            var hook = new Hook(parameters, base);

            console.log('base: ' + base);

            hook.loadSC('sc/debug.sc');

            hook.enableOfflineMode();
            debug = hook.showDebugMenu(base.add(0x4020C + 1));
        }
    }
};
