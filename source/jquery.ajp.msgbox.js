/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.msgbox = { version: '0.2pa', queue: [] }

	$.fn.extend({

		msgbox: function (text, options, handler) {

			var defaults = {
				type: 'info', // alert | confirm | info | error | prompt
				buttons: [
					{ value: 'OK' }
				],
				inputs: [
					{ type: 'text' }
				],
				background: '#000',
				opacity: 0.5,
				setIcon: function ($msgbox, icon) { $msgbox.find('.icon').addClass(icon) },
				setText: function ($msgbox, html) { $msgbox.find('.text').html(html) },
				addButton: function ($msgbox, $btn) { $msgbox.find('.buttons').append($btn) },
				template: function () { return $(''
					+ '<div class="ajp-msgbox">'
						+ '<div class="top"></div>'
						+ '<div class="middle">'
							+ '<div class="icon"></div>'
							+ '<div class="text"></div>'
							+ '<div class="clear"></div>'
						+ '</div>'
						+ '<div class="bottom">'
							+ '<div class="buttons"></div>'
						+ '</div>'
					+ '</div>'
					)
				},
				show: function ($msgbox, $shade) {
					$shade.css({ visibility: 'visible' })
					$msgbox.css({
						'margin-top': '-' + parseInt($msgbox.outerHeight() + parseInt(screen.height)).toString() + 'px',
						'margin-left': '-' + parseInt($msgbox.outerWidth() / 2).toString() + 'px',
						visibility: 'visible'
					})
					$msgbox.find('.text:eq(0) > .input:eq(0) > input:eq(0)').focus()
					$msgbox.animate({
						'margin-top': '-' + parseInt($msgbox.outerHeight() / 2).toString() + 'px'
					}, 'fast', 'swing')
				},
				notReady: function ($msgbox) {
					var d = 20
					$msgbox.css({
						'margin-left': '-' + parseInt($msgbox.outerWidth() / 2 - d).toString() + 'px',
						visibility: 'visible'
					}).animate({
						'margin-left': '-' + parseInt($msgbox.outerWidth() / 2 + d).toString() + 'px'
					}, 'fast', 'swing').animate({
						'margin-left': '-' + parseInt($msgbox.outerWidth() / 2 - d).toString() + 'px'
					}, 'fast', 'swing').animate({
						'margin-left': '-' + parseInt($msgbox.outerWidth() / 2).toString() + 'px'
					}, 'fast', 'swing')
				},
				hide: function ($msgbox, $shade) {
					$msgbox.css({ visibility: 'hidden' })
					$shade.css({ visibility: 'hidden' })
				}
			}

			var buttonDefaults = {
				type: 'submit', // submit | cancel
				value: 'OK'
			}

			var inputDefaults = {
				type: 'text',
				label: '',
				value: '',
				required: false
			}

			var opts = $.extend(defaults, options);

			if (!$.ajp.msgbox.shade) {
				$.ajp.msgbox.shade = $('<div class="ajp-msgbox-shade"></div>').css({
					background: opts.background,
					position: 'fixed',
					left: '0',
					top: '0',
					width: '100%',
					height: '100%',
					opacity: opts.opacity,
					visibility: 'hidden'
				})
				$.ajp.msgbox.shade.appendTo('body')
			}

			var $tmpl = (typeof opts.template == 'function' ? opts.template() : $(opts.template))
			$tmpl.data('ajp-msgbox-type', opts.type)
			opts.setIcon($tmpl, opts.type)
			if (opts.type == 'prompt') {
				$.each(opts.inputs, function () {
					var inp = $.extend(inputDefaults, this)
					text += (inp.label ? '<div class="label">' + inp.label + '</div>' : '')
						+ '<div class="input"><input type="' + inp.type + '" data-ajp-msgbox-required="' + (inp.required ? 'true' : 'false') + '"/></div>'
				})
			}
			opts.setText($tmpl, text)
			$.each(opts.buttons, function () {
				var btn = $.extend(buttonDefaults, this)
				var $btn = $('<button data-ajp-msgbox-type="' + btn.type + '"></button>').text(btn.value).click(function () {
					var res = []
					var $t = $.ajp.msgbox.queue.pop()
					var canceled = false
					var ready = true
					if ($tmpl.data('ajp-msgbox-type') == 'prompt') {
						var $empty = null
						$tmpl.find('.text > .input > input').each(function () {
							var $inp = $(this)
							var val = $inp.val()
							if (/^true$/i.test($inp.data('ajp-msgbox-required')) && val == '') {
								ready = false
								if (!$empty)
									$empty = $inp
							} else {
								res.push(val)
							}
						})
						if (/^cancel$/i.test($(this).data('ajp-msgbox-type'))) {
							ready = true
							canceled = true
						} else {
							if (ready == false && $empty)
								$empty.focus()
						}
					}
					if (ready) {
						opts.hide($tmpl, $.ajp.msgbox.shade)
						if (!canceled) {
							if (handler) {
								res.unshift($btn.text())
								handler.apply(handler, res)
							}
						} else {
							handler.apply(handler, [ false ])
						}
						if ($.ajp.msgbox.queue.length >= 1)
							opts.show($.ajp.msgbox.queue[$.ajp.msgbox.queue.length - 1], $.ajp.msgbox.shade)
					} else {
						opts.notReady($tmpl)
					}
				})
				opts.addButton($tmpl, $btn)
			})
			$tmpl.css({ position: 'fixed', top: '50%', left: '50%', visibility: 'hidden' }).appendTo('body')

			$.ajp.msgbox.queue.unshift($tmpl)
			if ($.ajp.msgbox.queue.length == 1)
				opts.show($.ajp.msgbox.queue[0], $.ajp.msgbox.shade)
		}
	})

})(jQuery);
