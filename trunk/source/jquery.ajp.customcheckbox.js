/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.customCheckbox = { version: '0.6pa' }

	$.fn.extend({

		customCheckbox: function (options) {

			var defaults = {
				checkboxHeight: 13,
				radioHeight: 13
			}

			var opts = $.extend(defaults, options);

			return this.each(function(i, el) {
				if (el.type == 'checkbox' || el.type == 'radio') {
					var height = (el.type == 'radio' ? opts.radioHeight : opts.checkboxHeight)
					var $span = $('<span class="ajp-customcheckbox-' + el.type + '"></span>')
					$(el).css('display', 'none')
						.addClass('ajp-customcheckbox')
						.before($span)
						.change(function () {
							if (el.disabled && !$span.hasClass('ajp-customcheckbox-disabled'))
								$span.addClass('ajp-customcheckbox-disabled')
							if (!el.disabled && $span.hasClass('ajp-customcheckbox-disabled'))
								$span.removeClass('ajp-customcheckbox-disabled')
							if (el.type == 'radio' && el.name)
								$('input[name=' + el.name + ']').each(function () {
									$(this).prev().css('background-position', '0 ' + (this.checked ? -height * 2 : 0) + 'px')
								})
							$span.css('background-position', '0 ' + (el.checked ? -height * 2 : 0) + 'px')
						})
						.change()
					$span.mousedown(function () {
						if (!el.disabled)
							$(this).css('background-position', '0 -' + (el.checked ? height * 3 : height) + 'px')
					})
					$span.mouseup(function () {
						if (!el.disabled) {
							el.checked = !el.checked
							$(el).change()
						}
					})
				}
			})
		}
	})

})(jQuery);
