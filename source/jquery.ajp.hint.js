/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.hint = { version: '0.3pa' }

	$.fn.extend({

		hint: function (options) {

			var defaults = {
			}

			var options = $.extend(defaults, options);

			return this.focusin(function () {
				var $fld = $(this)
				if (!$fld.data('hint') || $fld.data('hint') == $fld.val()) {
					var hint = $fld.val()
					$fld.data('hint', hint)
					$fld[0].value = ''
					if (!$fld.attr('title'))
						$fld.attr('title', hint)
				}
				$fld.removeClass('hint')
			}).focusout(function () {
				var $fld = $(this)
				if (!$fld.val()) {
					$fld.addClass('hint')
					$fld.val($fld.data('hint'))
					if ($fld.attr('title') == $fld.data('hint'))
						$fld[0].title = ''
				}
			})
		},

		hintVal: function (options) {

			var defaults = {
				ignoreHint: true
			}

			var options = $.extend(defaults, options);

			var $fld = $(this).eq(0)
			var val = $fld.val()
			if (options.ignoreHint && (!$fld.data('hint') || $fld.data('hint') == val))
				return ''
			return val
		}

	})

})(jQuery);
