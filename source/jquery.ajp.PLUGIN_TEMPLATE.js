/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.PLUGIN_NAME = { version: '0.1pa' }

	$.fn.extend({

		PLUGIN_NAME: function (options) {

			var defaults = {
			}

			var opts = $.extend(defaults, options);

			return this.each(function(i, el) {

			})
		}
	})

})(jQuery);
