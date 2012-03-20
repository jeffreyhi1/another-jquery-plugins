/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.autoheight = { version: '0.3pa' }

	$.fn.extend({

		ajp$autoheight: function (options) {

			var opts, defaults = {
				effect: function ($el, newHeight, oldHeight) {
					$el.animate({ height: newHeight + 'px' }, opts.duration, opts.easing, opts.oncomplete($el))
				},
				duration: 'slow',
				easing: 'linear',
				oncomplete: function ($el) { }
			}

			opts = $.extend(defaults, options);

			function reviewHeight() {
				return this.each(function(i, el) {
					var $el = $(el)
					var currentHeight = $el.outerHeight()
					$el.css({ height: 'auto' })
					var normalHeight = $el.outerHeight()
					$el.css({ height: currentHeight })
					opts.effect($el, normalHeight, currentHeight)
				})
			}

			return reviewHeight.apply(this)
		}
	})

})(jQuery);
