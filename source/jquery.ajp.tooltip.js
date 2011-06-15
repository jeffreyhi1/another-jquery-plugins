/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.tooltip = { version: '0.1pa' }

	$.fn.extend({

		tooltip: function (options) {

			var defaults = {
				content: function ($e) {
					return $e.data('tooltip')
				},
				show: function ($t, x, y, $e) {
					$t.css({ display: 'block', left: x, top: y })
				},
				hide: function ($t, $e) {
					$t.css({ display: 'none' })
				}
			}

			var opts = $.extend(defaults, options);

			return this.each(function(i, el) {
				var $el = $(el)
				var c = (typeof opts.content == 'function' ? opts.content($el) : opts.content)
				var t = $('<div class="tooltip"><div class="top"></div><div class="middle"></div><div class="bottom"></div></div>').appendTo('body')
				t.css({
					position: 'absolute',
					left: 0,
					top: 0,
					display: 'none'
				}).find('.middle').html(c)
				$(el).hover(
					function () {
						var o = $el.offset()
						var h = t.outerHeight()
						var w = t.outerWidth()
						opts.show(t, o.left - (w - $el.outerWidth()) / 2, o.top - h, $el)
					},
					function () {
						opts.hide(t, $el)
					}
				)
			})
		}
	})

})(jQuery);
