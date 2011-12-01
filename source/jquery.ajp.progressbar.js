/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.progressbar = { version: '0.2pa', installed: false, controls: [], serial: 1 }

	$.fn.extend({

		ajp$progressbar: function (options) {

			var defaults = {
				min: 0,
				max: 100,
				value: 0.0,
				text: true,
				duration: 'fast',
				easing: 'swing',
				onchange: function (val, $el) { }
			}

			var opts = $.extend(defaults, options);
			if (opts.min > opts.max) {
				var m = opts.min
				opts.min = opts.max
				opts.max = m
			}
			if (opts.value < opts.min) opts.value = opts.min
			if (opts.value > opts.max) opts.value = opts.max

			if (!$.ajp.progressbar.installed) {
				var savedVal = $.fn.val
				$.fn.val = function (value) {
					if ($(this).data('ajp-progressbar-id')) {
						var ctx = $(this).ajp$progressbarContext()
						return (value === undefined ? ctx.get() : ctx.set(value))
					}
					return savedVal.apply(this, arguments)
				}
				$.ajp.progressbar.installed = true
			}

			return this.each(function(i, el) {

				var $el = $(el)
				var $fill = $('<div class="fill"></div>').css({
					width: '0px',
					height: '' + $el.outerHeight() + 'px'
				})

				$el.append($fill)

				function setValue(value, raiseEvent) {
					var w = $el.outerWidth()
					var fw = ((value - opts.min) * w) / (opts.max - opts.min)
					$fill.stop(true, true).animate({
						width: '' + fw + 'px'
					}, opts.duration, opts.easing)
					$el.data('ajp-progressbar-value', value)
					if (raiseEvent === undefined || raiseEvent)
						opts.onchange(value, $el)
				}

				var id = $.ajp.progressbar.serial ++
				$.ajp.progressbar.controls[id] = setValue
				$el.data('ajp-progressbar-id', id)

				var dataVal = $el.data('ajp-progressbar-value')
				setValue(dataVal !== undefined ? dataVal : opts.value)
			})
		},

		ajp$progressbarContext: function () {
			var ctx = this
			return {
				set: function (value, raiseEvent) {
					ctx.each(function () {
						var f = $.ajp.progressbar.controls[$(this).data('ajp-progressbar-id')]
						if (f) f(value, raiseEvent)
					})
				},
				get: function () {
					return ctx.data('ajp-progressbar-value')
				}
			}
		}
	})

})(jQuery);
