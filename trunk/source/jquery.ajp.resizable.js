/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }

	$.ajp.resizable = {
		version: '0.7pa',
		installed: false,
		serial: 1,
		current: undefined,
		elements: {},
		mouse: {}
	}

	$.fn.extend({

		ajp$unresizable: function () {
			return this.each(function(i, el) {
				var id = $(el).data('ajp-resizable-id');
				if (id && $.ajp.resizable.elements[id]) {
					$.ajp.resizable.elements[id].disable()
				}
			})
		},

		ajp$resizable: function (options) {

			var defaults = {
				proportional: false,
				minWidth: 40,
				minHeight: 40
			}

			var options = $.extend(defaults, options);

			var cancelEvent = function (evt) {
				if (!evt) return;
				evt.cancelBubble = true;
				if (evt.stopPropagation) {
					evt.stopPropagation();
					evt.preventDefault();
				}
			}

			var root = $('html')[0]

			if (!$.ajp.resizable.installed) {
				$(document).mousedown(function (evt) {
					if ($.ajp.resizable.current) {
						$.ajp.resizable.mouse.down = true;
						$.ajp.resizable.mouse.x = evt.clientX;
						$.ajp.resizable.mouse.y = evt.clientY;
						$.ajp.resizable.current.width = $.ajp.resizable.current.target.outerWidth()
						$.ajp.resizable.current.height = $.ajp.resizable.current.target.outerHeight()
						$.ajp.resizable.mouse.sel = root.onselectstart
						root.onselectstart = function () { return false }
					}
				}).mouseup(function (evt) {
					cancelEvent(evt)
					$.ajp.resizable.mouse.down = false;
					$.ajp.resizable.current = undefined;
					root.onselectstart = $.ajp.resizable.mouse.sel
				}).mousemove(function (evt) {
					cancelEvent(evt)
					if ($.ajp.resizable.mouse.down) {
						var dx = evt.clientX - $.ajp.resizable.mouse.x;
						var dy = evt.clientY - $.ajp.resizable.mouse.y;
						if ($.ajp.resizable.current) {
							$.ajp.resizable.current.scale(dx, dy)
						}
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

						var id = t.data('ajp-resizable-id');
						if ($.ajp.resizable.elements[id]) {
							$.ajp.resizable.elements[id].enable();
							return;
						}

						$.ajp.resizable.elements[id] = this;

						var c = $(document.createElement('div'));
						var z = t.css('z-index').replace(/[^0-9]/g, '');
						z = (z ? parseFloat(z) : 0);
						this.control = c
							.addClass('ajp-resizable-control')
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
						this.target.removeClass('ajp-resizable-active')
						this.control.css({ display: 'none' })
					},

					show: function () {
						var t = this.target;
						var c = this.control;
						var o = t.offset();
						$('.ajp-resizable-control').css({ display: 'none' })
						t.addClass('ajp-resizable-active')
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

						this.show()
					}
				}

				var idx = $.ajp.resizable.serial ++
				$(el).data('ajp-resizable-id', idx)

				api.init();
			})
		}
	})

})(jQuery);