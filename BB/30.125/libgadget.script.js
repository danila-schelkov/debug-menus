var menus = [
	'_ZN13BuildBaseMenuC2Ev',
	'_ZN15DebugABTestMenuC2Ev',
	'_ZN16DebugAccountMenuC2Ev',
	'_ZN13DebugBaseMenuC2Ev',
	'_ZN15DebugBattleMenuC2Ev',
	'_ZN17DebugDeepLinkMenuC2Ev',
	'_ZN14DebugEventMenuC2Ev',
	'_ZN20DebugFastForwardMenuC2Ev',
	'_ZN17DebugGraphicsMenuC2Ev',
	'_ZN9DebugInfoC2Ev',
	'_ZN13DebugMainMenuC2Ev',
	'_ZN12DebugMapMenuC2Ev',
	'_ZN17DebugResourceMenuC2Ev',
	'_ZN18DebugTaskForceMenuC2Ev',
	'_ZN14DebugUnitsMenuC2Ev',
	'_ZN13EffectPreviewC2Ev',
	'_ZN9LevelMenuC2Eb'
];

var malloc = new NativeFunction(Module.findExportByName('libc.so', 'malloc'), 'pointer', ['int']);

function createString(message) {
    var charPtr = malloc(message.length + 1);
    Memory.writeUtf8String(charPtr, message);
    return charPtr;
}

function Hook(parameters, base) {
    this.base = base;
    this.host = '18.191.240.99'; // parameters.redirectHost;
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

Hook.prototype.loadSC = function (filename) {
    var addFilePtr = this.base.add(0x361858 + 1);
    var addFileFunction = new NativeFunction(addFilePtr, 'int', ['pointer', 'pointer', 'int', 'int', 'int', 'int']);

    Interceptor.attach(Module.findExportByName('libg.so', '_ZN8GameMode18addResourcesToLoadEP16ResourceListener'), {
        onEnter: function (args) {
            addFileFunction(args[1], createString(filename), -1, -1, -1, -1)
            console.log(filename + ' loaded!');
        }
    });
};

Hook.prototype.showDebugMenu = function (debugPtr) {
    var setTitle = new NativeFunction(this.base.add(0x1cc2b0 + 1), 'void', ['pointer', 'pointer']);

    var debugConstructor = new NativeFunction(debugPtr, 'pointer', ['pointer']);
    var debugMemory = malloc(300);

    var stageAddChildPtr = this.base.add(0x3871A0 + 1);
    var stageAddChild = new NativeFunction(stageAddChildPtr, 'int', ['pointer', 'pointer']);

    var debugMenuBaseUpdate = new NativeFunction(Module.findExportByName("libg.so", "_ZN13DebugMenuBase6updateEf"), "int", ["pointer", "float"]);

    var stage_arg_1;
    Interceptor.attach(stageAddChildPtr, {
        onEnter: function (args) {
            stage_arg_1 = args[0];
        }
    });

    Interceptor.attach(Module.findExportByName("libg.so", "_ZN3HUD6updateEf"), {
        onEnter: function (args) {
            debugMenuBaseUpdate(debugMemory, 20);
        }
    });
	
	var base = this.base;

	Interceptor.attach(Module.findExportByName("libg.so", "_ZN13DebugMainMenu13buttonClickedEP12CustomButton"), {
		onEnter: function (args) {
			var a1 = a[0];  // GameMain
			var a2 = a[1];
			
			console.log(a1.add(25), a1.add(25).readInt32());
			console.log(a2);
		}
	});

    Interceptor.attach(Module.findExportByName('libg.so', '_ZN8MoneyHUDC2EP9MovieClip'), {
        onEnter: function (args) {
            var debug = debugConstructor(debugMemory);

            // setTitle(debug, createString('DevTeam'));

            stageAddChild(stage_arg_1, debug);
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

            var debugMenuBaseUpdatePtr = Module.findExportByName('libg.so', '_ZN13DebugMenuBase6updateEf');
            var debugMenuBaseUpdate = new NativeFunction(debugMenuBaseUpdatePtr, 'int', ['pointer', 'float']);

            hook.loadSC('sc/debug.sc');

            hook.redirect();
            debug = hook.showDebugMenu(Module.findExportByName('libg.so', menus[10]));
        }
    }
};
