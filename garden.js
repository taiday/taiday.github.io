/* Hiệu ứng cho cảnh vườn hoa: cánh hoa rơi, tim bay lên, ngôi sao lấp lánh */
(function () {
	var back = document.getElementById('fxBack');
	var front = document.getElementById('fxFront');
	if (!back || !front) return;

	function r(a, b) { return a + Math.random() * (b - a); }
	function add(cls, parent, vars) {
		var d = document.createElement('div');
		d.className = cls;
		for (var k in vars) d.style.setProperty(k, vars[k]);
		parent.appendChild(d);
		return d;
	}

	// cánh hoa rơi
	for (var i = 0; i < 18; i++) {
		var s = r(9, 17);
		add('petal', back, {
			left: r(2, 98) + '%',
			width: s + 'px',
			height: s * 1.2 + 'px',
			'--d': r(7, 12) + 's',
			'--dl': -r(0, 12) + 's',
			'--dx': r(-90, 90) + 'px',
			'--rot': r(240, 720) + 'deg'
		});
	}

	// tim bay lên
	for (var j = 0; j < 9; j++) {
		var h = r(18, 38);
		add('fheart' + (Math.random() < 0.5 ? ' h2' : ''), back, {
			left: r(6, 92) + '%',
			width: h + 'px',
			height: h + 'px',
			'--d': r(6, 10) + 's',
			'--dl': -r(0, 9) + 's',
			'--dx': r(-40, 40) + 'px',
			'--rot': r(-25, 25) + 'deg'
		});
	}

	// ngôi sao lấp lánh (rải khắp nơi + một nhóm quanh ruy-băng)
	function sparkle(x, y) {
		add('sp' + (Math.random() < 0.35 ? ' gold' : ''), front, {
			left: x + '%',
			top: y + '%',
			'--s': r(8, 20) + 'px',
			'--d': r(1.6, 3.4) + 's',
			'--dl': -r(0, 3.4) + 's'
		});
	}
	for (var k = 0; k < 30; k++) sparkle(r(3, 97), r(4, 88));
	for (var m = 0; m < 12; m++) sparkle(r(22, 78), r(12, 34));
})();
