/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.zippy = { version: '0.1pa', required: ['autoheight'] }

	$.fn.extend({

		ajp$zippy: function (options) {

			var opts, defaults = {
				duration: 300,
				easing: 'linear',
				show: function ($c, $a) {
					$a.data('ajp-zippy-ready', false)
					$c.css({ visibility: 'visible' }).ajp$autoheight({
						duration: opts.duration,
						easing: opts.easing,
						oncomplete: function () {
							$a.data('ajp-zippy-ready', true)
						}
					})
				},
				hide: function ($c, $a) {
					$a.data('ajp-zippy-ready', false)
					$c.animate({ height: 0 }, opts.duration, opts.easing, function () {
						$c.css({ visibility: 'hidden' })
						$a.data('ajp-zippy-ready', true)
					})
				}
			}

			opts = $.extend(defaults, options);

			return this.each(function(i, el) {
				var $a = $(el), $c = $a.next()
				$a.click(function (evt) {
					if ($a.data('ajp-zippy-ready')) {
						if ($a.hasClass('ajp-zippy-collapsed')) {
							$a.removeClass('ajp-zippy-collapsed')
								.addClass('ajp-zippy-expanded')
							opts.show($c, $a)
						} else {
							$a.removeClass('ajp-zippy-expanded')
								.addClass('ajp-zippy-collapsed')
							opts.hide($c, $a)
						}
					}
					evt.preventDefault()
					evt.stopPropagation()
					return false
				})
				$a.data('ajp-zippy-ready', true)
				$c.css({ visibility: 'hidden', 'height': 0 })
			})
		}
	})

})(jQuery);
