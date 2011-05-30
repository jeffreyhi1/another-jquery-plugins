/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }

	$.ajp.resizable = {
		version: '0.4pa',
		installed: false,
		current: undefined,
		elements: {},
		mouse: {}
	}

	$.fn.extend({

		unresizable: function () {
			return this.each(function(i, el) {
				var id = $(el).attr('id');
				if (id && $.ajp.resizable.elements[id]) {
					$.ajp.resizable.elements[id].disable()
				}
			})
		},

		resizable: function (options) {

			var defaults = {
				proportional: false,
				minWidth: 40,
				minHeight: 40
			}

			options = $.extend(defaults, options);

			var cancelEvent = function (evt) {
				if (!evt) return;
				evt.cancelBubble = true;
				if (evt.stopPropagation) {
					evt.stopPropagation();
					evt.preventDefault();
				}
			}

			var randomId = function (prefix, n) {
				var a = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
				var id = prefix;
				for (var i = 0; i < n; i ++)
					id += a.charAt(parseInt(a.length * Math.random()))
				return id;
			}

			if (!$.ajp.resizable.installed) {
				$(document).mousedown(function (evt) {
					//cancelEvent(evt)
					if ($.ajp.resizable.current) {
						$.ajp.resizable.mouse.down = true;
						$.ajp.resizable.mouse.x = evt.clientX;
						$.ajp.resizable.mouse.y = evt.clientY;
						$.ajp.resizable.current.width = $.ajp.resizable.current.target.outerWidth()
						$.ajp.resizable.current.height = $.ajp.resizable.current.target.outerHeight()

						//document.selectionStart = 0;
						//document.selectionEnd = 0;
					}
				}).mouseup(function (evt) {
					cancelEvent(evt)
					$.ajp.resizable.mouse.down = false;
					$.ajp.resizable.current = undefined;
					//if ($.ajp.resizable.current) {
						//document.selectionStart = 0;
						//document.selectionEnd = 0;
					//}

				}).mousemove(function (evt) {
					cancelEvent(evt)
					if ($.ajp.resizable.mouse.down) {
						var dx = evt.clientX - $.ajp.resizable.mouse.x;
						var dy = evt.clientY - $.ajp.resizable.mouse.y;
						if ($.ajp.resizable.current) {
							$.ajp.resizable.current.scale(dx, dy)
						}
						//document.selectionStart = 0;
						//document.selectionEnd = 0;
					}
				})
				$.ajp.resizable.installed = true;
			}

			return this.each(function(i, el) {

				var api = {

					target: $(el),
					enabled: true,

					init: function () {

						var t = this.target;

						var id = t.attr('id');
						if ($.ajp.resizable.elements[id]) {
							$.ajp.resizable.elements[id].enable();
							return;
						}

						$.ajp.resizable.elements[id] = this;

						var c = $(document.createElement('div'));
						var z = t.css('z-index').replace(/[^0-9]/g, '');
						z = (z ? parseFloat(z) : 0);
						this.control = c
							.addClass('resizable-control')
							.appendTo('body')
							.css({
								'z-index': z + 1,
								'position': 'absolute',
								'display': 'none'
							})
						;
						var ctx = this;
						t.mouseover(function (evt) {
							if (ctx.enabled) ctx.show()
						}).mouseout(function (evt) {
							ctx.hide()
						})
						c.mouseover(function (evt) {
							if (ctx.enabled) ctx.show()
						}).mouseout(function (evt) {
							ctx.hide()
						})
					},

					disable: function () { this.enabled = false; this.hide() },

					enable: function () { this.enabled = true },

					hide: function () {
						this.target.removeClass('resizable-active')
						this.control.css({ display: 'none' })
					},

					show: function () {
						var t = this.target;
						var c = this.control;
						var o = t.offset();
						$('.resizable-control').css({ display: 'none' })
						t.addClass('resizable-active')
						c.css({
							display: 'block',
							left: '' + (o.left + t.outerWidth() - c.outerWidth()) + 'px',
							top: '' + (o.top + t.outerHeight() - c.outerHeight()) + 'px'
						})
						$.ajp.resizable.current = this;
					},

					scale: function (dx, dy) {

						if (!this.enabled) return;

						if (options.proportional) {
							if (dx > dy) {
								var s = (this.width + dx) / this.width;
								dy = this.height * s - this.height;
							} else {
								var s = (this.height + dy) / this.height;
								dx = this.width * s - this.width;
							}
						}

						var newWidth = parseInt(this.width + dx)
						var newHeight = parseInt(this.height + dy)

						if (newWidth >= options.minWidth && newHeight >= options.minHeight) {
							this.target
								.width('' + newWidth + 'px')
								.height('' + newHeight + 'px')
						}

						//document.selectionStart = 0;
						//document.selectionEnd = 0;
						this.show()
					}
				}

				if (!el.id)
					el.id = randomId('resizable-autogenerated-id-', 32)

				api.init();
			})
		}
	})

})(jQuery);
