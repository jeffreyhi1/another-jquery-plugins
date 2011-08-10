/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.tagscloud = { version: '0.2pa' }

	$.fn.extend({

		ajp$tagscloud: function (options) {

			var defaults = {

				tags: [],

				loPerc: 100,
				hiPerc: 150
			}

			var opts = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {

					init: function () {
						var t = (typeof opts.tags === 'function' ? opts.tags(el) : opts.tags)
						var _min = 0;
						var _max = 0;
						for (var i = 0; i < t.length; i ++) {
							var c = t[i].weight;
							_min = (c > _min) ? _min : c;
							_max = (c < _max) ? _max : c;
						}
						var _m = (opts.hiPerc - opts.loPerc) / (_max - _min);
						$(el).empty();
						for (var i = 0; i < t.length; i ++)
							$(el).append('<a' + (t[i].href ? ' href="' + t[i].href + '"' : '')
								+ ' title="' + (t[i].title ? t[i].title : t[i].weight) + '" style="font-size: '
								+ (opts.loPerc + ((_max - (_max - (t[i].weight - _min))) * _m))
								+ '%">' + t[i].tag + '</a> ')
					}
				}

				api.init()
			})
		}
	})

})(jQuery);
