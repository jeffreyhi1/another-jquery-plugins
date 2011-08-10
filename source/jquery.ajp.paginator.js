/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.paginator = { version: '0.4pa', required: ['scrollable'] }

	$.fn.extend({

		ajp$paginator: function (options) {

			var defaults = {
				current: 1,
				portion: 5,
				total: 10,
				baseUrl: './?page=%page%',

				duration: 'fast',
				easing: 'linear',
				mousewheel: false,
				orientation: 'horizontal',
				prev: 'prev',
				next: 'next'
			}

			var options = $.extend(defaults, options);

			return this.each(function(i, el) {
				var currentItem = 0;
				var html = ''
				+ '<a class="prev' + (options.current > 1 ? '" href="' + options.baseUrl.replace(/\%page\%/g, options.current - 1) + '"' : ' disabled"') + '>' + options.prev + '</a>'
				+ '<div class="ajp-scrollable">'
				+ '	<ul>'
				for (var p = 1, i = 0; p <= options.total; i ++) {
					html += '<li>'
					for (var j = 0; j < options.portion; p ++, j ++) {
						html += '<a href="' + options.baseUrl.replace(/\%page\%/g, p) + '"' + (p == options.current ? ' class="selected"' : (p > options.total ? ' class="disabled"' : '')) + '>' + p + '</a>'
						if (p == options.current)
							currentItem = i
					}
					html += '</li>'
				}
				html += ''
				+ '	</ul>'
				+ '</div>'
				+ '<a class="next' + (options.current < options.total ? '" href="' + options.baseUrl.replace(/\%page\%/g, options.current + 1) + '"' : ' disabled"') + '>' + options.next + '</a>'
				$(el).html(html).ajp$scrollable({
					duration: options.duration,
					easing: options.easing,
					mousewheel: options.mousewheel,
					orientation: options.orientation,
					prev: '.prev',
					next: '.next',
					current: currentItem
				})
			})
		}
	})

})(jQuery);
