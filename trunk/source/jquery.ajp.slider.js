/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.slider = { version: '0.1pa' }

	$.fn.extend({

		slider: function (options) {

			var defaults = {
				min: 0.0,
				max: 1.0,
				value: 0.0,
				onchange: function (val, $slider) { }
			}

			var opts = $.extend(defaults, options);
			if (opts.min > opts.max) {
				var m = opts.min
				opts.min = opts.max
				opts.max = m
			}
			if (opts.value < opts.min) opts.value = opts.min
			if (opts.value > opts.max) opts.value = opts.max

			return this.each(function(i, el) {

				var $el = $(el)
				var $sl = $('<div class="control"></div>')
				var $ln = $('<div class="line"></div>')

				$el.append($ln)
				$el.append($sl)

				function shift(dx) {
					var w = $ln.outerWidth() - $sl.outerWidth()
					var l = parseInt($sl.css('left')) + dx
					if (l < 0) l = 0
					if (l > w) l = w
					$sl.css('left', l.toString() + 'px')
					var val = opts.min + (l/w) * (opts.max - opts.min)
					opts.onchange(val, $el)
				}

				var mouse = { x: 0, y: 0, down: false }
				var root = $('html')[0]

				$sl.mousedown(function (evt) {
					mouse.down = true
					mouse.x = evt.clientX
					mouse.y = evt.clientY
					mouse.sel = root.onselectstart
					root.onselectstart = function () { return false }
				})
				$(document).mouseup(function (evt) {
					mouse.down = false
					mouse.x = evt.clientX
					mouse.y = evt.clientY
					root.onselectstart = mouse.sel
				}).mousemove(function (evt) {
					if (mouse.down) {
						var dx = evt.clientX - mouse.x 
						var dy = evt.clientY - mouse.y
						shift(dx)
						mouse.x = evt.clientX
						mouse.y = evt.clientY
					}
				})

				var w = $ln.outerWidth() - $sl.outerWidth()
				var dx = ((opts.value - opts.min) * w) / (opts.max - opts.min)
				shift(dx)
			})
		}
	})

})(jQuery);
