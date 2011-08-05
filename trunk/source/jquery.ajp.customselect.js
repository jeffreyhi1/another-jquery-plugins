/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	if ($.ajp.customSelect)
		return
	$.ajp.customSelect = { version: '0.11pa', initialized: false, contexts: {}, serial: 1 }

	$.fn.extend({

		ajp$customSelect: function (options) {

			var defaults = {
				event: 'click',
				hideTimeout: 0
			}

			var options = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {

					element: $(el),
					custom: null,
					currentValue: null,
					valueToIndex: {},
					indexToValue: [],
					timer: null,

					cancelEvent: function (evt) {
						if (!evt) return;
						evt.cancelBubble = true;
						if (evt.stopPropagation) {
							evt.stopPropagation();
							evt.preventDefault();
						}
					},

					init: function () {

						var ths = this

						if (!$.ajp.customSelect.initialized) {
							$.ajp.customSelect.initialized = true
							$(document).find('body:eq(0)').keydown(function (evt) {
								if (evt.keyCode == 27)
									$('.ajp-customselect > .list').css({ visibility: 'hidden' })
							})
							$(document).find('body:eq(0)').mouseup(function (evt) {
								if (evt.button == 0) $('.ajp-customselect > .list').each(function () {
									var $list = $(this)
									var vis = $list.css('visibility')
									$list.data('ajp-customselect-visible', (vis == 'hidden' ? 'no' : 'yes'))
									$list.css({ visibility: 'hidden' })
								})
							})
						}

						var html = '';
						html += '<div class="ajp-customselect">'
						html += '<input class="current" readonly="readonly"/>'
						html += '<div class="control"></div>'
						html += '<div class="clear"></div>'
						html += '<div class="list"></div>'
						html += '</div>'

						this.element.css({ display: 'none' }).after(html)
						this.custom = this.element.next('.ajp-customselect:eq(0)').attr('class', 'ajp-customselect ' + ths.element.attr('class'))

						function openList() {
							if (!ths.custom.hasClass('ajp-customselect-disabled')) {
								var list = ths.custom.find('.list:eq(0)')
								var vis = (list.data('ajp-customselect-visible') == 'yes' ? 'hidden' : 'visible')
								if (vis == 'visible')
									$('.ajp-customselect > .list').css({ visibility: 'hidden' })
								list.css({ visibility: vis })
							}
						}

						this.custom.find('.current:eq(0), .control:eq(0)').bind(options.event, openList)

						this.custom.attr('title', this.element.attr('title'))

						this.sync()

						this.element.change(function () {
							ths.setValue($(this).val())
						})
						var serial = ($.ajp.customSelect.serial ++)
						$.ajp.customSelect.contexts[serial] = this
						this.element.data('ajp-customselect-id', serial)
						this.custom.children('.list:eq(0)').data('ajp-customselect-visible', 'no')

						if (options.hideTimeout) {
							this.custom.mouseover(function () {
								if (ths.timer) {
									clearTimeout(ths.timer)
									ths.timer = null
								}
							})
							this.custom.mouseout(function () {
								if (!ths.timer) {
									ths.timer = setTimeout(function () {
										ths.custom.children('.list:eq(0)').css({ visibility: 'hidden' })
									}, options.hideTimeout)
								}
							})
						}
					},

					sync: function () {

						var ths = this

						ths.valueToIndex = {}
						ths.indexToValue = []

						var selOpt = null
						var html = '<div class="top"></div>';
						this.element.find('option').each(function (i) {
							var opt = $(this)
							if (!selOpt || opt.attr('selected')) selOpt = opt
							html += '<div class="item' + (opt.attr('selected') ? ' selected' : '') + '"' + (opt.attr('style') ? ' style="' + opt.attr('style') + '"' : '') + '>'
							html += (opt.data('ajp-customselect-html') ? opt.data('ajp-customselect-html') : (opt.attr('label') ? opt.attr('label') : opt.text()))
							html += '</div>'
							var val = opt.attr('value')
							ths.valueToIndex[val] = i
							ths.indexToValue[i] = val
						})
						html += '</div>'
						html += '<div class="bottom"></div></div>'
						this.custom.children('.list:eq(0)').html(html)

						if (selOpt) this.selectItem(selOpt.attr('value'))

						this.custom.find('.list:eq(0) > .item').each(function (i) {
							$(this).click(function (evt) {
								ths.selectItem(ths.indexToValue[i])
							})
						})

						if (this.element.attr('disabled'))
							this.custom.addClass('ajp-customselect-disabled')
						else
							this.custom.removeClass('ajp-customselect-disabled')
					},

					setValue: function (val) {
						if (this.currentValue != val)
							this.currentValue = val
						this.invalidate()
					},

					selectItem: function (val) {
						this.setValue(val)
						this.element.change()
					},

					invalidate: function () {
						var list = this.custom.find('.list:eq(0)')
						list.find('.selected').removeClass('selected')
						var item = list.find('.item:eq(' + this.valueToIndex[this.currentValue] + ')').addClass('selected')
						this.custom.find('.current:eq(0)').val(item.text())
						list.css({ visibility: 'hidden' })
						this.element.find('option[value=' + this.currentValue + ']:eq(0)').attr('selected', 'selected')
					}
				}

				api.init()
			})
		},

		ajp$customSelectContext: function () {
			if (this.length) {
				var serial = $(this[0]).data('ajp-customselect-id')
				return $.ajp.customSelect.contexts[serial]
			}
			return null
		}
	})

})(jQuery);
