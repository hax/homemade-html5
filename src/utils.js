function out(message) {
    if (console) console.debug('out:', message)
    out.buffer.push(message)
}
out.buffer = []
out.flush = function () {
    var stdout = document.getElementById('stdout')
    if (stdout) {
        stdout.innerHTML += out.buffer.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;')
        out.buffer = []
    } else if (document.body) {
		stdout = document.createElement('pre')
		stdout.id = 'stdout'
		document.body.appendChild(stdout)
        stdout.style.position = 'fixed'
        stdout.style.backgroundColor = 'black'
        stdout.style.color = 'white'
        stdout.style.bottom = 0
        stdout.style.maxHeight = '38%'
        stdout.style.overflow = 'auto'
    }
}
setInterval(out.flush, 100)

function fireSimpleEvent(type, target, option) {
	if (!option) option = {}
	var evt = document.createEvent('Event')
	evt.initEvent(type, !!option.bubbles, !!option.cancelable)
	return target.dispatchEvent(evt)
}

function $(id, doc) {
	return (doc || document).getElementById(id)
}
function $el(selector, range) {
	return (range ? range.ownerDocument : document).querySelector(selector)
}
function $all(selector, range) {
	return (range ? range.ownerDocument : document).querySelectorAll(selector)
}
