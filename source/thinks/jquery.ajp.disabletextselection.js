(function($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.disableTextSelect = { version: '0.1pa' }

	$.fn.extend({

        	disableTextSelect: function () {

			if ($.browser.mozilla) {
				return this.each(function () {
					$(this).css({'MozUserSelect' : 'none'})
				})
			} else if ($.browser.msie) {
				return this.each(function () {
					$(this).bind('selectstart.disableTextSelect', function() { return false })
            			})
			} else {
				return this.each(function () {
					$(this).bind('mousedown.disableTextSelect', function() { return false })
            			})
			}
		},

		enableTextSelect: function () {

			if ($.browser.mozilla) {
				return this.each(function () {
					$(this).css({'MozUserSelect' : ''})
				})
			} else if ($.browser.msie) {
				return this.each(function () {
					$(this).unbind('selectstart.disableTextSelect')
            			})
			} else {
				return this.each(function () {
					$(this).unbind('mousedown.disableTextSelect')
            			})
			}
		}

	})

})(jQuery);
