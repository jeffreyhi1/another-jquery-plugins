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
	$.ajp.mousewheel = { version: '0.1a' }

	function handler(event) {

		var orgEvent = event || window.event,
			args = [].slice.call( arguments, 1 ),
			delta = 0, returnValue = true,
			deltaX = 0,
			deltaY = 0;

		event = $.event.fix(orgEvent)
		event.type = "mousewheel"
    
		// Old school scrollwheel delta
		if ( event.wheelDelta ) { delta = event.wheelDelta/120 }
		if ( event.detail     ) { delta = -event.detail/3 }
    
		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta
    
		// Gecko
		if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaY = 0
			deltaX = -1 * delta
		}
    
		// Webkit
		if (orgEvent.wheelDeltaY !== undefined) { deltaY = orgEvent.wheelDeltaY / 120 }
		if (orgEvent.wheelDeltaX !== undefined) { deltaX = -1 * orgEvent.wheelDeltaX / 120 }
    
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
