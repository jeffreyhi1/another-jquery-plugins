/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.datepicker = { version: '0.3pa', initialized: false }

	$.fn.extend({

		ajp$datepicker: function (options) {

			var defaults = {

				dateFormat: 'yyyy-mm-dd',
				value: function ($el) { var d = $el.val(); if (!d) d = new Date(); return d },
				show: function ($el, $ctl) {
					$ctl.css({
						visibility: 'visible',
						left: '' + $el.offset().left + 'px',
						top: '' + ($el.offset().top + $el.outerHeight()) + 'px'
					})
				},
				hide: function ($el, $ctl) {
					$ctl.css({
						visibility: 'hidden'
					})
				},
				update: function ($el, date) {
					$el.val(format(opts.dateFormat, date))
				},

				months: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
				monthsShort: [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ],
				days: [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ]
			}

			var opts = $.extend(defaults, options);

			function format(fmt, date) {
				var dateformat = {
					'd': function (d) { return d.getDate() },
					'dd': function (d) { var r = d.getDate(); return (r < 10 ? '0' + r : r) },
					'm': function (d) { return d.getMonth() + 1 },
					'mm': function (d) { var r = d.getMonth() + 1; return (r < 10 ? '0' + r : r) },
					'mmm': function (d) { return opts.monthsShort[d.getMonth()] },
					'mmmm': function (d) { return opts.months[d.getMonth()] },
					'yy': function (d) { var r = d.getYear() - 100; return (r < 10 ? '0' + r : r) },
					'yyyy': function (d) { return d.getYear() + 1900 }
				}
				var res = ''
				while (fmt.length > 0) {
					var m = fmt.match(/^(yyyy|yy|mmmm|mmm|mm|m|dd|d)(.*)$/, fmt)
					if (m) {
						res += dateformat[m[1]](date)
						fmt = m[2]
					} else {
						res += fmt.charAt(0)
						fmt = fmt.substr(1)
					}
				}
				return res
			}

			return this.each(function(i, el) {

				var $el = $(el)
				var yearShift = ($.browser.msie ? 0 : 1900)

				var $control = $( ''
					+ '<div class="ajp-datepicker">'
						+ '<div class="ajp-datepicker-header">'
							+ '<div class="ajp-datepicker-prev"></div>'
							+ '<div class="ajp-datepicker-month-name"></div>'
							+ '<div class="ajp-datepicker-next"></div>'
						+ '</div>'
						+ '<table class="ajp-datepicker-month">'
							+ '<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>'
						+ '</table>'
						+ '<div class="ajp-datepicker-footer"></div>'
					+ '</div>'
				).css({
					visibility: 'hidden',
					position: 'absolute'
				})

				$control.find('.ajp-datepicker-month > tbody > tr > th').each(function (day) {
					$(this).text(opts.days[day])
				})

				$('body').append($control)

				if (!$.ajp.datepicker.initialized) {
					$.ajp.datepicker.initialized = true
					$(document).find('body:eq(0)').keydown(function (evt) {
						if (evt.keyCode == 27)
							$('.ajp-datepicker').css({ visibility: 'hidden' })
					})
					$(document).find('body:eq(0)').mouseup(function (evt) {
						if (evt.button == ($.browser.msie ? 1 : 0)) $('.ajp-datepicker').each(function () {
							var $c = $(this)
							var vis = $c.css('visibility')
							$c.data('ajp-datepicker-visible', (vis == 'hidden' ? 'no' : 'yes'))
							$c.css({ visibility: 'hidden' })
						})
					})
				}

				function visualize(date) {
					$control.find('.ajp-datepicker-month-name').text('' + opts.months[date.getMonth()] + ', ' + (date.getYear() + yearShift))
					$control.find('.ajp-datepicker-month > tbody > tr').each(function (tr) { if (tr) $(this).remove() })
					var wdays = [ 6, 0, 1, 2, 3, 4, 5 ]
					var lastDay = new Date(date.getYear() + yearShift, date.getMonth() + 1, 0).getDate()
					var $tr = false
					for (var day = 1; day <= lastDay; day ++) {
						var wday = wdays[new Date(date.getYear() + yearShift, date.getMonth(), day).getDay()]
						if (!$tr) $tr = $('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
						$tr.find('td:eq(' + wday + ')').text(day).data('date', new Date(date.getYear() + yearShift, date.getMonth(), day))
						if (wday == 6) {
							$control.find('.ajp-datepicker-month > tbody > tr:last').after($tr)
							$tr = false
						}
					}
					if ($tr) $control.find('.ajp-datepicker-month > tbody > tr:last').after($tr)
					$control.data('visualized-date', date)
					$control.find('.ajp-datepicker-month > tbody > tr > td').click(function () {
						if ($(this).text()) {
							opts.update($el, new Date($(this).data('date')))
							opts.hide($el, $control)
						}
					})
				}

				$control.find('.ajp-datepicker-prev').click(function () {
					var date = new Date($control.data('visualized-date'))
					date = new Date(date.getYear() + yearShift, date.getMonth() - 1, 1)
					visualize(date)
				})

				$control.find('.ajp-datepicker-next').click(function () {
					var date = new Date($control.data('visualized-date'))
					date = new Date(date.getYear() + yearShift, date.getMonth() + 1, 1)
					visualize(date)
				})

				$el.attr('readonly', true).click(function () {
					var vis = ($control.data('ajp-datepicker-visible') == 'yes' ? 'hidden' : 'visible')
					if (vis == 'visible') {
						var d = (typeof opts.value == 'function' ? opts.value($el) : opts.value)
						if ($.browser.msie && /^\d+-\d+-\d+$/.test(d))
							d = d.replace(/-/g, '/')
						visualize(new Date(d))
						opts.show($el, $control)
					} else {
						opts.hide($el, $control)
					}
				})
			})
		}
	})

})(jQuery);
