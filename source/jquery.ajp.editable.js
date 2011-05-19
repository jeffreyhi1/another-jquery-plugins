/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.editable = { version: '0.11pa', required: ['bindkeys'], editors: { } }

	$.fn.extend({

		uneditable: function (options) {

			var defaults = {
				uneditable: function (api) {}
			}

			options = $.extend(defaults, options);

			$(this).each(function (i, el) {
				var id = $(el).attr('id');
				if (id && $.ajp.editable.editors[id]) {
					$(el).attr('contentEditable', false)
					options.uneditable($.ajp.editable.editors[id])
				}
			})
		},

		editable: function (options) {

			var defaults = {

				hotkeys: {

					'Ctrl+b': 'bold',
					'Ctrl+s': 'strike',
					'Ctrl+i': 'italic',
					'Ctrl+u': 'underline',

					'Ctrl+r': 'text',
					'Ctrl+l': 'anchor'
				},

				init: function (el, api) {}
			}

			options = $.extend(defaults, options);

			var randomId = function (prefix, n) {
				var a = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
				var id = prefix;
				for (var i = 0; i < n; i ++)
					id += a.charAt(parseInt(a.length * Math.random()))
				return id;
			}

			return this.each(function(i, el) {

				var api = {

					element: el,

					original: el.innerHTML,

					cancelEvent: function (evt) {
						if (!evt) return;
						evt.cancelBubble = true;
						if (evt.stopPropagation) {
							evt.stopPropagation();
							evt.preventDefault();
						}
					},

					range: null,

					saveSelection: function() {
						try {
							this.range = (window.getSelection ? window.getSelection().getRangeAt(0) : document.selection.createRange())
						} catch (ex) {
						}
					},

					restoreSelection: function() {
						if (!this.range)
							return;
						if (window.getSelection) {
							var sel = window.getSelection();
							if (sel.rangeCount > 0) 
								sel.removeAllRanges();
							sel.addRange(this.range);
						} else if (document.selection) {
							this.range.select();
						}
					},

					getSelectedHtml: function () {
						var userSelection;
						if (window.getSelection) {
							// W3C Ranges
							userSelection = window.getSelection();
							// Get the range:
							if (userSelection.getRangeAt)
								var range = userSelection.getRangeAt (0);
							else {
								var range = document.createRange();
								range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
								range.setEnd(userSelection.focusNode, userSelection.focusOffset);
							}
							// And the HTML:
							var clonedSelection = range.cloneContents();
							var div = document.createElement('div');
							div.appendChild(clonedSelection);
							return div.innerHTML;
						} else if (document.selection) {
							// Explorer selection, return the HTML
							userSelection = document.selection.createRange();
							return userSelection.htmlText;
						} else {
							return '';
						}
					},

					selectNode: function (node) {
						var range = document.createRange();
						range.selectNode(node);
						var selection = window.getSelection();
						selection.removeAllRanges();
						selection.addRange(range);
					},

					createAnchor: function (url, html) {
						if (!url) return;
						if (!html) html = url;
						var html = this.getSelectedHtml();
						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange()
							range.pasteHTML('<a href="' + url + '">' + html + '</a>');
						} else {
							var node = document.createElement('a');
							node.href = url;
							node.innerHTML = html;
							var selection = window.getSelection();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							this.selectNode(node);
						}
					},

					pasteHtml: function (html) {
						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange()
							range.pasteHTML('<span class="editable-not-initialized">' + html + '</span>');
							options.init(
								$(el).find('span.editable-not-initialized')
								.removeClass('editable-not-initialized')[0],
								this
							)
						} else {
							var node = document.createElement('span');
							node.innerHTML = html;
							options.init(node, this);
							var selection = window.getSelection();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							this.selectNode(node);
						}
					}
				}

				var defaultCommands = {

					bold: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						var html = api.getSelectedHtml();
						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange()
							range.pasteHTML('<b>' + html + '</b>');
						} else {
							var node = document.createElement('b');
							node.innerHTML = html;
							var selection = window.getSelection();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							api.selectNode(node);
						}

						return false;
					},

					italic: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						var html = api.getSelectedHtml();
						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange()
							range.pasteHTML('<i>' + html + '</i>');
						} else {
							var node = document.createElement('i');
							node.innerHTML = html;
							var selection = window.getSelection();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							api.selectNode(node);
						}

						return false;
					},

					underline: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						var html = api.getSelectedHtml();
						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange()
							range.pasteHTML('<u>' + html + '</u>');
						} else {
							var node = document.createElement('u');
							node.innerHTML = html;
							var selection = window.getSelection();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							api.selectNode(node);
						}

						return false;
					},

					strike: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						var html = api.getSelectedHtml();
						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange()
							range.pasteHTML('<font style="text-decoration: line-through;">' + html + '</font>');
						} else {
							var node = document.createElement('font');
							node.setAttribute('style', 'text-decoration: line-through;');
							node.innerHTML = html;
							var selection = window.getSelection();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							api.selectNode(node);
						}

						return false;

					},

					text: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange();
							range.pasteHTML(range.text.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;'));
						} else {			
							var selection = window.getSelection();
							var node = document.createElement('font');
							node.textContent = selection.toString();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							selection.selectAllChildren(node);
						}

						return false;
					},

					anchor: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						api.createAnchor(prompt('URL', 'http://'), api.getSelectedHtml());

						return false;
					}
				}

				$(el).attr('contentEditable', true)

				var hotkeysToBind = {}
				$.each(options.hotkeys, function (key, cmd) {
					if (typeof cmd == 'string')
						cmd = defaultCommands[cmd];
					if (typeof cmd == 'function')
						hotkeysToBind[key] = function (evt) {
							if (!el.contentEditable)
								return;
							cmd(evt, api)
						}
				})
				$(el).bindkeys({ 'hotkeys': hotkeysToBind })

				if (!el.id)
					el.id = randomId('editable-autogenerated-id-', 16);
				$.ajp.editable.editors[el.id] = api;

				options.init(el, api)
			})
		}
	})

})(jQuery)
