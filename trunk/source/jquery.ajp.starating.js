/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.starating = { version: '0.5pa', installed: false, opts: [], serial: 1 }

	$.fn.extend({

		ajp$starating: function (options) {

			var defaults = {
				starClass: 'star',
				rating: 0,
				width: 16,
				height: 16,
				nStars: 5,
				image: 'star-ratings.png',
				onchange: undefined, // function (value, star) { ... }
				voteHandler: undefined // function (vote, star) { $(star).parent().ajp$staratingContext().set(vote) }
			}

			var options = $.extend(defaults, options)

			if (!$.ajp.starating.installed) {
				var savedVal = $.fn.val
				$.fn.val = function (value) {
					if (typeof $(this).data('ajp-starating-value') !== undefined) {
						var ctx = $(this).ajp$staratingContext()
						return (typeof value === undefined ? ctx.get() : ctx.set(value))
					}
					return savedVal.call(this, value)
				}
				$.ajp.starating.installed = true
			}

			this.css({
				width: '' + (options.width * options.nStars) + 'px',
				height: '' + options.height + 'px',
				cursor: (options.voteHandler ? 'pointer' : 'auto')
			})

			this.each(function () {
				var id = $.ajp.starating.serial ++
				$(this).data('ajp-starating-id', id)
				$.ajp.starating.opts[id] = options
			})

			var starSelector = (/^\./.test(options.starClass) ? options.starClass : '.' + options.starClass)
			if (options.voteHandler) {
				this.each(function () {
					var n = $(this).find(starSelector).length
					while (n < options.nStars) {
						$(this).append('<div class="' + options.starClass + '"></div>')
						n ++
					}
				})
			}

			this.find(starSelector).css({
				width: '' + options.width + 'px',
				height: '' + options.height + 'px',
				'float': 'left'
			})

			if (typeof options.rating == 'function') {
				this.each(function () {
					var $el = $(this)
					$el.ajp$staratingContext().set(options.rating($el))
				})
			} else {
				this.ajp$staratingContext().set(options.rating)
			}

			if (options.voteHandler) {

				this.find(starSelector).mouseover(function () {
					var star = $(this).index() + 1
					$(this).parent().css('background-position', '0 -' + (options.height * 2 * star) + 'px')
				}).click(function () {
					var vote = $(this).index() + 1
					options.voteHandler(vote, this)
				})

				this.mouseout(function (){
					var originalresult = $(this).data('ajp-starating-value')
					$(this).ajp$staratingContext().set(originalresult)
				})


			}
		},

		ajp$staratingContext: function () {
			var ctx = this
			return {
				set: function (r) {
					ctx.data('ajp-starating-value', r)
					var h = (Math.round(r) > r ? 1 : 0)
					$(ctx).each(
						function () {
							var $el = $(this)
							var opts = $.ajp.starating.opts[$el.data('ajp-starating-id')]
							$(ctx).css({
								'background-image': 'url(' + (typeof opts.image == 'function' ? opts.image(r, $el) : opts.image) + ')'
							})
							if (opts.onchange)
								opts.onchange(r, this)
						}
					)
					$(ctx).css('background-position', '0 -' + ($(ctx).height() * (2 * parseInt(r) + h)) + 'px')
				},
				get: function () {
					return ctx.data('ajp-starating-value')
				}
			}
		}
	})

})(jQuery);
