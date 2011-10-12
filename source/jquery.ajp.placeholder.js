/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.placeholder = { version: '0.6pa', installed: false }

	$.fn.extend({

		ajp$placeholder: function (options) {

			var defaults = {
			}

			var opts = $.extend(defaults, options);

			if (!$.ajp.placeholder.installed) {
				var savedVal = $.fn.val
				$.fn.val = function (value) {
					if (typeof value === undefined)
						return ($(this).hasClass('ajp-placeholder') ? '' : savedVal.apply(this))
					if ($(this).hasClass('ajp-placeholder') && value != $(this).data('ajp-placeholder'))
						$(this).removeClass('ajp-placeholder')
					return savedVal.call(this, value)
				}
				$.ajp.placeholder.installed = true
			}

			return this.each(function () {

				var $el = $(this)
				var info = ($el.attr('placeholder') ? $el.attr('placeholder') : $el.data('ajp-placeholder'))

				$el.removeAttr('placeholder')
				$el.data('ajp-placeholder', info)
				$el.val(info)

				if (!$el.hasClass('ajp-placeholder'))
					$el.addClass('ajp-placeholder')

			}).focusin(function () {

				var $el = $(this)
				var info = $el.data('ajp-placeholder')

				if ($el.hasClass('ajp-placeholder') && this.value == info) {
					this.value = ''
					$el.removeClass('ajp-placeholder')
					if (!$el.attr('title')) {
						$el.attr('title', info)
						$el.data('ajp-placeholder-title', 1)
					}
				}

			}).focusout(function () {

				var $el = $(this)

				if (this.value == '') {
					var info = $el.data('ajp-placeholder')
					$el.addClass('ajp-placeholder')
					$el.val(info)
					if ($el.data('ajp-placeholder-title')) {
						$el.attr('title', '')
						$el.data('ajp-placeholder-title', 0)
					}
				}
			})
		}
	})

})(jQuery);
