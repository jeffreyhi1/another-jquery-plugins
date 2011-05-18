(function ($) {

	if (!$.ajp) $.ajp = { }
	$.ajp.dragndrop = { version: '0.9pa' }

	$.fn.extend({

		dragndrop: function (options) {

			var defaults = {

				getUploadUrl: function (file, el) { return './upload/?name=' + encodeURIComponent(file.fileName) },

				onload: function (file, el, xhr) { },
				ondrop: function (obj, type, api) {
					if (type == 'file')
						api.uploadFile(obj);
				}
			}

			options = $.extend(defaults, options);

			return this.each(function(i, el) {

				var api = {

					element: el,

					cancelEvent: function (evt) {
						if (!evt) return;
						evt.cancelBubble = true;
						if (evt.stopPropagation) {
							evt.stopPropagation();
							evt.preventDefault();
						}
					},

					matchDataTransferType: function (types, type) {
						if (types.contains)
							return types.contains(type);
						return new RegExp("\\b" + type + "\\b").test('' + types);
					},

					uploadFile: function (file) {
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function() {
							var request = xhr;
							if (request.readyState == 4 && request.status == 200)
								options.onload(file, el, request)
						}
						xhr.open('POST', options.getUploadUrl(file, el));
						xhr.send(file);
					}
				}

				if (!/explorer/i.test(navigator.appName)) {

					el.addEventListener('dragenter', function(evt) { api.cancelEvent(evt) }, false);
					el.addEventListener('dragover', function(evt) { api.cancelEvent(evt) }, false);
					el.addEventListener('drop', function (evt) {

						var dt = evt.dataTransfer;

						evt.stopPropagation();
						evt.preventDefault();

						if (api.matchDataTransferType(dt.types, 'Files')) {
							for (var i = 0; i < dt.files.length; i++)
								api.uploadFile(dt.files[i]);
						} else if (api.matchDataTransferType(dt.types, 'text/uri-list')) { // URL
							var u = dt.getData('URL');
							if (/(je?pg|png|gif|bmp)$/i.test(u)) {
								options.ondrop(u, 'image', api)
							} else {
								options.ondrop(u, 'url', api)
							}
						}

					}, false);
				}
			})
		}
	})

})(jQuery)
