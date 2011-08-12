/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.menu = { version: '0.3pa', current: null }

	$.fn.extend({

		ajp$menu: function (options) {

			var defaults = {
				show: function ($ul) {
					$ul.parents('li:eq(0)').addClass('selected')
					if ($.browser.msie) {
						$ul.css({ display: 'block' })
					} else {
						$ul.css({ opacity: 0, display: 'block' })
					}
					if (!$ul.data('initial-width'))
						$ul.data('initial-width', $ul.width())
					if (!$.browser.msie) {
						$ul.css({ width: 0 }).animate({ opacity: 1, width: $ul.data('initial-width') }, 'fast', 'swing')
					}
				},
				hide: function ($ul) {
					$ul.find('li').removeClass('selected')
					$ul.parents('li:eq(0)').removeClass('selected')
					if ($.browser.msie) {
						$ul.css('display', 'none')
					} else {
						$ul.animate({ opacity: 0 }, 'fast', 'swing', function () {
							$ul.css('display', 'none')
						})
					}
				}
			}

			var opts = $.extend(defaults, options);

			function makeMenu($li, level) {
				var $a = $li.children('a:eq(0)')
				var $ul = $li.children('ul:eq(0)')
				var hasSubmenu = ($ul.length ? true : false)
					
				if (hasSubmenu) {
					if (level && $a.find('.arrow:eq(0)').length == 0)
						$a.append('<span class="arrow">&raquo;</span>')

					$li.bind('click', function (evt) {
						var vis = ($ul.css('display') == 'none' ? true : false)
						$li.parent().children('li').children('ul').each(function () {
							if ($(this).css('display') != 'none')
								opts.hide($(this))
						})
						$ul.find('ul').css('display', 'none')
						if (level && vis) {
							$ul.css({
								'margin-top': '-' + ($li.outerHeight() - parseInt($li.css('padding-top'))) + 'px',
								'margin-left': '' + ($li.outerWidth() - parseInt($li.css('padding-left'))) + 'px'
							})
						}
						if (vis) {
							opts.show($ul)
						} else {
							opts.hide($ul)
						}
						evt.preventDefault()
						return false
					})

					$ul.children('li').each(function () {
						makeMenu($(this), level + 1)
					})
				}
			}

			return this.each(function() {
				$(this).removeClass('ajp-menu-noscript').addClass('ajp-menu').children('li').each(function () {
					makeMenu($(this), 0)
				})
				if (!$(this).children('li.clear').length)
					$(this).append('<li class="clear"></li>')
			})
		}
	})

})(jQuery);
