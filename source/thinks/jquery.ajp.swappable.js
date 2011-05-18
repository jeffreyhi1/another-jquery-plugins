(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.swappable = { version: '0.9pa' }

	$.fn.extend({

		swappable: function (options) {

			var defaults = {
				selector: '.item',
				callback: undefined
			}

			options = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {

					cancelEvent: function (evt) {
						if (!evt) return;
						evt.cancelBubble = true;
						if (evt.stopPropagation) {
							evt.stopPropagation();
							evt.preventDefault();
						}
					},
			
					onmousedown: function (evt, el) {
						this.src = evt.currentTarget;
						this.cancelEvent(evt);
					},
		
					onmouseup: function (evt, el) {
						this.src = null;
						this.cancelEvent(evt);
					},

					onmousemove: function (evt, el) {
						var dst = evt.currentTarget;
						if (this.src && dst != this.src) {
							var html = dst.innerHTML;
							dst.innerHTML = this.src.innerHTML;
							this.src.innerHTML = html;
							this.src = dst;
							if (options.callback)
								options.callback(el);
						}
						this.cancelEvent(evt);
					}
				}

				$(el).find(options.selector)
					.bind('mousedown', function (evt) { api.onmousedown(evt, el) })
					.bind('mouseup', function (evt) { api.onmouseup(evt, el) })
					.bind('mousemove', function (evt) { api.onmousemove(evt, el) })

			})
		}
	})

})(jQuery)
