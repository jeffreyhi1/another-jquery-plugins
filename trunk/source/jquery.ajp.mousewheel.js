/*
 * $Id$
 *
 * Fork of version 3.0.4 (Author of original - Brandon Aaron http://brandonaaron.net)
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 * 
 * Licensed under the MIT License (LICENSE.txt).
 * 
 */

(function($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.mousewheel = { version: '0.2a' }

	function handler(event) {

		var orgEvent = event || window.event,
			args = [].slice.call( arguments, 1 ),
			delta = 0, returnValue = true,
			deltaX = 0,
			deltaY = 0;

		event = $.event.fix(orgEvent)
		event.type = 'mousewheel'

		if (orgEvent.wheelDelta) {
			delta = orgEvent.wheelDelta/120
		} else if (orgEvent.detail) {
			delta = -orgEvent.detail/3
		}

		deltaY = delta

		if (orgEvent.wheelDeltaY !== undefined) { deltaY = orgEvent.wheelDeltaY / 120 }
		if (orgEvent.wheelDeltaX !== undefined) { deltaX = -1 * orgEvent.wheelDeltaX / 120 }

		event.delta = delta
		event.wheelDeltaX = deltaX
		event.wheelDeltaY = deltaY

		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);
    
		return $.event.handle.apply(this, args);
	}

	$.event.special.mousewheel = {

		setup: function() {
			if (this.addEventListener) {
				this.addEventListener('DOMMouseScroll', handler, false)
				this.addEventListener('mousewheel', handler, false)
			} else {
				this.onmousewheel = handler
			}
		},
    
		teardown: function() {
			if (this.removeEventListener) {
				this.removeEventListener('DOMMouseScroll', handler, false)
				this.removeEventListener('mousewheel', handler, false)
			} else {
				this.onmousewheel = null
			}
		}
	}

	$.fn.extend({

		mousewheel: function (fn) {
			return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel")
		},

		unmousewheel: function (fn) {
			return this.unbind("mousewheel", fn)
		}
	})

})(jQuery);
