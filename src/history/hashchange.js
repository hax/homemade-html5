// HashChangeEvent Patch

// Limitations: onhashchange event is async

new function () {
    if (!('HashChangeEvent' in window)) {
		/// TODO: HashChangeEvent constructor? and readonly properties
		HashChangeEvent = function () {}

		var oldURL = location.href

		if ('onhashchange' in window) {
			// patch Gecko (TODO: IE8?)
			window.addEventListener('hashchange', function (evt) {
				evt.oldURL = oldURL
				oldURL = evt.newURL = location.href
			}, true)
		} else {
			var CHECK_URL_INTERVAL = Date.TICK || 60
			var oldURL = location.href

			setInterval(checkHashChange, CHECK_URL_INTERVAL)

			function checkHashChange() {
				if (oldURL != location.href) {
					//var evt = new HashChangeEvent()
					//evt.initHashChangeEvent('hashchange', true, false, oldURL, location.href)
					var evt = document.createEvent('Event')
					evt.initEvent('hashchange', true, false)
					evt.oldURL = oldURL
					oldURL = evt.newURL = location.href
					window.dispatchEvent(evt)
				}
			}

			/// TODO: support onhashchange attr on body element
			window.addEventListener('hashchange', function (evt) {
				if (typeof window.onhashchange == 'function')
					return window.onhashchange(evt)
			}, false)
		}
	}
}