/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	$Id$
*/

if (!$.ajp) $.ajp = { }
$.ajp.easing = { version: '0.1pa' }

$.easing.easing = function(x, t, b, c, d) {
	x = 1 - x
	return c * Math.sqrt(1 - x * x) + b
}

$.easing.elastic = function(x, t, b, c, d) {

	var c1 = c + (c - b) * 0.26
	var c2 = b + (c - b) * 0.87
	var c3 = c + (c - b) * 0.06
	var c4 = b + (c - b) * 0.96

	var n5 = d
	var n4 = n5 - (d / 4) / 2
	var n3 = n4 - (d / 4) / 2
	var n2 = n3 - (d / 4)
	var n1 = n2 - (d / 4)

	if (t < n1) {
		c = c1
		return b + (c - b) * (t / n1)
	}

	if (t < n2) {
		b = c1
		c = c2
		return b + (c - b) * ((t - n1) / (n2 - n1))
	}

	if (t < n3) {
		b = c2
		c = c3
		return b + (c - b) * ((t - n2) / (n3 - n2))
	}

	if (t < n4) {
		b = c3
		c = c4
		return b + (c - b) * ((t - n3) / (n4 - n3))
	}

	if (t < n5) {
		b = c4
		return b + (c - b) * ((t - n4) / (n5 - n4))
	}

	return c
}

$.easing.bounce = function(x, t, b, c, d) {

	var c1 = b + (c - b) * 0.74
	var c2 = b + (c - b) * 0.96

	var n5 = d
	var n4 = n5 - (d / 4) / 2
	var n3 = n4 - (d / 4) / 2
	var n2 = n3 - (d / 4)
	var n1 = n2 - (d / 4)

	if (t < n1)
		return b + (c - b) * (t / n1)

	if (t < n2) {
		b = c
		c = c1
		return b + (c - b) * ((t - n1) / (n2 - n1))
	}

	if (t < n3) {
		b = c1
		return b + (c - b) * ((t - n2) / (n3 - n2))
	}

	if (t < n4) {
		b = c
		c = c2
		return b + (c - b) * ((t - n3) / (n4 - n3))
	}

	if (t < n5) {
		b = c2
		return b + (c - b) * ((t - n4) / (n5 - n4))
	}

	return c
}
