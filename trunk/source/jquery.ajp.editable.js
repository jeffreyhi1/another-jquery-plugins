/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.editable = { version: '0.17pa', required: ['bindkeys'], editors: { } }

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
					'Ctrl+s': 'strikethrough',
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

				imageDialog: function (callback) {
					var url = prompt('Image URL', 'http://')
					if (url) {
						callback({
							'url': url,
							'attrs': {
								'alt': '',
								'title': ''
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
								var range = userSelection.getRangeAt(0);
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
//console.log('insert', node)
							range.insertNode(node);
//console.log('parent', node.parentNode)
							api.selectNode(node);
						}
					},

					createImage: function (url) {
						if (!url) return;
						this.replaceSelection('<img src="' + url + '"/>')
					},

					createAnchor: function (url) {
						if (!url) return;
						this.replaceSelection('<a href="' + url + '">' + this.getSelectedHtml() + '</a>');
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

				var helpers = {

					wrap: function (evt, ctx, s, e) {
						ctx.cancelEvent(evt)
						evt.returnValue = false
						ctx.replaceSelection(s + ctx.getSelectedHtml() + e)
						return false
					},

					list: function (evt, api, s, e) {

						api.cancelEvent(evt);
						evt.returnValue = false;
				
						var list = s
						var $node = $('<div>' + api.getSelectedHtml() + '</div>')
						var $items = $node.children('div, p')
						$items.each(function () { list += '<li>' + $(this).html() + '</li>' })
						list += e

						api.replaceSelection(list)

						return false;
					},

					align: function (evt, api, a) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						var html = api.getSelectedHtml()
						html = html.replace(/text-align\:\s*(left|center|right|justify)\s*\;?/gi, '')
						api.replaceSelection('<div style="text-align: '+ a + ';">' + html + '</div>')

/*
						var $node = $('<div>' + api.getSelectedHtml() + '</div>')
console.log('BEFORE', api.getSelectedHtml())
						$node.find('.ae-alignment > span').unwrap()
//						var html = $node.html()
//
//						if (/^\s*\<span\>/.test(html) && /\<\/span\>\s*$/.test(html))
//							html = html.replace(/^\s*\<span\>/, '')
//								.replace(/\<\/span\>\s*$/, '')

						var html
						do {
							html = $node.html()
							$node = (html.match(/^\s*\</) ? $(html) : null)
						} while ($node && ($node.hasClass('ae-alignment') || $node[0].tagName == 'SPAN'));

						
						
console.log('AFTER', html)
						api.replaceSelection('<div class="ae-alignment" style="text-align: '+ a + ';"><span>' + html + '</span></div>')
*/


						//api.replaceSelection('<div class="ae-alignment" style="text-align: '+ a + ';">' + api.getSelectedHtml() + '</div>')

						return false;
					},

					gc: function (api) {

						var $el = $(api.element)

						$el.find('span').each(function () {
							var $span = $(this);
							if ($span.text() == '')
							$span.remove()
						})
						
					}
				}

				var defaultCommands = {

					h1: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<h1>', '</h1>')
					},

					h2: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<h2>', '</h2>')
					},

					h3: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<h3>', '</h3>')
					},

					h4: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<h4>', '</h4>')
					},

					h5: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<h5>', '</h5>')
					},

					h6: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<h6>', '</h6>')
					},

					bold: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<b>', '</b>')
					},

					italic: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<i>', '</i>')
					},

					underline: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<u>', '</u>')
					},

					strikethrough: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<span style="text-decoration: line-through;">', '</span>')
					},

					small: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<small>', '</small>')
					},

					sub: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<sub>', '</sub>')
					},

					sup: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<sup>', '</sup>')
					},

					blockquote: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<blockquote>', '</blockquote>')
					},

					code: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<code>', '</code>')
					},

					quote: function (evt, ctx) {
						return helpers.wrap(evt, ctx, '<q>', '</q>')
					},

					ul: function (evt, ctx) {
						return helpers.list(evt, ctx, '<ul>', '</ul>')
					},

					ol: function (evt, ctx) {
						return helpers.list(evt, ctx, '<ol>', '</ol>')
					},

					left: function (evt, ctx) {
						return helpers.align(evt, ctx, 'left')
					},

					center: function (evt, ctx) {
						return helpers.align(evt, ctx, 'center')
					},

					right: function (evt, ctx) {
						return helpers.align(evt, ctx, 'right')
					},

					justify: function (evt, ctx) {
						return helpers.align(evt, ctx, 'justify')
					},

					text: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						var html = api.getSelectedHtml()
						var text = html.replace(/\<[^\>]*\>/g, '')
						api.replaceSelection('<span>' + text + '</span>')

						helpers.gc(api)

						return false;
					},

					anchor: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						options.anchorDialog(function (params) {
							api.createAnchor(params.url, api.getSelectedHtml());
						})

						return false;
					},

					image: function (evt, api) {

						api.cancelEvent(evt);
						evt.returnValue = false;

						options.imageDialog(function (params) {
							api.createImage(params.url, api.getSelectedHtml());
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
