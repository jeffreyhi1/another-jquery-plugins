
(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.modal = { version: '0.11pa', dialogs: { } }

	$.fn.extend({

		showModalDialog: function(options) {

			var defaults = {  

				background: '#000000',
				opacity: 0.5,

				duration: 'slow',
				easing: 'swing',

				'z-index': 100 * ($('.shade').length + 1),

				focus: function (dialog) {
					var ctl = dialog.find('input:eq(0)');
					if (ctl.length == 0) ctl = dialog.find('button:eq(0)');
					ctl.focus();
				}
			}
              
			options = $.extend(defaults, options);

			var randomId = function (prefix, n) {
				var a = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
				var id = prefix;
				for (var i = 0; i < n; i ++)
					id += a.charAt(parseInt(a.length * Math.random()))
				return id;
			}

			var elements = $(this);
			if (elements.css('visibility') != 'hidden')
				return elements;
			var shadows = $('body').append('<div class="shade" id="' + randomId('shade-layer-', 16) + '"></div>').find('.shade');
			var modalLayer = {
				'elements': elements,
				shade: shadows.eq(shadows.length - 1),
				hasElement: function (el) {
					for (var i = 0; i < this.elements.length; i ++)
						if (this.elements[i].id == el.id)
							return true;
					return false;
				}
			}
			modalLayer.shade.css({
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: options.background,
				opacity: 0,
				'z-index': options['z-index']
			}).animate({
				opacity: options.opacity
			}, options.duration, options.easing);

			$.ajp.modal.dialogs[modalLayer.shade.attr('id')] = modalLayer;

			$(this).each(function (i, el) {

				if (!el.id)
					el.id = randomId('modal-dialog-', 16)

				var dialog = $(el);
				dialog.css({
					opacity: 0,
					visibility: 'visible',
					'margin-left': '-' + parseInt(dialog.outerWidth() / 2) + 'px',
					'margin-top': '-' + parseInt(dialog.outerHeight() / 2) + 'px',
					'z-index': options['z-index'] + 1
				}).animate(
					{ opacity: 1 },
					options.duration,
					options.easing
				)
				options.focus(dialog);
			})

		},

		closeModalDialog: function(options) {

			var defaults = {  
				duration: 'slow',
				easing: 'swing',
				callback: function () {}
			}

			options = $.extend(defaults, options);

			var modalLayers = {}
			$(this).each(function (i, el) {
				for (var id in $.ajp.modal.dialogs) {
					var l = $.ajp.modal.dialogs[id];
					if (l.hasElement(el))
						modalLayers[id] = l;
				}
			})

			for (var id in modalLayers) {
				var modalLayer = modalLayers[id];
				modalLayer.shade.animate(
					{ opacity: 0 },
					options.duration,
					options.easing,
					function () {
						$(this).each(function(i, el) { delete $.ajp.modal.dialogs[el.id] }).remove();
						options.callback()
					}
				)
				modalLayer.elements.animate(
					{ opacity: 0 },
					options.duration,
					options.easing,
					function () {
						$(this).css('visibility', 'hidden')
					}
				)
			}
		}

	})

})(jQuery)
