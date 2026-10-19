/* ===== Intro thiệp 20/10 =====
   1. Bầu trời tím có sao + quả cầu hoa hồng nổi giữa màn hình
   2. Bấm nút -> camera lao vào hoa -> hoa tan thành khói hồng
   3. Khói tan -> hiện thiệp, nhạc (đã cắt từ giây 47) bắt đầu
*/
(function () {
	var intro = document.getElementById('intro');
	if (!intro) return;

	var starsCv = document.getElementById('introStars');
	var bloomCv = document.getElementById('introBloom');
	var roseCv = document.getElementById('roseCanvas');
	var ball = document.getElementById('roseBall');
	var btn = document.getElementById('introBtn');
	var bgm = document.getElementById('bgm');
	var musicBtn = document.getElementById('musicBtn');
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var W = 0, H = 0;

	function rand(a, b) { return a + Math.random() * (b - a); }

	/* ---------- bầu trời sao + hạt lấp lánh quanh quả cầu ---------- */
	var sctx = starsCv.getContext('2d');
	var stars = [], orbit = [];
	function sizeCanvas(cv) {
		cv.width = Math.floor(W * dpr);
		cv.height = Math.floor(H * dpr);
	}
	function resize() {
		W = window.innerWidth;
		H = window.innerHeight;
		sizeCanvas(starsCv);
		sizeCanvas(bloomCv);
		if (!stars.length) {
			for (var i = 0; i < 190; i++) {
				stars.push({ x: Math.random(), y: Math.random(), r: rand(0.4, 1.6), p: rand(0, 6.28), s: rand(0.6, 2.2) });
			}
			for (var j = 0; j < 46; j++) {
				orbit.push({ a: rand(0, 6.28), rx: rand(0.34, 0.62), ry: rand(0.3, 0.55), sp: rand(0.12, 0.4) * (Math.random() < .5 ? -1 : 1), r: rand(0.8, 2.4), p: rand(0, 6.28) });
			}
		}
	}
	window.addEventListener('resize', resize);
	resize();

	var tStart = performance.now();
	var starFade = 1;
	function drawStars(now) {
		var t = (now - tStart) / 1000;
		sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		sctx.clearRect(0, 0, W, H);
		sctx.globalAlpha = starFade;
		// ánh sáng nhỏ ở đáy
		var gx = W / 2, gy = H * 0.86;
		var g = sctx.createRadialGradient(gx, gy, 0, gx, gy, Math.min(W, H) * 0.35);
		g.addColorStop(0, 'rgba(255,230,240,.95)');
		g.addColorStop(0.06, 'rgba(255,170,210,.55)');
		g.addColorStop(0.35, 'rgba(160,90,230,.18)');
		g.addColorStop(1, 'rgba(60,20,120,0)');
		sctx.fillStyle = g;
		sctx.fillRect(0, 0, W, H);
		// sao
		for (var i = 0; i < stars.length; i++) {
			var s = stars[i];
			var a = 0.35 + 0.65 * Math.abs(Math.sin(t * s.s + s.p));
			sctx.fillStyle = 'rgba(255,240,250,' + a.toFixed(3) + ')';
			sctx.beginPath();
			sctx.arc(s.x * W, s.y * H, s.r, 0, 6.2832);
			sctx.fill();
		}
		// hạt quay quanh quả cầu
		var cx = W / 2, cy = H * 0.43, base = Math.min(W * 0.8, H * 0.5, 430);
		for (var k = 0; k < orbit.length; k++) {
			var o = orbit[k];
			var ang = o.a + t * o.sp;
			var px = cx + Math.cos(ang) * base * o.rx * 1.25;
			var py = cy + Math.sin(ang) * base * o.ry * 1.25;
			var al = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.6 + o.p));
			sctx.fillStyle = 'rgba(255,205,225,' + al.toFixed(3) + ')';
			sctx.shadowColor = 'rgba(255,170,210,.9)';
			sctx.shadowBlur = 8;
			sctx.beginPath();
			sctx.arc(px, py, o.r, 0, 6.2832);
			sctx.fill();
		}
		sctx.shadowBlur = 0;
		sctx.globalAlpha = 1;
		if (!intro.classList.contains('done')) requestAnimationFrame(drawStars);
	}
	requestAnimationFrame(drawStars);

	/* ---------- vẽ quả cầu hoa hồng ---------- */
	var PAL = [
		['#fffaf5', '#fde4e6', '#f1bcc6', '#d58f9b'],   // trắng kem
		['#ffd9e4', '#f8a9c0', '#e0708f', '#b24565'],   // hồng nhạt
		['#f9a3ba', '#e8587f', '#c0325a', '#8f1f40'],   // hồng đậm
		['#e9525d', '#c4222f', '#8f111f', '#5e0a14']    // đỏ
	];
	function pickPal() {
		var r = Math.random();
		return r < 0.38 ? PAL[0] : r < 0.74 ? PAL[1] : r < 0.9 ? PAL[2] : PAL[3];
	}
	function drawRose(c, x, y, r, pal) {
		c.save();
		c.shadowColor = 'rgba(40,0,20,.45)';
		c.shadowBlur = r * 0.4;
		var g = c.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
		g.addColorStop(0, pal[0]);
		g.addColorStop(0.55, pal[1]);
		g.addColorStop(1, pal[2]);
		c.fillStyle = g;
		c.beginPath();
		c.arc(x, y, r, 0, 6.2832);
		c.fill();
		c.restore();
		var lw = Math.max(1, r * 0.055);
		for (var i = 0; i < 5; i++) {
			var rr = r * (0.9 - i * 0.17);
			var a0 = rand(0, 6.28);
			var jx = rand(-r, r) * 0.05, jy = rand(-r, r) * 0.05;
			c.beginPath();
			c.arc(x + jx, y + jy, rr, a0, a0 + Math.PI * rand(1.1, 1.6));
			c.strokeStyle = pal[3];
			c.globalAlpha = 0.75;
			c.lineWidth = lw;
			c.lineCap = 'round';
			c.stroke();
			c.beginPath();
			c.arc(x + jx, y + jy, rr * 0.93, a0 + Math.PI * 1.25, a0 + Math.PI * 1.85);
			c.strokeStyle = 'rgba(255,255,255,.5)';
			c.globalAlpha = 1;
			c.lineWidth = lw * 0.8;
			c.stroke();
		}
		c.globalAlpha = 1;
		// nhụy xoắn
		c.beginPath();
		for (var t = 0; t < 14; t += 0.3) {
			var rad = r * 0.04 * t;
			c.lineTo(x + Math.cos(t) * rad, y + Math.sin(t) * rad);
		}
		c.strokeStyle = pal[3];
		c.lineWidth = lw * 0.9;
		c.stroke();
	}
	function drawBall() {
		var S = 800;
		roseCv.width = S;
		roseCv.height = S;
		var c = roseCv.getContext('2d');
		var cx = S / 2, cy = S / 2, R = S * 0.34;
		// lá phía sau
		for (var l = 0; l < 22; l++) {
			var a = (l / 22) * 6.2832 + rand(-0.1, 0.1);
			var d = R * rand(0.95, 1.12);
			c.save();
			c.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d);
			c.rotate(a);
			var lg = c.createLinearGradient(0, 0, S * 0.1, 0);
			lg.addColorStop(0, '#3c7550');
			lg.addColorStop(1, '#24543b');
			c.fillStyle = lg;
			c.beginPath();
			c.ellipse(S * 0.04, 0, S * 0.065, S * 0.026, 0, 0, 6.2832);
			c.fill();
			c.restore();
		}
		// hoa phân bố trên mặt cầu (fibonacci)
		var N = 120, pts = [], golden = Math.PI * (3 - Math.sqrt(5));
		for (var i = 0; i < N; i++) {
			var y = 1 - (i / (N - 1)) * 2;
			var rr = Math.sqrt(1 - y * y);
			var th = golden * i;
			pts.push({ x: Math.cos(th) * rr, y: y, z: Math.sin(th) * rr });
		}
		pts.sort(function (p, q) { return p.z - q.z; });
		for (var k = 0; k < N; k++) {
			var p = pts[k];
			var depth = (p.z + 1) / 2;
			var rad = R * (0.2 + 0.14 * depth);
			drawRose(c, cx + p.x * R, cy + p.y * R, rad, pickPal());
		}
		// ánh sáng nhẹ phía trên
		var hl = c.createRadialGradient(cx - R * 0.3, cy - R * 0.4, 0, cx - R * 0.3, cy - R * 0.4, R);
		hl.addColorStop(0, 'rgba(255,255,255,.22)');
		hl.addColorStop(1, 'rgba(255,255,255,0)');
		c.fillStyle = hl;
		c.beginPath();
		c.arc(cx, cy, R * 1.15, 0, 6.2832);
		c.fill();
	}
	drawBall();

	/* ---------- khói hồng ---------- */
	var bctx = bloomCv.getContext('2d');
	var puffs = [];
	var smokeRunning = false, smokeT0 = 0;
	function startSmoke() {
		smokeRunning = true;
		smokeT0 = performance.now();
		for (var i = 0; i < 70; i++) {
			puffs.push({
				x: rand(-0.05, 1.05) * W,
				y: rand(0.5, 1.15) * H,
				r: rand(0.12, 0.3) * Math.max(W, H) * 0.5,
				vr: rand(0.15, 0.5),
				vy: rand(-0.5, -1.6),
				d: rand(0, 900),
				c: Math.random() < .5 ? '255,214,228' : (Math.random() < .5 ? '250,186,208' : '255,236,242')
			});
		}
		(function frame(now) {
			if (!smokeRunning) return;
			var t = now - smokeT0;
			bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			bctx.clearRect(0, 0, W, H);
			for (var i = 0; i < puffs.length; i++) {
				var p = puffs[i];
				var lt = Math.max(0, t - p.d);
				var a = Math.min(1, lt / 900) * Math.max(0, 1 - Math.max(0, lt - 1500) / 2200);
				if (a <= 0) continue;
				var rr = p.r + lt * p.vr * 0.12;
				var yy = p.y + lt * p.vy * 0.06;
				var g = bctx.createRadialGradient(p.x, yy, 0, p.x, yy, rr);
				g.addColorStop(0, 'rgba(' + p.c + ',' + (0.85 * a).toFixed(3) + ')');
				g.addColorStop(1, 'rgba(' + p.c + ',0)');
				bctx.fillStyle = g;
				bctx.beginPath();
				bctx.arc(p.x, yy, rr, 0, 6.2832);
				bctx.fill();
			}
			if (t < 4800) requestAnimationFrame(frame);
			else { smokeRunning = false; bctx.clearRect(0, 0, W, H); }
		})(performance.now());
	}

	/* ---------- nhạc ---------- */
	var musicOn = true;
	function fadeInMusic() {
		bgm.muted = false;
		bgm.volume = 0;
		var v = 0;
		var iv = setInterval(function () {
			v += 0.04;
			bgm.volume = Math.min(v, 0.9);
			if (v >= 0.9) clearInterval(iv);
		}, 100);
	}
	function setMusicBtn() {
		musicBtn.className = musicOn ? '' : 'off';
		musicBtn.setAttribute('aria-label', musicOn ? 'Tắt nhạc' : 'Bật nhạc');
	}
	musicBtn.addEventListener('click', function () {
		musicOn = !musicOn;
		if (musicOn) { bgm.muted = false; if (bgm.paused) bgm.play().catch(function () {}); }
		else { bgm.muted = true; }
		setMusicBtn();
	});

	/* ---------- chạy intro khi bấm ---------- */
	var started = false;
	function begin() {
		if (started) return;
		started = true;
		intro.classList.add('go');
		// mở khóa âm thanh ngay trong cú bấm (im lặng), đến lúc hiện thiệp mới bật tiếng
		try {
			bgm.muted = true;
			bgm.currentTime = 0;
			var pr = bgm.play();
			if (pr && pr.catch) pr.catch(function () {});
		} catch (e) {}
		ball.classList.add('zoom');
		starFade = 0.6;
		setTimeout(function () { bloomCv.classList.add('on'); startSmoke(); }, 2300);
		// hiện thiệp ở phía sau (hoạt ảnh của thiệp chạy từ lúc này)
		setTimeout(function () {
			document.body.classList.remove('intro-lock');
			try { bgm.currentTime = 0; } catch (e) {}
			if (bgm.paused) { var p2 = bgm.play(); if (p2 && p2.catch) p2.catch(function () {}); }
			fadeInMusic();
			musicBtn.hidden = false;
			setMusicBtn();
		}, 3600);
		// khói tan -> lộ thiệp
		setTimeout(function () { intro.classList.add('hide'); }, 4000);
		setTimeout(function () {
			intro.classList.add('done');
			intro.style.display = 'none';
		}, 6600);
	}
	btn.addEventListener('click', begin);
	ball.addEventListener('click', begin);

	/* ---------- co giãn theo màn hình + thiệp tự mở ---------- */
	function fit() {
		var w = window.innerWidth, h = window.innerHeight;
		var s = Math.min(1, (w - 16) / 700, (h - 16) / 450);
		var sc = Math.min(1.6, (w - 16) / 375, (h - 24) / 500);
		document.documentElement.style.setProperty('--fit', s.toFixed(3));
		document.documentElement.style.setProperty('--fitCard', sc.toFixed(3));
	}
	window.addEventListener('resize', fit);
	fit();

	var mail = document.querySelector('.mail');
	var letter = document.querySelector('.boxMail-container');
	var closeBtn = document.querySelector('.boxMail .fa-xmark');
	var openTimer;
	if (mail && letter) {
		mail.addEventListener('click', function () {
			clearTimeout(openTimer);
			openTimer = setTimeout(function () { letter.classList.add('open'); }, 900);
		});
	}
	if (closeBtn && letter) {
		closeBtn.addEventListener('click', function () {
			clearTimeout(openTimer);
			letter.classList.remove('open');
		});
	}
})();
