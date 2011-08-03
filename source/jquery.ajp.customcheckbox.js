/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.customCheckbox = { version: '0.5pa', installed: false }

	$.fn.extend({

		customCheckbox: function (options) {

			var defaults = {
				checkboxHeight: 25,
				radioHeight: 25
			}

			var opts = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {
					init: function () {
						var ctx = this
						if (el.type == 'checkbox' || el.type == 'radio') {
							$(el).css('display', 'none').addClass('ajp-customcheckbox')
							var $span = $('<span class="ajp-customcheckbox-' + el.type + '"></span>')
							$(el).before($span).change(function () { api.clear() }).change()
							if (!el.getAttribute('disabled')) {
								$span[0].onmousedown = this.pushed
								$span[0].onmouseup = this.check
							} else {
								$span.addClass('ajp-customcheckbox-disabled')
							}
						}
						if (!$.ajp.customCheckbox.installed) {
							$(document).mouseup(function () {
								ctx.clear()
							})
							$.ajp.customCheckbox.installed = true
						}
					},
					pushed: function() {
						var p, e = this.nextSibling
						if (e.checked == true && e.type == 'checkbox') {
							p = '0 -' + (opts.checkboxHeight * 3) + 'px'
						} else if (e.checked == true && e.type == "radio") {
							p = '0 -' + (opts.radioHeight * 3) + 'px'
						} else if (e.checked != true && e.type == "checkbox") {
							p = '0 -' + opts.checkboxHeight + 'px'
						} else {
							p = '0 -' + opts.radioHeight + 'px'
						}
						$(this).css('background-position', p)
					},
					check: function() {
						var e = this.nextSibling
						if (e.checked == true && e.type == 'checkbox') {
							$(this).css('background-position', '0 0')
							e.checked = false
						} else {
							if (e.type == 'checkbox') {
								$(this).css('background-position', '0 -' + (opts.checkboxHeight * 2) + 'px')
							} else {
								$('input[name=' + e.name + ']').css('background-position', '0 0')
								$(this).css('background-position', '0 -' + (opts.radioHeight * 2) + 'px')
							}
							e.checked = true
						}
						$(e).change()
					},
					clear: function() {
						$('input.ajp-customcheckbox').each(function () {
							$(this).prev().css('background-position',
								(this.checked ?
									'0 -' + ((this.type == 'radio' ? opts.radioHeight : opts.checkboxHeight) * 2) + 'px'
								: '0 0')
							)
						})
					}
				}

				api.init()
			})
		}
	})

})(jQuery);
