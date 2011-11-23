/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.popup = { version: '0.2pa', serial: 1, contexts: { }, docEvents: { } }

	$.fn.extend({

		ajp$popup: function (options) {

			var defaults = {
				action: 'click', // click or hover
				popup: '.popup', // selector of function
				show: function ($popup, $el) {
					$el.addClass('ajp-popup-visible')
					$popup.css({ visibility: 'visible' })
				},
				hide: function ($popup, $el) {
					$el.removeClass('ajp-popup-visible')
					$popup.css({ visibility: 'hidden' })
				}
				// beforeShow: function ($popup, $el) { ... }
				// beforeHide: function ($popup, $el) { ... }
				// afterShow: function ($popup, $el) { ... }
				// afterHide: function ($popup, $el) { ... }
			}

			var opts = $.extend(defaults, options);

			if (opts.action == 'click' && !$.ajp.popup.docEvents['click']) {

				function hideAll() {
					for (var id in $.ajp.popup.contexts)
						$.ajp.popup.contexts[id].hide()
				}

				$(document).find('body:eq(0)').keydown(function (evt) {
					if (evt.keyCode == 27)
						hideAll()
				})

				$(document).bind('click', function (evt) {
					for (var id in $.ajp.popup.contexts) {
						var ctx = $.ajp.popup.contexts[id]
						var $popup = ctx.getPopup()
						if (!$popup.data('ajp-popup-opening') && $popup.css('visibility') == 'visible')
							ctx.hide()
						$popup.data('ajp-popup-opening', false)
					}
				})

				$.ajp.popup.docEvents['click'] = true
			}

			return this.each(function () {

				var $el = $(this)
				var $popup = (typeof opts.popup == 'function' ? opts.popup($el) : $el.find(opts.popup))

				var ctx = {
					getElement: function () {
						return $el
					},
					getPopup: function () {
						return $popup
					},
					show: function () {
						if ($el.hasClass('ajp-disabled'))
							return;
						if (opts.beforeShow)
							opts.beforeShow($popup, $el)
						opts.show($popup, $el)
						if (opts.afterShow)
							opts.afterShow($popup, $el)
					},
					hide: function () {
						if (opts.beforeHide)
							opts.beforeHide($popup, $el)
						opts.hide($popup, $el)
						if (opts.afterHide)
							opts.afterHide($popup, $el)
					}
				}

				var id = $.ajp.popup.serial ++
				$el.data('ajp-popup-id', id)
				$.ajp.popup.contexts[id] = ctx

				if (opts.action == 'click') {

					$el.bind('click', function () {
						if ($popup.css('visibility') == 'visible') {
							$popup.data('ajp-popup-opening', false)
						} else {
							$popup.data('ajp-popup-opening', true)
							ctx.show()
						}
					})

				} else if (opts.action == 'hover') {

					$el.hover(function () {
						ctx.show()
					}, function () {
						ctx.hide()
					})
				}
			})
		},

		ajp$popupContext: function () {
			return $.ajp.popup.contexts[this.data('ajp-popup-id')]
		}
	})

})(jQuery);
