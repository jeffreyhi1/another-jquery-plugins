/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.slider = { version: '0.2pa', installed: false, controls: [], serial: 1 }

	$.fn.extend({

		ajp$slider: function (options) {

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

			if (!$.ajp.slider.installed) {
				var savedVal = $.fn.val
				$.fn.val = function (value) {
					if (typeof $(this).data('ajp-slider-value') != 'undefined') {
						var ctx = $(this).ajp$sliderContext()
						return (typeof value == 'undefined' ? ctx.get() : ctx.set(value))
					}
					return savedVal.call(this, value)
				}
				$.ajp.slider.installed = true
			}

			return this.each(function(i, el) {

				var $el = $(el)
				var $sl = $('<div class="control"></div>')
				var $lln = $('<div class="left-line"></div>')
				var $ln = $('<div class="line"></div>')

				$el.append($ln)
				$el.append($sl)
				$el.append($lln)

				function shift(dx, raiseEvent) {
					var w = $ln.outerWidth() - $sl.outerWidth()
					var l = parseInt($sl.css('left')) + dx
					if (l < 0) l = 0
					if (l > w) l = w
					$lln.css('width', l.toString() + 'px')
					$sl.css('left', l.toString() + 'px')
					var val = opts.min + (l/w) * (opts.max - opts.min)
					$el.data('ajp-slider-value', val)
					if (typeof raiseEvent == 'undefined' || raiseEvent)
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

				function setValue(value, raiseEvent) {
					var w = $ln.outerWidth() - $sl.outerWidth()
					var dx = ((value - opts.min) * w) / (opts.max - opts.min)
					$sl.css('left', 0)
					shift(dx, raiseEvent)
				}

				var id = $.ajp.slider.serial ++
				$.ajp.slider.controls[id] = setValue
				$el.data('ajp-slider-id', id)

				setValue(opts.value)
			})
		},

		ajp$sliderContext: function () {
			var ctx = this
			return {
				set: function (value, raiseEvent) {
					ctx.each(function () {
						var f = $.ajp.slider.controls[$(this).data('ajp-slider-id')]
						if (f) f(value, raiseEvent)
					})
				},
				get: function () {
					return ctx.data('ajp-slider-value')
				}
			}
		}
	})

})(jQuery);
