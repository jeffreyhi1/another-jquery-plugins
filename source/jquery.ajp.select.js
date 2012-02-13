/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.select = { version: '0.5pa', required: ['slider', 'popup'], optional: ['mousewheel'], serial: 1, contexts: { }, installed: false }

	$.fn.extend({

		ajp$select: function (options) {

			var defaults = {
				select: 'text', // text | html
				scrollbars: 'vertical', // vertical | native | none
				action: 'click', // see 'popup'
				// show: function ($popup, $el) { ... } // see 'popup'
				// hide: function ($popup, $el) { ... } // see 'popup'
				getItemContent: function ($opt) { return $opt.text() },
				empty: '<div class="ajp-message">list is empty...</div>',
				mousewheel: true
			}

			var opts = $.extend(defaults, options);

			return this.each(function(i, el) {

				var $el = $(el).css({ display: 'none' })

				var html = '';
				html += '<div class="ajp-select">'
					html += '<div class="ajp-current">...</div>'
					html += '<div class="ajp-disclosure-arrow"></div>'
					html += '<div class="ajp-list">'
						html += '<div class="ajp-list-top"></div>'
						html += '<div class="ajp-list-items"></div>'
						html += '<div class="ajp-list-right"></div>'
						html += '<div class="ajp-list-bottom"></div>'
					html += '</div>'
				html += '</div>'

				var $sel = $(html).insertAfter($el)
				$sel.attr('class', $sel.attr('class') + ' ' + $el.attr('class'))

				var $r = $sel.find('.ajp-list-right:eq(0)')
				var $i = $sel.find('.ajp-list-items:eq(0)')

				if (opts.scrollbars == 'vertical') {
					var $vsb = $('<div class="ajp-vsb"></div>')
					$r.append($vsb)
					$vsb.ajp$slider({ orientation: 'vertical', onchange: function (val) {
						var items = $i.children('.ajp-item')
						$i.scrollTop((items.outerHeight() * items.length - $i.innerHeight()) * val)
					}})
					if (opts.action == 'click') {
						$vsb.mouseup(function (evt) {
							$sel.find('.ajp-list').css({ visibility: 'hidden' })
						})
					}
				} else {
					$i.addClass('ajp-no-vsb')
				}

				if (opts.scrollbars == 'native')
					$i.addClass('ajp-sb-native')

				function invalidate() {

					var $cur = $sel.children('.ajp-current')
					var $opt = $sel.find('.ajp-selected:eq(0)')
					if ($opt.length <= 0)
						$opt = $sel.find('.ajp-item:eq(0)')
					if ($opt.length > 0) {
						if (opts.select == 'text') {
							$cur.text($opt.text())
						} else {
							$cur.html($opt.html())
						}
					} else {
						$cur.html('<!-- -->')
					}

					var $i = $sel.find('.ajp-list-items:eq(0)')
					var top = 0
					var item = $i.children('.ajp-selected')
					if (item.length > 0) {
						do {
							item = item.prev()
							if (item.length > 0)
								top += item.outerHeight()
						} while (item.length > 0)
						$i.scrollTop(top)
						top = $i.scrollTop()
					}

					var $vsb = $sel.find('.ajp-list-right > .ajp-vsb')
					if ($vsb.length > 0) {
						var items = $i.children('.ajp-item')
						var visibleHeight = $i.innerHeight()
						var totalHeight = (items.outerHeight() * items.length) 
						var $control = $vsb.children('.control')
						if (!$control.data('ajp-min-height'))
							$control.data('ajp-min-height', $control.height())
						var minHeight = $control.data('ajp-min-height')
						var h = (visibleHeight * $vsb.innerHeight()) / totalHeight
						$control.height(h < minHeight ? minHeight : h)
						$vsb.val(top / (totalHeight - $i.innerHeight()))
						if (visibleHeight < totalHeight) {
							$vsb.css({ display: 'block' })
							$i.removeClass('ajp-no-vsb')
						} else {
							$vsb.css({ display: 'none' })
							$i.addClass('ajp-no-vsb')
						}
					}
				}

				function selectItem($opt, raiseEvent) {
					var $list = $sel.find('.ajp-list-items')
					$list.children('.ajp-item').removeClass('ajp-selected')
					$opt.addClass('ajp-selected')
					invalidate()
					if (opts.action != 'click')
						$sel.ajp$popupContext().hide()
					if (raiseEvent) {
						var val = $opt.data('ajp-value')
						$el.children('option').each(function () {
							var $src = $(this)
							if ($src.attr('value') == val)
								$src.attr('selected', true)
						})
						$el.change()
					}
				}

				function getItem(val) {
					var $opt = $sel.find('.ajp-item:eq(0)')
					$sel.find('.ajp-item').each(function () {
						var $item = $(this)
						if (!$item.hasClass('ajp-disabled') && $item.data('ajp-value') == val)
							$opt = $item
					})
					return $opt
				}

				$sel.ajp$popup({
					action: opts.action,
					show: opts.show,
					hide: opts.hide,
					popup: '.ajp-list'
				})

				if (opts.mousewheel) {
					$sel.find('.ajp-list').mousewheel(function (evt, delta, deltaX, deltaY) {
						var $vsb = $sel.find('.ajp-list-right > .ajp-vsb')
						var val = $vsb.val()
						if (deltaY < 0) {
							val += 0.05
						} else {
							val -= 0.05
						}
						if (val < 0) val = 0
						if (val > 1) val = 1
						$vsb.val(val)
					})
					
				}

				var ctx = {

					sync: function () {
						if ($el.attr('disabled')) {
							if (!$sel.hasClass('ajp-disabled'))
								$sel.addClass('ajp-disabled')
						} else {
							$sel.removeClass('ajp-disabled')
						}
						var $list = $sel.find('.ajp-list-items')
						$list.html('<!-- -->')
						$el.find('option').each(function () {
							var $src = $(this)
							var $opt = $('<div class="ajp-item"></div>')
							$opt.html(opts.getItemContent($src))
							$opt.data('ajp-value', $src.attr('value'))
							if ($src.attr('disabled')) {
								$opt.addClass('ajp-disabled')
								if (opts.action == 'click')
									$opt.mouseup(function () {
										$sel.children('.ajp-list').css({ visibility: 'hidden' })
									})
							} else {
								$opt.click(function () { selectItem($opt, true) })
							}
							if ($src.attr('selected')) {
								$list.children('.ajp-item').removeClass('ajp-selected')
								$opt.addClass('ajp-selected')
							}
							$list.append($opt)
						})
						if ($list.children('.ajp-item').length <= 0)
							$list.html(opts.empty)
						invalidate()
					},

					get: function () {
						return $sel.find('.ajp-selected').data('ajp-value')
					},

					set: function (val) {
						if (this.get() != val)
							selectItem(getItem(val), true)
					}
				}

				var id = ($.ajp.select.serial ++)
				$.ajp.select.contexts[id] = ctx
				$el.data('ajp-select-id', id)
				$sel.data('ajp-select-id', id)

				$(document).keydown(function (evt) {
					if ($sel.find('.ajp-list').css('visibility') == 'visible') {
						if (evt.keyCode == 38) {
							var p = $sel.find('.ajp-selected').prev()
							while (p.length > 0) {
								if (!p.hasClass('ajp-disabled')) {
									selectItem(p, true)
									break
								}
								p = p.prev()
							}
						} else if (evt.keyCode == 40) {
							var n = $sel.find('.ajp-selected').next()
							while (n.length > 0) {
								if (!n.hasClass('ajp-disabled')) {
									selectItem(n, true)
									break
								}
								n = n.next()
							}
						}
					}
				})

				ctx.sync()

				$el.change(function () {
					var val = $el.children('option[selected]').attr('value')
					if (ctx.get() != val)
						selectItem(getItem(val), false)
				})
			})
		},

		ajp$selectContext: function () {
			var id = this.data('ajp-select-id')
			return $.ajp.select.contexts[id]
		}

	})

})(jQuery);
