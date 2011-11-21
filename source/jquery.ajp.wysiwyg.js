/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.wysiwyg = { version: '0.5pa', required: ['editable', 'colorpicker', 'popup'], current: null, installed: false }

	$.fn.extend({

		ajp$wysiwyg: function (options) {

			var defaults = {
				toolbar: 'basic',
				air: false,
				offset: { left: 14, top: 14 }
			}

			var opts = $.extend(defaults, options);

			return this.each(function() {

				var $origin = $(this).css({ display: 'none' })
				var $editor = $('<div class="ajp-wysiwyg"></div>').html($origin.val()).insertAfter($origin)
				var $toolbar

				if (typeof opts.toolbar == 'string') {
					var html = ''
					if (opts.toolbar == 'basic') {
						html = ''
						+ '<div class="ajp-wysiwyg-toolbar">'
						+ '	<div class="select styling-1 popup-open button">'
						+ '		<span class="label">Style</span><div class="disclosure-arrow"></div>'
						+ '		<div class="popup">'
						+ '			<div data-cmd="h1">Header 1</div>'
						+ '			<div data-cmd="h2">Header 2</div>'
						+ '			<div data-cmd="h3">Header 3</div>'
						+ '			<div data-cmd="h4">Header 4</div>'
						+ '			<div data-cmd="h5">Header 5</div>'
						+ '			<div data-cmd="h6">Header 6</div>'
						+ '			<div data-cmd="code"><code>Code</code></div>'
						+ '			<div data-cmd="small"><small>Small</small></div>'
						+ '			<div data-cmd="blockquote"><small>Blockquote</small></div>'
						+ '		</div>'
						+ '	</div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button" data-cmd="bold"><span>B</span></div>'
						+ '	<div class="button" data-cmd="italic"><span>I</span></div>'
						+ '	<div class="button" data-cmd="underline"><span>U</span></div>'
						+ '	<div class="button" data-cmd="strikethrough"><span>S</span></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="foreground-colorpicker button"><span class="letter">A</span><div class="disclosure-arrow"></div></div>'
						+ '	<div class="background-colorpicker button"><span class="letter">A</span><div class="disclosure-arrow"></div></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button" data-cmd="sup">X<sup>2</sup></div>'
						+ '	<div class="button" data-cmd="sub">X<sub>2</sub></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="ul"></div>'
						+ '	<div class="button image-button" data-cmd="ol"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="left"></div>'
						+ '	<div class="button image-button" data-cmd="center"></div>'
						+ '	<div class="button image-button" data-cmd="right"></div>'
						+ '	<div class="button image-button" data-cmd="justify"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="image"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="anchor"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="text"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button" data-cmd="codemode"><span>&lt;/&gt;</span></div>'
						+ '	<div class="clear"></div>'
						+ '</div>'
					} else if (opts.toolbar == 'mini') {
						html = ''
						+ '<div class="ajp-wysiwyg-toolbar">'
						+ '	<div class="select heading popup-open button">'
						+ '		<span class="label">H</span><div class="disclosure-arrow"></div>'
						+ '		<div class="popup">'
						+ '			<div data-cmd="h1">Header 1</div>'
						+ '			<div data-cmd="h2">Header 2</div>'
						+ '			<div data-cmd="h3">Header 3</div>'
						+ '			<div data-cmd="h4">Header 4</div>'
						+ '			<div data-cmd="h5">Header 5</div>'
						+ '			<div data-cmd="h6">Header 6</div>'
						+ '		</div>'
						+ '	</div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="select styling-2 popup-open button">'
						+ '		<span class="label">A</span><div class="disclosure-arrow"></div>'
						+ '		<div class="popup">'
						+ '			<div data-cmd="bold">Bold</div>'
						+ '			<div data-cmd="italic">Italic</div>'
						+ '			<div data-cmd="underline">Underline</div>'
						+ '			<div data-cmd="strikethrough">Strikethrough</div>'
						+ '			<div data-cmd="code"><code>Code</code></div>'
						+ '			<div data-cmd="small"><small>Small</small></div>'
						+ '			<div data-cmd="blockquote"><small>Blockquote</small></div>'
						+ '			<div data-cmd="sup">X<sup>2</sup></div>'
						+ '			<div data-cmd="sub">X<sub>2</sub></div>'
						+ '		</div>'
						+ '	</div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="foreground-colorpicker button"><span class="letter">A</span><div class="disclosure-arrow"></div></div>'
						+ '	<div class="background-colorpicker button"><span class="letter">A</span><div class="disclosure-arrow"></div></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="subtoolbar popup-open button align">'
						+ '		<div class="img"></div><div class="disclosure-arrow"></div>'
						+ '		<div class="popup">'
						+ '			<div class="image-button" data-cmd="left"></div>'
						+ '			<div class="separator"></div>'
						+ '			<div class="image-button" data-cmd="center"></div>'
						+ '			<div class="separator"></div>'
						+ '			<div class="image-button" data-cmd="right"></div>'
						+ '			<div class="separator"></div>'
						+ '			<div class="image-button" data-cmd="justify"></div>'
						+ '			<div class="clear"></div>'
						+ '		</div>'
						+ '	</div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="ul"></div>'
						+ '	<div class="button image-button" data-cmd="ol"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="image"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="anchor"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button image-button" data-cmd="text"></div>'
						+ '	<div class="separator"></div>'
						+ '	<div class="button" data-cmd="codemode"><span>&lt;/&gt;</span></div>'
						+ '	<div class="clear"></div>'
						+ '</div>'
					}

					$toolbar = $(html)
					$editor.before($toolbar)
					
				} else {

					$toolbar = opts.toolbar($editor)
				}

				$toolbar.append('<input type="hidden" name="codemode" value="no"/>')

				$editor.ajp$editable()
				var ctx = $editor.ajp$editableContext()

				$editor.parents('form').submit(function () {
					$origin.val(ctx.get())
					return true
				})

				$toolbar.find('.image-button').each(function () {
					var $btn = $(this)
					if ($btn.children('.img').length <= 0)
						$btn.append('<div class="img"></div>')
				})

				$toolbar.find('.button, button, .popup > div').each(function () {
					var $command = $(this)
					var cmd = $command.data('cmd')
					if (cmd) {
						$command.addClass('cmd-' + cmd).click(function () {
							if (!$command.hasClass('disabled')) {
								if (cmd == 'codemode') {
									var $flag = $toolbar.find('input[name=codemode]')
									if ($flag.val() == 'no') {
										$toolbar.children('.button').addClass('disabled')
										$toolbar.find('.cmd-codemode').removeClass('disabled')
										$flag.val('yes')
									} else {
										$toolbar.children('.button').removeClass('disabled')
										$flag.val('no')
									}
								}
								ctx.execCommand(cmd)
							}
						})
					}
				})

				if (!$.ajp.wysiwyg.installed) {

					$.ajp.wysiwyg.installed = true

					$(document).find('body:eq(0)').keydown(function (evt) {
						if (opts.air)
							$toolbar.css({ visibility: 'hidden' })
					})
				}

				$toolbar.find('.button').mousedown(function () {
					ctx.saveSelection()
				})

				$toolbar.find('.button').mouseup(function () {
					$editor.focus()
					ctx.restoreSelection()
				})

				$toolbar.find('.popup-open').ajp$popup()

				$toolbar.find('.foreground-colorpicker').ajp$colorpicker({
					onchange: function (val) {
						ctx.replaceSelection('<span style="color: ' + val + '">' + ctx.getSelectedHtml() + '</span>')
					}
				})

				$toolbar.find('.background-colorpicker').ajp$colorpicker({
					onchange: function (val) {
						ctx.replaceSelection('<span style="background-color: ' + val + '">' + ctx.getSelectedHtml() + '</span>')
					}
				})

				$toolbar.css({ display: 'block' })

				if (opts.air) {

					$toolbar.addClass('ajp-wysiwyg-toolbar-air').css({
						visibility: 'hidden',
						position: 'absolute',
						left: '0px',
						top: '0px'
					})

					$editor.mouseup(function (evt) {
						var sel = ctx.getSelectedHtml()
						if (sel.length > 0) {
							$toolbar.css({ visibility: 'visible' }).offset({
								left: (evt.clientX + $(document).scrollLeft() + opts.offset.left),
								top: (evt.clientY + $(document).scrollTop() + opts.offset.top)
							})
						} else {
							$toolbar.css({ visibility: 'hidden' })
						}
					})
				}
			})
		}
	})

})(jQuery);

