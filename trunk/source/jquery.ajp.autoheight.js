/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.autoHeight = { version: '0.1pa' }

	$.fn.extend({

		autoHeight: function (options) {

			var defaults = {
				effect: function ($el, newHeight, oldHeight) {
					$el.animate({ height: newHeight + 'px' }, 'slow', 'linear')
				}
			}

			var opts = $.extend(defaults, options);

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
