/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.scrollable = { version: '0.6pa', serial: 0, contexts: [] }

	$.fn.extend({

		scrollableContext: function () {
			if (this.length) {
				var serial = $(this[0]).data('ajp-scrollable-index')
				return $.ajp.scrollable.contexts[serial]
			}
			return null
		},

		scrollable: function (options) {

			var defaults = {
				duration: 'fast',
				easing: 'linear',
				mousewheel: false,
				orientation: 'horizontal',
				prev: '.scrollable-prev',
				next: '.scrollable-next',
				current: null
			}

			var defaultExtensible = {
				critical: 3,
				getUrl: function (offset) { return { url: './scrollable/', params: { 'offset': offset } } },
				getCount: function (response) { return response.items.length },
				getItem: function (response, i) { return response.items[i] }
			}

			var options = $.extend(defaults, options);

			if (options.extensible) {
				if (typeof options.extensible !== 'object')
					options.extensible = {}
				options.extensible = $.extend(defaultExtensible, options.extensible);
			}

			return this.each(function(i, el) {

				var api = {

					element: el,
					container: null,
					nItems: 0,
					canSelect: false,

					cancelEvent: function (evt) {
						if (!evt) return;
						evt.cancelBubble = true;
						if (evt.stopPropagation) {
							evt.stopPropagation();
							evt.preventDefault();
						}
					},

					init: function () {

						var serial = ($.ajp.scrollable.serial ++)
						$.ajp.scrollable.contexts[serial] = this
						$(this.element).data('ajp-scrollable-index', serial).find('.scrollable-screen').css({ overflow: 'hidden' })

						if ($(this.element).find('.scrollable-screen > ul').length <= 0)
							$(this.element).find('.scrollable-screen').append('<ul></ul>')

						this.container = $(this.element).find('.scrollable-screen > ul:eq(0)')
							.css({ position: 'relative', left: 0, top: 0 });

						var ctx = this;
						$(options.prev).click(function () { ctx.prev() });  
						$(options.next).click(function () { ctx.next() });

						if (options.mousewheel) {
							try {
								$(this.element).find('.scrollable-screen').mousewheel(function (evt, delta) {
									if (delta > 0) ctx.prev(); else ctx.next();
									ctx.cancelEvent(evt);
								})
							} catch (ex) { }
						}

						this.reinit()
						this.canSelect = true;

						if (options.current)
							this.selectItem(this.index = options.current)
					},

					reinit: function () {

						var items = this.container.children('li');
						this.nItems = items.length;

						items.eq(0).clone().appendTo(this.container);
						items.eq(this.nItems - 1).clone().prependTo(this.container);

						this.paddingLeft = parseInt(items.eq(0).css('padding-left'));
						this.paddingRight = parseInt(items.eq(0).css('padding-right'));
						this.paddingTop = parseInt(items.eq(0).css('padding-top'));
						this.paddingBottom = parseInt(items.eq(0).css('padding-bottom'));
						this.width = $(this.element).find('.scrollable-screen').innerWidth();
						this.height = $(this.element).find('.scrollable-screen').innerHeight();

						this.pack()
						this.toBegin();

						if (options.extensible && items.length == 0)
							this.extend(true)
					},

					pack: function () {

						if (options.orientation == 'horizontal') {
							this.container.css({
								width: '' + (this.width * (this.nItems + 2)) + 'px',
								height: '' + this.height + 'px'
							});
						} else {
							this.container.css({
								width: '' + this.width + 'px',
								height: '' + (this.height * (this.nItems + 2)) + 'px'
							});
						}

						var itemWidth = this.width - this.paddingLeft - this.paddingRight;
						var itemHeight = this.height - this.paddingTop - this.paddingBottom;
						var itemPadding = '' + this.paddingTop + 'px, '
							 + this.paddingRight + 'px, '
							 + this.paddingBottom + 'px, '
							 + this.paddingLeft + 'px';
						var itemFloating = (options.orientation == 'horizontal' ? 'left' : 'none')

						$(this.element).find('.scrollable-screen > ul > li')
							.css({
								width: itemWidth,
								height: itemHeight,
								padding: itemPadding,
								display: 'block',
								'float': itemFloating
							})
					},

					appendItems: function (items) {
						if (this.nItems <= 0) {
							for (var i = 0; i < items.length; i ++)
								this.container.append('<li>' + items[i] + '</li>')
							this.reinit()
						} else {
							this.nItems += items.length;
							var place = (options.orientation == 'horizontal' ?
								this.container.children('li:last-child') :
								this.container.children('li').eq(this.nItems - items.length + 1));
							for (var i = 0; i < items.length; i ++)
								place.before('<li>' + items[i] + '</li>');
							this.container.children('li:eq(0)').html(items[i - 1]);
							this.pack()
						}
					},

					extend: function (x) {
						var ctx = this;
						var ext = options.extensible;
						if (ext) {
							var u = ext.getUrl(ctx.nItems);
							$.getJSON(u.url, u.params, function (resp) {
								var items = [];
								var n = ext.getCount(resp);
								for (var i = 0; i < n; i ++)
									items.push(ext.getItem(resp, i));
								ctx.appendItems(items);
							})
						}
					},

					selectItem: function (i) {

						if (this.canSelect == false)
							return;
                                                this.canSelect = false;

						var ctx = this;
						var callback = function () {
							if (i >= ctx.nItems) {
								ctx.toBegin()
							} else if (i < 0) {
								ctx.toEnd()
							}
							ctx.canSelect = true; 
						}
						if (options.extensible && (ctx.nItems - i) <= options.extensible.critical)
							this.extend();
						this.index = i;
						if (options.orientation == 'horizontal') {
							this.container.animate({ left: '' + (-(this.index + 1) * this.width) + 'px' },
								options.duration, options.easing, callback);
						} else {
							this.container.animate({ top: '' + (-(this.index + 1) * this.height) + 'px' },
								options.duration, options.easing, callback);
						}
					},

					next: function () { this.selectItem(this.index + 1) },
					prev: function () { this.selectItem(this.index - 1) },

					toBegin: function () {
						this.index = 0;
						if (options.orientation == 'horizontal') {
							this.container.css({ left: '-' + this.width + 'px' });
						} else {
							this.container.css({ top: '-' + this.height + 'px' });
						}
					},

					toEnd: function () {
						this.index = this.nItems - 1;
						if (options.orientation == 'horizontal') {						
							this.container.css({ left: '-' + ((this.index + 1) * this.width) + 'px' });
						} else {
							this.container.css({ top: '-' + ((this.index + 1) * this.height) + 'px' });
						}
					}
				}

				api.init()
			})
		}
	})

})(jQuery);
