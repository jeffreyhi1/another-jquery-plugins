(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.tagscloud = { version: '0.1pa' }

	$.fn.extend({

		tagscloud: function (options) {

			var defaults = {

				tags: [],

				loPerc: 100,
				hiPerc: 150
			}

			options = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {

					init: function () {
						var t = (typeof options.tags === 'function' ? options.tags(el) : options.tags)
						var _min = 0;
						var _max = 0;
						for (var i = 0; i < t.length; i ++) {
							var c = t[i].weight;
							_min = (c > _min) ? _min : c;
							_max = (c < _max) ? _max : c;
						}
						var _m = (options.hiPerc - options.loPerc) / (_max - _min);
						$(el).empty();
						for (var i = 0; i < t.length; i ++)
							$(el).append('<a' + (t[i].href ? ' href="' + t[i].href + '"' : '')
								+ ' title="' + (t[i].title ? t[i].title : t[i].weight) + '" style="font-size: '
								+ (options.loPerc + ((_max - (_max - (t[i].weight - _min))) * _m))
								+ '%">' + t[i].tag + '</a> ')
					}
				}

				api.init()
			})
		}
	})

})(jQuery)
