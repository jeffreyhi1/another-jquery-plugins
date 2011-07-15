/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.typo = { version: '0.1pa' }

	$.fn.extend({

		typo: function (options) {

			var defaults = {
			}

			var opts = $.extend(defaults, options);

			function $attr($el, name) {
				var val = $el.attr(name)
				return (val ? ' ' + name + '="' + val + '"' : '')
			}

			/*return this.each(function() {

				var $dst = $('<' + this.tagName + '></' + this.tagName + '>')

				$.each(this.childNodes, function(i) {
					//console.log(i, this.tagName, $(this).text())

					var $current = $(this)

					switch (this.tagName) {

					case 'A':
						text += '<a' + $attr($current, 'href')
								+ $attr($current, 'target')
								+ $attr($current, 'title') + '>'
							+ $current.html()
					break;

					default:
						$dst.append($current)

					}

				})

				$(this).html($dst.html())
			})*/

			function typo(text) {
console.log('IN',text)
				text = text.replace(/(^|[^а-я])([а-я]{1,3})(?=[^а-я])/ig, '$1$2&nbsp;').replace(/(&nbsp;)\s+/g, '$1')
				text = text.replace(/\b(\d+(?:[,.]\d+)?)o([CF])\b/ig, '$1&#176;$2')
				text = text.replace(/\(R\)/ig, '&copy;')
				text = text.replace(/\(C\)/ig, '&#174;')
				text = text.replace(/\s+-\s+/g, '&nbsp;&#151; ')
				text = text.replace(/(\S)-(\S)/g, '$1&#150;$2')
				text = text.replace(/\s*"([^"]*)"/g, '<wbr class="typo"/><span class="slaquo-s typo"> </span> <span class="hlaquo-s typo">&#171;</span>$1&#187;')
				text = text.replace(/\s*\(/g, '<wbr class="typo"/><span class="sbrace typo"> </span> <span class="hbrace typo">(</span>')
console.log('OUT',text)
				return text
			}

			return this.each(function() {
				$(this).html(typo($(this).text()))
			})
		}
	})

})(jQuery);
