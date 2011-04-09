function out(message) {
    out.buffer.push(message)
    if (window.console) console.debug('out:', message)
}
out.buffer = []
out.flush = function () {
    if (out.buffer.length > 0) {
        var stdout = document.getElementById('stdout')
        if (stdout) {
            var s = out.buffer.join('\n') + '\n'
            out.buffer = []
            stdout.innerHTML += s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
            if (out.autoScroll) stdout.scrollTop = stdout.scrollHeight - stdout.clientHeight
        } else if (document.body) {
    		stdout = document.createElement('pre')
    		stdout.id = 'stdout'
    		document.body.appendChild(stdout)
        }
    }
}
out.show = function () {
    var stdout = document.getElementById('stdout')
    if (stdout) stdout.style.visibility = 'visible'
}
out.hide = function () {
    var stdout = document.getElementById('stdout')
    if (stdout) stdout.style.visibility = 'hidden'
}
out.autoScroll = true

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
