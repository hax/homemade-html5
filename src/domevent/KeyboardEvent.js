// implement KeyboardEvent.key, KeyboardEvent.repeat
// NOTE: it may be broken when keydown cause window lose focus and
//       can not recieve corresponding keyup

// Legacy Keyboard Event Properties

var KeyCodes = {
    ENTER: 13,
	ESC: 27,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	PAGEUP: 33,
	PAGEDOWN: 34,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
}
var KeyValues = {
	13: 'Enter',
	27: 'Esc',
	37: 'Left',
	38: 'Up',
	39: 'Right',
	40: 'Down',
	33: 'PageUp',
	34: 'PageDown',
	112: 'F1',
	113: 'F2',
	114: 'F3',
	115: 'F4',
	116: 'F5',
	123: 'F12',
	219: 'PageUp',
	221: 'PageDown',
}

function patchKeyLocation(loc, code) {
	if (!(loc in KeyboardEvent)) Object.defineProperty(KeyboardEvent, loc, {value:code, writable:false, configurable:false})
	if (!(loc in KeyboardEvent.prototype)) Object.defineProperty(KeyboardEvent.prototype, loc, {value:code, writable:false, configurable:false})
}

patchKeyLocation('DOM_KEY_LOCATION_STANDARD', 0)
patchKeyLocation('DOM_KEY_LOCATION_LEFT', 1)
patchKeyLocation('DOM_KEY_LOCATION_RIGHT', 2)
patchKeyLocation('DOM_KEY_LOCATION_NUMPAD', 3)
patchKeyLocation('DOM_KEY_LOCATION_MOBILE', 4)
patchKeyLocation('DOM_KEY_LOCATION_JOYSTICK', 5)

if (!KeyboardEvent.prototype.initKeyboardEvent && KeyboardEvent.prototype.initKeyEvent)
KeyboardEvent.prototype.initKeyboardEvent = function (
		type, canBubble, cancelable, view, key, location, modifiers, repeat) {
	var ctrl = /\bControl\b/i.test(modifiers),
		alt = /\bAlt\b/i.test(modifiers),
		shift = /\bShift\b/i.test(modifiers),
		meta = /\bMeta\b/i.test(modifiers),
		keyCode = 0, charCode = 0
	if (key.length == 1) {
		keyCode = charCode = key.charChodeAt(0)
	} else {
		keyCode = KeyCodes[key.toUpperCase()] || 0
	}
	this.keyLocation = location
	this.initKeyEvent(type, canBubble, cancelable, view, ctrl, alt, shift, meta, keyCode, charCode)
}

if (!('key' in KeyboardEvent.prototype))
KeyboardEvent.prototype.__defineGetter__('key', function () {
	var k = this.keyIdentifier
	if (k) {
		if (k.slice(0, 2) == 'U+') {
			k = String.fromCharCode(parseInt(k.slice(2), 16))
			if (k == '\u001b') return 'Esc'
			if (k == '\u0008') return 'Backspace'
		}
		return k
	}
	if (this.charCode) k = String.fromCharCode(this.charCode)
	return k || KeyValues[this.keyCode & 0xffff] || 'Unidentified'
})
if (!('char' in KeyboardEvent.prototype))
KeyboardEvent.prototype.__defineGetter__('char', function () {
	var id = this.keyIdentifier
	if (id && id.slice(0, 2) == 'U+') return String.fromCharCode(parseInt(id.slice(2), 16))
	else if (this.charCode) return String.fromCharCode(this.charCode)
	return null
})

if (!('location' in KeyboardEvent.prototype))
KeyboardEvent.prototype.__defineGetter__('location', function () {
	return this.keyLocation
})

// implement KeyboardEvent.repeat
// NOTE: it may be broken when keydown cause window lose focus and
//       can not recieve corresponding keyup
if (!('repeat' in KeyboardEvent.prototype)) {
	KeyboardEvent.keyState = {}
	KeyboardEvent.prototype.__defineGetter__('repeat', function () {
		return !!KeyboardEvent.keyState[this.keyCode]
	})
	window.addEventListener('keydown', function (evt) {
		var code = evt.keyCode
		if (code == 0) return
		if (!(code in KeyboardEvent.keyState)) {
			KeyboardEvent.keyState[code] = 0
		} else {
			KeyboardEvent.keyState[code]++
		}
		//if (KeyboardEvent.keyState[code] > 0)
		//	log.debug('repeat keydown: ' + code + ' ' + KeyboardEvent.keyState[code] + ' times')
	}, true)
	window.addEventListener('keyup', function (evt) {
		delete KeyboardEvent.keyState[evt.keyCode]
	}, true)
}

