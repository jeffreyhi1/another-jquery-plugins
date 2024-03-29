/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.menu = { version: '0.10pa', current: null }

	$.fn.extend({

		ajp$menu: function (options) {

			var defaults = {
				show: function ($ul) {
					$ul.parents('li:eq(0)').addClass('selected')
					if ($.browser.msie) {
						$ul.css({ display: 'block' })
					} else {
						$ul.find('.arrow').css({ display: 'none' })
						$ul.css({ opacity: 0, display: 'block' })
					}
					if (!$ul.data('initial-width'))
						$ul.data('initial-width', $ul.width())
					var $root = $ul.parents('.ajp-menu')
					if ($ul.offset().left + $ul.outerWidth()  >  $root.offset().left + $root.outerWidth())
						$ul.css('margin-left', '-' + $ul.css('margin-left'))
					if (!$.browser.msie) {
						$ul.css({ width: 0 }).animate({ opacity: 1, width: $ul.data('initial-width') }, 'fast', 'swing', function () {
							$ul.find('.arrow').css({ opacity: 0, display: 'block' }).animate({ opacity: 1 }, 'fast', 'swing')
						})
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
				
				if ($li.hasClass('disabled'))
					$a.removeAttr('href').mousedown(function (evt) {
						evt.preventDefault()
						return false
					})

				if (hasSubmenu) {

					function closeSubmenu() {
						if ($ul.css('display') != 'none')
							opts.hide($ul)
					}

					$('body').click(function () {
						closeSubmenu()
					}).keydown(function (evt) {
						if (evt.keyCode == 27)
							closeSubmenu()
					})

					if (level && $a.find('.arrow:eq(0)').length == 0)
						$a.append('<span class="arrow">&raquo;</span>')

					$li.bind('click', function (evt) {
						if ($(this).hasClass('disabled'))
							return
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
							evt.preventDefault()
							return false
						} else {
							opts.hide($ul)
						}
					})

					$ul.children('li').each(function () {
						makeMenu($(this), level + 1)
					})

				} else {

					if ($a.length > 0 && $a[0].href == window.location.href && !$li.hasClass('selected'))
						$li.addClass('selected')					

					if (!$a.hasClass('final-node'))
						$a.addClass('final-node')
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
