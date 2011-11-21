/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.colorpicker = { version: '0.3pa', required: ['popup'], controls: [], serial: 1 }

	$.fn.extend({

		ajp$colorpicker: function (options) {

			var defaults = {
				action: 'click',
				pallete: [
					['#e6b8af','#f4cccc','#fce5cd','#fff2cc','#d9ead3','#d0e0e3','#c9daf8','#cfe2f3','#d9d2e9','#ead1dc','#dd7e6b','#ea9999','#f9cb9c','#ffe599','#b6d7a8','#a2c4c9','#a4c2f4','#9fc5e8','#b4a7d6','#d5a6bd','#cc4125','#e06666','#f6b26b','#ffd966','#93c47d','#76a5af','#6d9eeb','#6fa8dc','#8e7cc3','#c27ba0','#a61c00','#cc0000','#e69138','#f1c232','#6aa84f','#45818e','#3c78d8','#3d85c6','#674ea7','#a64d79','#85200c','#990000','#b45f06','#bf9000','#38761d','#134f5c','#285bac','#0b5394','#351c75','#741b47','#5b0f00','#660000','#783f04','#7f6000','#274e13','#0c343d','#1c4587','#073763','#20124d','#4c1130'],
					['#000000','#434343','#666666','#999999','#b7b7b7','#cccccc','#d9d9d9','#efefef','#f3f3f3','#ffffff'],
					['#980000','#ff0000','#ff9900','#ffff00','#00ff00','#00ffff','#4a86e8','#0000ff','#9900ff','#ff00ff']
				],
				onchange: function (val, $el) { }
				// show: function ($cp, $el) { $cp.css({ visibility: 'visible' }) }
				// hide: function ($cp, $el) { $cp.css({ visibility: 'hidden' }) }
			}

			var opts = $.extend(defaults, options);

			return this.each(function(i, el) {

				var $el = $(el)
				var $cp = $('<div class="ajp-colorpicker"></div>')

				for (var i = 0; i < opts.pallete.length; i ++) {
					var $p = $('<div class="pallete"></div>')
					var p = opts.pallete[i]
					for (var j = 0; j < p.length; j ++)
						$('<div class="color"></div>').css({ 'background-color': p[j] }).attr('title', p[j]).appendTo($p)
					$('<div class="delimiter"></div>').appendTo($p)
					$p.appendTo($cp)
				}

				$cp.appendTo($el)

				$el.ajp$popup({
					action: opts.action,
					popup: function () { return $cp },
					show: opts.show,
					hide: opts.hide
				})

				$cp.find('.color').click(function (evt) {
					opts.onchange($(this).attr('title'), $el)
				})
			})
		}
	})

})(jQuery);
