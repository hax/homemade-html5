if (!('classList' in HTMLElement.prototype)) {
    //WARN('patch HTMLElement classList')
	Object.defineProperty(HTMLElement.prototype, 'classList', {
		get: function () {
			var classList = []
			classList.element = this
			classList.reset = function () {
				this.length = 0
				this.push.apply(this, this.element.className.trim().split(/\s+/))
				return this
			}
			classList.item = function (i) {
				return this.reset()[i] || null
			}
			classList.contains = function (token) {
				return this.reset().indexOf(token) != -1
			}
			classList.add = function (token) {
				if (!this.contains(token)) {
					var s = this.element.className
					this.element.className +=
						s == '' || s.slice(-1).match(/\s/) ? token : ' ' + token
					this.push(token)
				}
			}
			classList.remove = function (token) {
				this.element.className = this.reset().filter(
					function (c) { return c != token }
				).join(' ')
				this.reset()
			}
			classList.toggle = function (token) {
				if (!this.contains(token)) {
					var s = this.element.className
					this.element.className +=
						s == '' || s.slice(-1).match(/\s/) ? token : ' ' + token
					this.push(token)
					return true
				} else {
					this.element.className = this.filter(
						function (c) { return c != token }
					).join(' ')
					this.reset()
					return false
				}
			}
			classList.toString = function () {
				return element.className
			}
			return classList.reset()
		}
	})
}