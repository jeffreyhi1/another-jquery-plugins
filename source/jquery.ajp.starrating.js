/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.starRating = { version: '0.3pa' }

	$.fn.extend({

		starRating: function (options) {

			var defaults = {
				starClass: 'star',
				rating: 0,
				width: 16,
				height: 16,
				nStars: 5,
				image: 'star-ratings.png',
				voteHandler: undefined //function (vote, star) { $(star).parent().starRatingSet(vote) }
			}

			options = $.extend(defaults, options);

			this.css({
				width: '' + (options.width * options.nStars) + 'px',
				height: '' + options.height + 'px',
				cursor: (options.voteHandler ? 'pointer' : 'auto')
			})

			if (typeof options.image == 'function') {
				this.each(function () {
					var $el = $(this)
					$el.css({
						'background-image': 'url(' + options.image($el) + ')'
					})
				})
			} else {
				this.css({
					'background-image': 'url(' + options.image + ')'
				})
			}

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
					$el.starRatingSet(options.rating($el))
				})
			} else {
				this.starRatingSet(options.rating)
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
					var originalresult = $(this).data('rating')
					$(this).starRatingSet(originalresult)
				})


			}
		},

		starRatingSet: function (r) {
			this.data('rating', r)
			var h = (Math.round(r) > r ? 1 : 0)
			r = parseInt(r)
			$(this).css('background-position', '0 -' + ($(this).height() * (2 * r + h)) + 'px');
		}

	})

})(jQuery)
