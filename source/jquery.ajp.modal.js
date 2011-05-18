(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.modal = { version: '0.1pa' }

	$.fn.extend({

		showModal: function (options) {

			var defaults = {
				background: '#fff',
				opacity: 0.5,
				zStep: 500,
				show: function (shade, dialog) {
					$(shade).css({ visibility: 'visible' })
					$(dialog).css({ visibility: 'visible' })
				},
				hide: function (shade, dialog) {
					if (shade) $(shade).css({ visibility: 'hidden' })
					$(dialog).css({ visibility: 'hidden' })
				},
				yes: function (button, dialog) {},
				no: function (button, dialog) {},
			}

			options = $.extend(defaults, options);

			var $shade = $('<div class="shade"></div>').css({
				background: options.background,
				position: 'fixed',
				left: '0',
				top: '0',
				width: '100%',
				height: '100%',
				opacity: options.opacity,
				'z-index': ($('body > .shade').length + 1) * options.zStep,
				visibility: 'hidden'
			})
			$shade.appendTo('body')

			return this.each(function(i, el) {

				$(el).find('.yes').unbind('click').click(function () {
					$(el).closeModal()
					options.yes(this, el)
				})

				$(el).find('.no').unbind('click').click(function () {
					$(el).closeModal()
					options.no(this, el)
				})

				$(el).css({ 'z-index': parseInt($shade.css('z-index')) + 1 })
				options.show($shade[0], el)
			})
		},

		closeModal: function (options) {

			var defaults = {
				hide: function (shade, dialog) {
					if (shade) $(shade).css({ visibility: 'hidden' })
					$(dialog).css({ visibility: 'hidden' })
				}
			}

			options = $.extend(defaults, options);

			return this.each(function (i, dialog) {
				var s
				var z = parseInt($(dialog).css('z-index')) - 1
				$('body > .shade').each(function (j, shade) {
					if (parseInt($(shade).css('z-index')) == z)
						s = shade
				})
				options.hide(s, dialog)
				if (s) $(s).remove()
			})
		}
	})

})(jQuery)
