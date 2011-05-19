/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.bindkeys = { version: '0.11pa' }

	$.fn.extend({

		bindkeys: function (options) {

			var defaults = {
				hotkeys: {
				}
			}

			options = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {

					hotKeys: [],

					cancelEvent: function (evt) {
						if (!evt) return;
						evt.cancelBubble = true;
						if (evt.stopPropagation) {
							evt.stopPropagation();
							evt.preventDefault();
						}
					},

					parseHotKey: function (hotKeyData) {
						var hotKey = {
							ctrlKey: false,
							altKey: false,
							shiftKey: false,
							keyCode: 0,
							shortcut: hotKeyData
						}
						var tokens = hotKeyData.toUpperCase().split('+')
						for (var i = 0; i < tokens.length; i ++) {
							var m;
							if (/^CTRL|CONTROL$/.test(tokens[i])) {
								hotKey.ctrlKey = true
							} else if (/^(ENTER|RETURN)$/.test(tokens[i])) {
								hotKey.keyCode = 13
							} else if (/^TAB$/.test(tokens[i])) {
								hotKey.keyCode = "\t".charCodeAt(0)
							} else if (/^BACKSPACE|BS(PC)?$/.test(tokens[i])) {
								hotKey.keyCode = "\b".charCodeAt(0)
							} else if (/^SPACE|SPC$/.test(tokens[i])) {
								hotKey.keyCode = ' '.charCodeAt(0)
							} else if (/^ESC(APE)?$/.test(tokens[i])) {
								hotKey.keyCode = 27
							} else if (/^(PAGE|PG)UP$/.test(tokens[i])) {
								hotKey.keyCode = 33
							} else if (/^(PAGE|PG)D(OW)?N$/.test(tokens[i])) {
								hotKey.keyCode = 34
							} else if (/^HOME$/.test(tokens[i])) {
								hotKey.keyCode = 36
							} else if (/^END$/.test(tokens[i])) {
								hotKey.keyCode = 35
							} else if (/^INS(ERT)?$/.test(tokens[i])) {
								hotKey.keyCode = 45
							} else if (/^DEL(ETE)?$/.test(tokens[i])) {
								hotKey.keyCode = 46
							} else if (/^LEFT$/.test(tokens[i])) {
								hotKey.keyCode = 37
							} else if (/^RIGHT$/.test(tokens[i])) {
								hotKey.keyCode = 39
							} else if (/^D(OW)?N$/.test(tokens[i])) {
								hotKey.keyCode = 40
							} else if (/^UP$/.test(tokens[i])) {
								hotKey.keyCode = 38
							} else if (/^ALT$/.test(tokens[i])) {
								hotKey.altKey = true
							} else if (/^SHI?FT$/.test(tokens[i])) {
								hotKey.shiftKey = true
							} else if ((m = tokens[i].match(/^F(\d+)$/))) {
								hotKey.keyCode = 111 + parseInt(m[1]);
							} else if (tokens[i] == '') {
								hotKey.keyCode = '+'.charCodeAt(0);
							} else {
								hotKey.keyCode = tokens[i].charCodeAt(0);
							}
						}
						return hotKey;
					},

					bindHotKey: function (hotKeyData, handler) {
						var hotKey = this.parseHotKey(hotKeyData);
						if (hotKey.keyCode)
							this.hotKeys.push({ 'hotKey': hotKey, 'handler': handler })
					},

					onkeydown: function (evt) {
						for (var i = 0; i < this.hotKeys.length; i ++) {
							var k = this.hotKeys[i].hotKey;
							if (
								(k.keyCode == evt.keyCode)
								&& (!k.ctrlKey || evt.ctrlKey)
								&& (!k.altKey || evt.altKey)
								&& (!k.shiftKey || evt.shiftKey)
							)
								return this.hotKeys[i].handler(evt, api);
						}
					}
				}

				var defaultCommands = { }

				if (/opera/i.test(navigator.userAgent)) {
					$(el).keypress(function (evt) { api.onkeydown(evt) });
				} else {
					$(el).keydown(function (evt) { api.onkeydown(evt) });
				}

				for (var key in options.hotkeys) {
					var cmd = options.hotkeys[key];
					if (typeof cmd == 'string')
						cmd = defaultCommands[cmd];
					if (cmd)
						api.bindHotKey(key, cmd);
				}
			})
		}
	})

})(jQuery)
