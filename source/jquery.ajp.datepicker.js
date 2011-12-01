/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.datepicker = { version: '0.8pa', required: [ 'popup' ] }

	$.fn.extend({

		ajp$datepicker: function (options) {

			var defaults = {

				displayFormat: 'yyyy-mm-dd',
				valueFormat: 'yyyy-mm-dd',
				value: function ($el) { var d = $el.val(); if (!d) d = new Date(); return d },
				show: function ($ctl, $el) {
					$ctl.css({
						visibility: 'visible',
						left: '' + $el.offset().left + 'px',
						top: '' + ($el.offset().top + $el.outerHeight()) + 'px'
					})
				},
				hide: function ($ctl, $el) {
					$ctl.css({
						visibility: 'hidden'
					})
				},
				update: function ($el, $vel, date) {
					$vel.val(formatDate(opts.displayFormat, date))
					$el.val(formatDate(opts.valueFormat, date)).change()
				},

				months: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
				monthsFmt: [ 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря' ],
				monthsShort: [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ],
				days: [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ]
			}

			var opts = $.extend(defaults, options)

			function indexOf(v) {
				for(var i = 0; i < this.length; i++)
					if (this[i] == v)
						return i
				return -1
			}

			if ($.browser.msie && !opts.months.indexOf)
				Array.prototype.indexOf = indexOf

			function formatDate(fmt, date) {
				var dateformat = {
					'd': function (d) { return d.getDate() },
					'dd': function (d) { var r = d.getDate(); return (r < 10 ? '0' + r : r) },
					'm': function (d) { return d.getMonth() + 1 },
					'mm': function (d) { var r = d.getMonth() + 1; return (r < 10 ? '0' + r : r) },
					'mmm': function (d) { return opts.monthsShort[d.getMonth()] },
					'mmmm': function (d) { return opts.monthsFmt[d.getMonth()] },
					'yy': function (d) { var r = d.getYear() - ($.browser.msie ? 2000 : 100); return (r < 10 ? '0' + r : r) },
					'yyyy': function (d) { return d.getYear() + ($.browser.msie ? 0 : 1900) }
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

			function parseDate(fmt, s) {
				function pInt(v) { return parseInt(v.replace(/^0+/, '')) }
				function pYear(v) { return pInt(v) + 2000 }
				function pMonthShort(v) { return opts.monthsShort.indexOf(v) + 1 }
				function pMonth(v) { return opts.monthsFmt.indexOf(v) + 1 }
				function parser(rx, d, fld, p) {
					var m = (typeof d.src == 'string' ? d.src : '').match(rx)
					d.src = (m ? m[2] : '')
					d[fld] = (m ? p(m[1]) : 0)
				}
				var dateformat = {
					'd': function (d) { parser(/^(\d\d?)(.*)/, d, 'day', pInt) },
					'dd': function (d) { parser(/^(\d\d)(.*)/, d, 'day', pInt) },
					'm': function (d) { parser(/^(\d\d?)(.*)/, d, 'month', pInt) },
					'mm': function (d) { parser(/^(\d\d)(.*)/, d, 'month', pInt) },
					'mmm': function (d) { parser(/^(...)(.*)/, d, 'month', pMonthShort) },
					'mmmm': function (d) { parser(new RegExp('^(' + opts.monthsFmt.join('|') + ')(.*)'), d, 'month', pMonth) },
					'yy': function (d) { parser(/^(\d\d)(.*)/, d, 'year', pYear) },
					'yyyy': function (d) { parser(/^(\d\d\d\d)(.*)/, d, 'year', pInt) }
				}
				var d = { src: s }
				while (fmt.length > 0) {
					var m = fmt.match(/^(yyyy|yy|mmmm|mmm|mm|m|dd|d)(.*)$/, fmt)
					if (m) {
						dateformat[m[1]](d)
						fmt = m[2]
					} else {
						d.src = d.src.substr(1)
						fmt = fmt.substr(1)
					}
				}
				return d
			}

			return this.each(function(i, el) {

				var $el = $(el)
				var yearShift = ($.browser.msie ? 0 : 1900)

				var $vel = $('<input type="' + $el.attr('type') + '"/>').attr('readonly', true)

				var attrs = ['class', 'title']
				for (var a = 0; a < attrs.length; a ++) {
					var attr = $el.attr(attrs[a])
					if (attr) $vel.attr(attrs[a], attr)
				}

				$el.after($vel)
				$el.css('display', 'none')

				var $control = $( ''
					+ '<div class="ajp-datepicker">'
						+ '<table class="ajp-datepicker-header"><tr>'
							+ '<td class="ajp-datepicker-prev"></td>'
							+ '<td class="ajp-datepicker-month-name"></td>'
							+ '<td class="ajp-datepicker-next"></td>'
						+ '</tr></table>'
						+ '<table class="ajp-datepicker-month">'
							+ '<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>'
						+ '</table>'
						+ '<div class="ajp-datepicker-footer">'
							+ '<div class="ajp-datepicker-clear"></div>'
						+ '</div>'
					+ '</div>'
				).css({
					visibility: 'hidden',
					position: 'absolute'
				})

				$control.find('.ajp-datepicker-month > tbody > tr > th').each(function (day) {
					$(this).text(opts.days[day])
				})

				$('body').append($control)

				$vel.ajp$popup({
					action: 'click',
					popup: function () { return $control },
					show: opts.show,
					hide: opts.hide
				})

				var $popupContext = $vel.ajp$popupContext()

				function getSelectedDate() {
					var d = (typeof opts.value == 'function' ? opts.value($el) : opts.value)
					if (typeof d == 'object' && d instanceof Date)
						return d
					d = parseDate(opts.valueFormat, d)
					return new Date(d.year, d.month - 1, d.day)
				}

				function visualize(date) {
					var sdate = getSelectedDate()
					$control.find('.ajp-datepicker-month-name').text('' + opts.months[date.getMonth()] + ', ' + (date.getYear() + yearShift))
					$control.find('.ajp-datepicker-month > tbody > tr').each(function (tr) { if (tr) $(this).remove() })
					var now = new Date()
					now = new Date(now.getYear() + yearShift, now.getMonth(), now.getDate())
					var wdays = [ 6, 0, 1, 2, 3, 4, 5 ]
					var lastDay = new Date(date.getYear() + yearShift, date.getMonth() + 1, 0).getDate()
					var $tr = false
					for (var day = 1; day <= lastDay; day ++) {
						var wday = wdays[new Date(date.getYear() + yearShift, date.getMonth(), day).getDay()]
						if (!$tr) $tr = $('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
						var cdate = new Date(date.getYear() + yearShift, date.getMonth(), day)
						var $td = $tr.find('td:eq(' + wday + ')').text(day).data('date', cdate)
						if (cdate.getTime() == sdate.getTime())
							$td.addClass('selected')
						if (cdate.getTime() == now.getTime())
							$td.addClass('now')
						if (wday == 6) {
							$control.find('.ajp-datepicker-month > tbody > tr:last').after($tr)
							$tr = false
						}
					}
					if ($tr) $control.find('.ajp-datepicker-month > tbody > tr:last').after($tr)
					$control.data('visualized-date', date)
					$control.find('.ajp-datepicker-month > tbody > tr > td').click(function () {
						if ($(this).text()) {
							opts.update($el, $vel, new Date($(this).data('date')))
							$popupContext.hide()
						}
					})
				}

				$control.find('.ajp-datepicker-prev').mouseup(function (evt) {
					$control.data('ajp-popup-opening', true)

					var date = new Date($control.data('visualized-date'))
					date = new Date(date.getYear() + yearShift, date.getMonth() - 1, 1)
					visualize(date)
				})

				$control.find('.ajp-datepicker-next').mouseup(function (evt) {
					$control.data('ajp-popup-opening', true)

					var date = new Date($control.data('visualized-date'))
					date = new Date(date.getYear() + yearShift, date.getMonth() + 1, 1)
					visualize(date)
				})

				$control.find('.ajp-datepicker-clear').mouseup(function (evt) {
					$vel.val('')
					$el.val('').change()
				})

				visualize(getSelectedDate())

				if ($el.val())
					opts.update($(), $vel, getSelectedDate())
			})
		}
	})

})(jQuery);
