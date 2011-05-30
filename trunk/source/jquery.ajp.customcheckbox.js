/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.customCheckbox = { version: '0.4pa', installed: false }

	$.fn.extend({

		customCheckbox: function (options) {

			var defaults = {
				checkboxHeight: 25,
				radioHeight: 25
			}

			opts = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {
					init: function () {
						if (el.type == 'checkbox' || el.type == 'radio') {
							el.style.display = 'none';
							el.className += ' styled';
							var span = document.createElement('span');
							var position;
							span.className = el.type;
							if (el.checked == true) {
								if (el.type == 'checkbox') {
									position = '0 -' + (opts.checkboxHeight*2) + 'px';
									span.style.backgroundPosition = position;
								} else {
									position = '0 -' + (opts.radioHeight*2) + 'px';
									span.style.backgroundPosition = position;
								}
							}

							$(el).before(span).change(function () { api.clear() })

							if (!el.getAttribute('disabled')) {
								span.onmousedown = this.pushed;
								span.onmouseup = this.check;
							} else {
								span.className += ' disabled';
							}
						}

						if (!$.ajp.customCheckbox.installed) {
							var ctx = this;
							$(document).mouseup(function () {
								ctx.clear()
							})
							$.ajp.customCheckbox.installed = true
						}
					},
					pushed: function() {
						var element = this.nextSibling;
						if (element.checked == true && element.type == 'checkbox') {
							this.style.backgroundPosition = '0 -' + opts.checkboxHeight*3 + 'px';
						} else if (element.checked == true && element.type == "radio") {
							this.style.backgroundPosition = '0 -' + opts.radioHeight*3 + 'px';
						} else if (element.checked != true && element.type == "checkbox") {
							this.style.backgroundPosition = '0 -' + opts.checkboxHeight + 'px';
						} else {
							this.style.backgroundPosition = '0 -' + opts.radioHeight + 'px';
						}
					},
					check: function() {
						var element = this.nextSibling;
						if (element.checked == true && element.type == 'checkbox') {
							this.style.backgroundPosition = '0 0';
							element.checked = false;
						} else {
							if (element.type == 'checkbox') {
								this.style.backgroundPosition = '0 -' + opts.checkboxHeight*2 + 'px';
							} else {
								this.style.backgroundPosition = '0 -' + opts.radioHeight*2 + 'px';
								var group = this.nextSibling.name;
								var inputs = document.getElementsByTagName('input');
								for (var a = 0; a < inputs.length; a++) {
									if (inputs[a].name == group && inputs[a] != this.nextSibling) {
										inputs[a].previousSibling.style.backgroundPosition = '0 0';
									}
								}
							}
							element.checked = true;
						}
						$(element).change()
					},
					clear: function() {
						var inputs = document.getElementsByTagName('input');
						for(var b = 0; b < inputs.length; b++) {
							if (!/\bstyled\b/.test(inputs[b].className))
								continue;
							if (inputs[b].type == 'checkbox' && inputs[b].checked == true) {
								inputs[b].previousSibling.style.backgroundPosition = "0 -" + opts.checkboxHeight*2 + "px";
							} else if(inputs[b].type == "checkbox") {
								inputs[b].previousSibling.style.backgroundPosition = "0 0";
							} else if(inputs[b].type == "radio" && inputs[b].checked == true) {
								inputs[b].previousSibling.style.backgroundPosition = "0 -" + opts.radioHeight*2 + "px";
							} else if(inputs[b].type == "radio") {
								inputs[b].previousSibling.style.backgroundPosition = "0 0";
							}
						}
					}
				}

				api.init()
			})
		}
	})

})(jQuery);
