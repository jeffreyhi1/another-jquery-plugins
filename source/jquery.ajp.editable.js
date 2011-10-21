/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.editable = { version: '0.14pa', required: ['bindkeys'], editors: { } }

	$.fn.extend({

		ajp$uneditable: function (options) {

			var defaults = {
				uneditable: function (api) {}
			}

			var options = $.extend(defaults, options);

			$(this).each(function (i, el) {
				var id = $(el).attr('id');
				if (id && $.ajp.editable.editors[id]) {
					$(el).attr('contentEditable', false)
					options.uneditable($.ajp.editable.editors[id])
				}
			})
		},

		ajp$editableContext: function () {
			var id = this.attr('id');
			if (id)
				return $.ajp.editable.editors[id]
			return null
		},

		ajp$editable: function (options) {

			var defaults = {

				hotkeys: {

					'Ctrl+b': 'bold',
					'Ctrl+s': 'strike',
					'Ctrl+i': 'italic',
					'Ctrl+u': 'underline',

					'Ctrl+1': 'h1',
					'Ctrl+2': 'h2',
					'Ctrl+3': 'h3',
					'Ctrl+4': 'h4',
					'Ctrl+5': 'h5',
					'Ctrl+6': 'h6',

					'Ctrl+r': 'text',
					'Ctrl+l': 'anchor'
				},

				anchorDialog: function (callback) {
					var url = prompt('URL', 'http://')
					if (url) {
						callback({
							'url': url,
							'attrs': {
								'rel': 'nofollow',
								'target': '_blank'
							}
						})
					}
				},

				init: function (el, api) {}
			}

			var options = $.extend(defaults, options);

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

					replaceSelection: function (html) {
						if (/explorer/i.test(navigator.appName)) {
							var range = document.selection.createRange()
							range.pasteHTML(html)
						} else {
							var node = $(html)[0]
							var selection = window.getSelection();
							var range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(node);
							api.selectNode(node);
						}
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

					h1: function (evt, ctx) {
						ctx.cancelEvent(evt)
						evt.returnValue = false
						ctx.replaceSelection('<h1>' + ctx.getSelectedHtml() + '</h1>')
						return false
					},

					h2: function (evt, ctx) {
						ctx.cancelEvent(evt)
						evt.returnValue = false
						ctx.replaceSelection('<h2>' + ctx.getSelectedHtml() + '</h2>')
						return false
					},

					h3: function (evt, ctx) {
						ctx.cancelEvent(evt)
						evt.returnValue = false
						ctx.replaceSelection('<h3>' + ctx.getSelectedHtml() + '</h3>')
						return false
					},

					h4: function (evt, ctx) {
						ctx.cancelEvent(evt)
						evt.returnValue = false
						ctx.replaceSelection('<h4>' + ctx.getSelectedHtml() + '</h4>')
						return false
					},

					h5: function (evt, ctx) {
						ctx.cancelEvent(evt)
						evt.returnValue = false
						ctx.replaceSelection('<h5>' + ctx.getSelectedHtml() + '</h5>')
						return false
					},

					h6: function (evt, ctx) {
						ctx.cancelEvent(evt)
						evt.returnValue = false
						ctx.replaceSelection('<h6>' + ctx.getSelectedHtml() + '</h6>')
						return false
					},

					bold: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						api.replaceSelection('<b>' + api.getSelectedHtml() + '</b>')			

						return false;
					},

					italic: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						api.replaceSelection('<i>' + api.getSelectedHtml() + '</i>')

						return false;
					},

					underline: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						api.replaceSelection('<u>' + api.getSelectedHtml() + '</u>')

						return false;
					},

					strike: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						api.replaceSelection('<span style="text-decoration: line-through;">' + api.getSelectedHtml() + '</span>')

						return false;

					},

					text: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						var html = api.getSelectedHtml()
						var text = html.replace(/\<[^\>]*\>/g, '')
						api.replaceSelection('<span>' + text + '</span>')

						return false;
					},

					anchor: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						options.anchorDialog(function (params) {
							api.createAnchor(params.url, api.getSelectedHtml());
						})

						return false;
					}
				}

				api.execCommand = function (name) {
					return defaultCommands[name]({ }, this)
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
				$(el).ajp$bindkeys(hotkeysToBind)

				if (!el.id)
					el.id = randomId('editable-autogenerated-id-', 16);
				$.ajp.editable.editors[el.id] = api;

				options.init(el, api)
			})
		}
	})

})(jQuery);
