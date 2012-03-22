/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.zippy = { version: '0.2pa' }

	$.fn.extend({

		ajp$zippy: function (options) {

			var opts, defaults = {
				event: 'click',
				duration: 'fast',
				easing: 'linear',
				show: function ($c, $a) {
					$a.data('ajp-zippy-ready', false)
					var h, $cc = $c.children('div:eq(0)'),
						pt = $cc.css('padding-top'),
						pb = $cc.css('padding-bottom'),
						hfix = (/^[\.0]+(px|em|pt)?$/.test(pt) && /^[\.0]+(px|em|pt)$/.test(pb))
					if (hfix) {
						h = $cc.css({
							'padding-top': '1px',
							'padding-bottom': '1px'
						}).outerHeight() - 2
						$cc.css({
							'padding-top': pt,
							'padding-bottom': pb
						})
					} else {
						h = $cc.outerHeight()
					}
					$c.scrollTop(h)
						.css({ visibility: 'visible' })
						.animate({
								height: '' + h + 'px',
								scrollTop: h
							},
							opts.duration,
							opts.easing,
							function () {
								$a.data('ajp-zippy-ready', true)
							}
						)
				},
				hide: function ($c, $a) {
					$a.data('ajp-zippy-ready', false)
					var h = $c.children('div:eq(0)').outerHeight()
					$c.scrollTop(h).animate({ height: 0, scrollTop: h }, opts.duration, opts.easing, function () {
						$c.css({ visibility: 'hidden' })
						$a.data('ajp-zippy-ready', true)
					})
				}
			}

			opts = $.extend(defaults, options);

			return this.each(function(i, el) {
				var $a = $(el), $c = $a.next()
				$a.bind(opts.event, function (evt) {
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
