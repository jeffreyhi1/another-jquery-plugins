/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.slider = { version: '0.5pa', installed: false, controls: [], serial: 1 }

	$.fn.extend({

		ajp$slider: function (options) {

			var defaults = {
				min: 0.0,
				max: 1.0,
				value: 0.0,
				orientation: 'horizontal',
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
					if ($(this).data('ajp-slider-id')) {
						var ctx = $(this).ajp$sliderContext()
						return (value === undefined ? ctx.get() : ctx.set(value))
					}
					return savedVal.apply(this, arguments)
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

				function shiftHorizontal(dx, raiseEvent) {
					var w = $ln.outerWidth() - $sl.outerWidth()
					var l = parseInt($sl.css('left')) + dx
					if (l < 0) l = 0
					if (l > w) l = w
					$lln.css('width', l.toString() + 'px')
					$sl.css('left', l.toString() + 'px')
					var val = opts.min + (l/w) * (opts.max - opts.min)
					$el.data('ajp-slider-value', val)
					if (raiseEvent === undefined || raiseEvent)
						opts.onchange(val, $el)
				}

				function shiftVertical(dy, raiseEvent) {
					var h = $el.height() - $sl.outerHeight()
					var t = parseInt($sl.css('top')) + dy
					if (t < 0) t = 0
					if (t > h) t = h
					$lln.css('height', t.toString() + 'px')
					$sl.css('top', t.toString() + 'px')
					var val = opts.min + (t/h) * (opts.max - opts.min)
					$el.data('ajp-slider-value', val)
					if (raiseEvent === undefined || raiseEvent)
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
						if (opts.orientation == 'horizontal') {
							shiftHorizontal(dx)
						} else {
							shiftVertical(dy)
						}
						mouse.x = evt.clientX
						mouse.y = evt.clientY
					}
				})

				function setValue(value, raiseEvent) {
					if (opts.orientation == 'horizontal') {
						var w = $ln.outerWidth() - $sl.outerWidth()
						var dx = ((value - opts.min) * w) / (opts.max - opts.min)
						$sl.css('left', 0)
						shiftHorizontal(dx, raiseEvent)
					} else {
						var h = $el.height() - $sl.outerHeight()
						var dy = ((value - opts.min) * h) / (opts.max - opts.min)
						$sl.css('top', 0)
						shiftVertical(dy, raiseEvent)
					}
				}

				var id = $.ajp.slider.serial ++
				$.ajp.slider.controls[id] = { 'setValue': setValue, 'opts': opts }
				$el.data('ajp-slider-id', id)

				setValue(opts.value)
			})
		},

		ajp$sliderContext: function () {
			var ctx = this
			return {
				set: function (value, raiseEvent) {
					ctx.each(function () {
						var c = $.ajp.slider.controls[$(this).data('ajp-slider-id')]
						if (c) c.setValue(value, raiseEvent)
					})
				},
				get: function () {
					var c = $.ajp.slider.controls[$(ctx).data('ajp-slider-id')]
					if (c) {
						var val = $(ctx).data('ajp-slider-value')
						return (val === undefined ? c.opts.value : val)
					}
					return undefined
				}
			}
		}
	})

})(jQuery);
