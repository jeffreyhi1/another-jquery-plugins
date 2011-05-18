(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.PLUGIN_NAME = { version: '0.1pa' }

	$.fn.extend({

		PLUGIN_NAME: function (options) {

			var defaults = {
			}

			options = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {

					cancelEvent: function (evt) {
						if (!evt) return;
						evt.cancelBubble = true;
						if (evt.stopPropagation) {
							evt.stopPropagation();
							evt.preventDefault();
						}
					},

					init: function () {
					}
				}

				api.init()
			})
		}
	})

})(jQuery)
