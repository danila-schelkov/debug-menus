var lop = Interceptor.attach(Module.findExportByName("libc.so", '__cxa_atexit'), {
    onEnter: function(args) {
		var base = Module.findBaseAddress("libg.so");
        if (base) {
			var base = Module.findBaseAddress("libg.so");
			var mallocPtr = Module.findExportByName("libc.so", "malloc");
			var malloc = new NativeFunction(mallocPtr, 'pointer', ['int']);
			var debugPtr = Module.findExportByName("libg.so", "_ZN9DebugMenuC2Ev");
			var debugMenu = new NativeFunction(debugPtr, "pointer", ["pointer"]);
			var effectPtr = Module.findExportByName("libg.so", "_ZN13EffectPreviewC2Ev");
			var effectMenu = new NativeFunction(effectPtr, "pointer", ["pointer"]);
			var levelPtr = Module.findExportByName("libg.so", "_ZN9LevelMenuC2Eb");
			var levelMenu = new NativeFunction(levelPtr, "pointer", ["pointer", "int"]);
			var RESOURCELISTENER_ADDFILE_PTR = Module.findExportByName("libg.so", "_ZN16ResourceListener7addFileEPKc");
			var ResourceListener_addFile = new NativeFunction(RESOURCELISTENER_ADDFILE_PTR, "void", ["pointer", "pointer"]);
			var GAMEMODE_ADDRESOURCESTOLOAD_PTR = Module.findExportByName("libg.so", "_ZN8GameMode18addResourcesToLoadEP16ResourceListener");
			var Stage_ptr = Module.findExportByName("libg.so", "_ZN5StageC2Ev");
			var Stage_addChild_ptr = Module.findExportByName("libg.so", "_ZN5Stage8addChildEP13DisplayObject");
			var Stage_addChild = new NativeFunction(Stage_addChild_ptr, "int", ["pointer", "pointer"]);
			var Stage_removeChild_ptr = Module.findExportByName("libg.so", "_ZN5Stage11removeChildEP13DisplayObject");
			var Stage_removeChild = new NativeFunction(Stage_removeChild_ptr, "int", ["pointer", "pointer"]);
			var ScrollArea_addContent_ptr = Module.findExportByName("libg.so", "_ZN10ScrollArea10addContentEP13DisplayObject");
			var ScrollArea_addContent = new NativeFunction(ScrollArea_addContent_ptr, "int", ["pointer", "pointer"]);
			var DisplayObject_setSize_ptr = Module.findExportByName("libg.so", "_ZN13DisplayObject7setSizeEff");
			var DisplayObject_setSize = new NativeFunction(DisplayObject_setSize_ptr, "int", ["pointer", "float", "float"]);
			var sendMessage = Module.findExportByName("libg.so", "_ZN15ChatInputGlobal11sendMessageEv");
			var hudUpdatePtr = Module.findExportByName("libg.so", "_ZN3HUD6updateEf");
			var debugMenuBaseUpdatePtr = Module.findExportByName("libg.so", "_ZN13DebugMenuBase6updateEf");
			var debugMenuBaseUpdate = new NativeFunction(debugMenuBaseUpdatePtr, "int", ["pointer", "float"]);
			var stage_address;
			var debugmenutype;
			var leave = 0;
			var dptr = malloc(225);
            lop.detach();
			Module.findExportByName("libg.so", "_ZN12LogicDefines12OFFLINE_MODEE").writeU8(1);
			var load = Interceptor.attach(Module.findExportByName("libg.so", "_ZN8GameMode18addResourcesToLoadEP16ResourceListener"), {
				onEnter: function(args) {
					load.detach();
					ResourceListener_addFile(ptr(args[1]), ptr(base.add(0x02B247B)));
				}
			});
			var stage = Interceptor.attach(Module.findExportByName("libg.so", "_ZN5StageC2Ev"), {
				onEnter: function(args) {
					stage.detach();
					stage_address = args[0];
				}
			});
			var gameWasLoaded = Interceptor.attach(Module.findExportByName("libg.so", "_ZN8MoneyHUDC2EP9MovieClip"), {
    			onEnter: function(args) {
					gameWasLoaded.detach();
					Stage_addChild(stage_address, debugMenu(dptr));
					debugmenutype = 0;
    			}
			});
			var levelButton = Interceptor.attach(Module.findExportByName("libg.so", "_ZN15LoadLevelButton13buttonPressedEv"), {
				onEnter: function(args) {
					if(debugmenutype === 0) {
						DisplayObject_setSize(debugMenu(dptr), 0, 0);
						DisplayObject_setSize(effectMenu(dptr), 0, 0);
						Stage_removeChild(stage_address, debugMenu(dptr));
						Stage_addChild(stage_address, levelMenu(dptr, 2));
						debugmenutype = 2;
					}
				}
			});
			var effectButton = Interceptor.attach(Module.findExportByName("libg.so", "_ZN19EffectPreviewButton13buttonPressedEv"), {
				onEnter: function(args) {
					if(debugmenutype === 0) {
						DisplayObject_setSize(debugMenu(dptr), 0, 0);
						DisplayObject_setSize(levelMenu(dptr, 2), 0, 0);
						Stage_removeChild(stage_address, debugMenu(dptr));
						Stage_addChild(stage_address, effectMenu(dptr));
						debugmenutype = 1;
					}
				}
			});
			var ExitDebug = Interceptor.attach(Module.findExportByName("libg.so", "_ZN21ToggleDebugMenuButton13buttonPressedEv"), {
				onEnter: function(args) {
					switch(debugmenutype) {
						case 0:
							DisplayObject_setSize(debugMenu(dptr), 0, 0);
							DisplayObject_setSize(effectMenu(dptr), 0, 0);
							DisplayObject_setSize(levelMenu(dptr, 2), 0, 0);
						break;
						case 1:
							DisplayObject_setSize(effectMenu(dptr), 0, 0);
							DisplayObject_setSize(levelMenu(dptr, 2), 0, 0);
							Stage_removeChild(stage_address, effectMenu(dptr));
							Stage_addChild(stage_address, debugMenu(dptr));
							debugmenutype = 0;
						break;
						case 2:
							DisplayObject_setSize(levelMenu(dptr, 2), 0, 0);
							DisplayObject_setSize(effectMenu(dptr), 0, 0);
							Stage_removeChild(stage_address, levelMenu(dptr, 0));
							Stage_addChild(stage_address, debugMenu(dptr));
							debugmenutype = 0;
						break;
					}
				}
			});
			var sendMessageCtor = Interceptor.attach(sendMessage, {
				onEnter: function(args) {
					leave = 0;
					var ReadChatMessage = Interceptor.attach(Module.findExportByName("libg.so", "_ZN6StringC2EPKc"), {
						onEnter: function(args) {
							if(args[1].readUtf8String() === "/menu") {
								Stage_addChild(stage_address, debugMenu(dptr));
								ReadChatMessage.detach();
							}
							if(leave === 1) {
								ReadChatMessage.detach();
							}
						}
					});
				},
				onLeave: function(args) {
					leave = 1;
				}
			});
			var hudUpdate = Interceptor.attach(hudUpdatePtr, {
				onEnter: function(args) {
					debugMenuBaseUpdate(dptr, 20);
				}
			});
        }
    }
});