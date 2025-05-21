(() => {
	const t = document.getElementById("canvas_nest");
	if ("false" === t.getAttribute("mobile") && /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent))
		return;
	const e = (t, e, n) => t.getAttribute(e) || n
		, n = {
			zIndex: e(t, "zIndex", -1),
			opacity: e(t, "opacity", .5),
			color: e(t, "color", "0,0,0"),
			count: e(t, "count", 99)
		}
		, o = (() => {
			const t = document.createElement("canvas");
			return t.style.cssText = `position:fixed;top:0;left:0;z-index:${n.zIndex};opacity:${n.opacity}`,
				document.body.appendChild(t),
				t
		}
		)()
		, i = o.getContext("2d");
	let c, a;
	const d = () => {
		c = o.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			a = o.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
	}
		, l = []
		, m = {
			x: null,
			y: null,
			max: 2e4
		}
		, r = () => {
			i.clearRect(0, 0, c, a);
			const t = [m].concat(l);
			l.forEach((e => {
				e.x += e.xa,
					e.y += e.ya,
					e.xa *= e.x > c || e.x < 0 ? -1 : 1,
					e.ya *= e.y > a || e.y < 0 ? -1 : 1,
					i.fillRect(e.x - .5, e.y - .5, 1, 1),
					t.forEach((t => {
						if (e !== t && null !== t.x && null !== t.y) {
							const o = e.x - t.x
								, c = e.y - t.y
								, a = o * o + c * c;
							if (a < t.max) {
								t === m && a >= t.max / 2 && (e.x -= .03 * o,
									e.y -= .03 * c);
								const d = (t.max - a) / t.max;
								i.beginPath(),
									i.lineWidth = d / 2,
									i.strokeStyle = `rgba(${n.color},${d + .2})`,
									i.moveTo(e.x, e.y),
									i.lineTo(t.x, t.y),
									i.stroke()
							}
						}
					}
					)),
					t.splice(t.indexOf(e), 1)
			}
			)),
				requestAnimationFrame(r)
		}
		;
	d(),
		window.onresize = d,
		window.onmousemove = t => {
			m.x = t.clientX,
				m.y = t.clientY
		}
		,
		window.onmouseout = () => {
			m.x = null,
				m.y = null
		}
		,
		(() => {
			for (let t = 0; t < n.count; t++) {
				const t = Math.random() * c
					, e = Math.random() * a
					, n = 2 * Math.random() - 1
					, o = 2 * Math.random() - 1;
				l.push({
					x: t,
					y: e,
					xa: n,
					ya: o,
					max: 6e3
				})
			}
		}
		)(),
		setTimeout(r, 100)
}
)();
/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /gh/BNDong/Cnblogs-Theme-SimpleMemory@1.3.4/src/script/RibbonsEffect.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"object" == typeof window && (window.Ribbons = function () {
	var t = window
		, i = document.body
		, n = document.documentElement
		, o = function () {
			if (1 === arguments.length) {
				if (Array.isArray(arguments[0])) {
					var t = Math.round(o(0, arguments[0].length - 1));
					return arguments[0][t]
				}
				return o(0, arguments[0])
			}
			return 2 === arguments.length ? Math.random() * (arguments[1] - arguments[0]) + arguments[0] : 0
		}
		, s = function (o) {
			var s = Math.max(0, t.innerWidth || n.clientWidth || i.clientWidth || 0)
				, h = Math.max(0, t.innerHeight || n.clientHeight || i.clientHeight || 0);
			return {
				width: s,
				height: h,
				ratio: s / h,
				centerx: s / 2,
				centery: h / 2,
				scrollx: Math.max(0, t.pageXOffset || n.scrollLeft || i.scrollLeft || 0) - (n.clientLeft || 0),
				scrolly: Math.max(0, t.pageYOffset || n.scrollTop || i.scrollTop || 0) - (n.clientTop || 0)
			}
		}
		, h = function (t, i) {
			this.x = 0,
				this.y = 0,
				this.set(t, i)
		};
	h.prototype = {
		constructor: h,
		set: function (t, i) {
			this.x = t || 0,
				this.y = i || 0
		},
		copy: function (t) {
			return this.x = t.x || 0,
				this.y = t.y || 0,
				this
		},
		multiply: function (t, i) {
			return this.x *= t || 1,
				this.y *= i || 1,
				this
		},
		divide: function (t, i) {
			return this.x /= t || 1,
				this.y /= i || 1,
				this
		},
		add: function (t, i) {
			return this.x += t || 0,
				this.y += i || 0,
				this
		},
		subtract: function (t, i) {
			return this.x -= t || 0,
				this.y -= i || 0,
				this
		},
		clampX: function (t, i) {
			return this.x = Math.max(t, Math.min(this.x, i)),
				this
		},
		clampY: function (t, i) {
			return this.y = Math.max(t, Math.min(this.y, i)),
				this
		},
		flipX: function () {
			return this.x *= -1,
				this
		},
		flipY: function () {
			return this.y *= -1,
				this
		}
	};
	var e = function (t) {
		this._canvas = null,
			this._context = null,
			this._sto = null,
			this._width = 0,
			this._height = 0,
			this._scroll = 0,
			this._ribbons = [],
			this._options = {
				colorSaturation: "80%",
				colorBrightness: "60%",
				colorAlpha: .65,
				colorCycleSpeed: 6,
				verticalPosition: "center",
				horizontalSpeed: 150,
				ribbonCount: 3,
				strokeSize: 0,
				parallaxAmount: -.5,
				animateSections: !0
			},
			this._onDraw = this._onDraw.bind(this),
			this._onResize = this._onResize.bind(this),
			this._onScroll = this._onScroll.bind(this),
			this.setOptions(t),
			this.init()
	};
	return e.prototype = {
		constructor: e,
		setOptions: function (t) {
			if ("object" == typeof t)
				for (var i in t)
					t.hasOwnProperty(i) && (this._options[i] = t[i])
		},
		init: function () {
			try {
				this._canvas = document.createElement("canvas"),
					this._canvas.style.display = "block",
					this._canvas.style.position = "fixed",
					this._canvas.style.margin = "0",
					this._canvas.style.padding = "0",
					this._canvas.style.border = "0",
					this._canvas.style.outline = "0",
					this._canvas.style.left = "0",
					this._canvas.style.top = "0",
					this._canvas.style.width = "100%",
					this._canvas.style.height = "100%",
					this._canvas.style["z-index"] = "-1",
					this._canvas.id = "bgCanvas",
					this._onResize(),
					this._context = this._canvas.getContext("2d"),
					this._context.clearRect(0, 0, this._width, this._height),
					this._context.globalAlpha = this._options.colorAlpha,
					window.addEventListener("resize", this._onResize),
					window.addEventListener("scroll", this._onScroll),
					document.body.appendChild(this._canvas)
			} catch (t) {
				return void console.warn("Canvas Context Error: " + t.toString())
			}
			this._onDraw()
		},
		addRibbon: function () {
			var t = Math.round(o(1, 9)) > 5 ? "right" : "left"
				, i = 1e3
				, n = 200
				, s = 0 - n
				, e = this._width + n
				, a = 0
				, r = 0
				, l = "right" === t ? s : e
				, c = Math.round(o(0, this._height));
			/^(top|min)$/i.test(this._options.verticalPosition) ? c = 0 + n : /^(middle|center)$/i.test(this._options.verticalPosition) ? c = this._height / 2 : /^(bottom|max)$/i.test(this._options.verticalPosition) && (c = this._height - n);
			for (var _ = [], p = new h(l, c), d = new h(l, c), u = null, b = Math.round(o(0, 360)), f = 0; !(i <= 0);) {
				if (i--,
					a = Math.round((1 * Math.random() - .2) * this._options.horizontalSpeed),
					r = Math.round((1 * Math.random() - .5) * (.25 * this._height)),
					(u = new h).copy(d),
					"right" === t) {
					if (u.add(a, r),
						d.x >= e)
						break
				} else if ("left" === t && (u.subtract(a, r),
					d.x <= s))
					break;
				_.push({
					point1: new h(p.x, p.y),
					point2: new h(d.x, d.y),
					point3: u,
					color: b,
					delay: f,
					dir: t,
					alpha: 0,
					phase: 0
				}),
					p.copy(d),
					d.copy(u),
					f += 4,
					b += this._options.colorCycleSpeed
			}
			this._ribbons.push(_)
		},
		_drawRibbonSection: function (t) {
			if (t) {
				if (t.phase >= 1 && t.alpha <= 0)
					return !0;
				if (t.delay <= 0) {
					if (t.phase += .02,
						t.alpha = 1 * Math.sin(t.phase),
						t.alpha = t.alpha <= 0 ? 0 : t.alpha,
						t.alpha = t.alpha >= 1 ? 1 : t.alpha,
						this._options.animateSections) {
						var i = .1 * Math.sin(1 + t.phase * Math.PI / 2);
						"right" === t.dir ? (t.point1.add(i, 0),
							t.point2.add(i, 0),
							t.point3.add(i, 0)) : (t.point1.subtract(i, 0),
								t.point2.subtract(i, 0),
								t.point3.subtract(i, 0)),
							t.point1.add(0, i),
							t.point2.add(0, i),
							t.point3.add(0, i)
					}
				} else
					t.delay -= .5;
				var n = this._options.colorSaturation
					, o = this._options.colorBrightness
					, s = "hsla(" + t.color + ", " + n + ", " + o + ", " + t.alpha + " )";
				this._context.save(),
					0 !== this._options.parallaxAmount && this._context.translate(0, this._scroll * this._options.parallaxAmount),
					this._context.beginPath(),
					this._context.moveTo(t.point1.x, t.point1.y),
					this._context.lineTo(t.point2.x, t.point2.y),
					this._context.lineTo(t.point3.x, t.point3.y),
					this._context.fillStyle = s,
					this._context.fill(),
					this._options.strokeSize > 0 && (this._context.lineWidth = this._options.strokeSize,
						this._context.strokeStyle = s,
						this._context.lineCap = "round",
						this._context.stroke()),
					this._context.restore()
			}
			return !1
		},
		_onDraw: function () {
			for (var t = 0, i = this._ribbons.length; t < i; ++t)
				this._ribbons[t] || this._ribbons.splice(t, 1);
			this._context.clearRect(0, 0, this._width, this._height);
			for (var n = 0; n < this._ribbons.length; ++n) {
				for (var o = this._ribbons[n], s = o.length, h = 0, e = 0; e < s; ++e)
					this._drawRibbonSection(o[e]) && h++;
				h >= s && (this._ribbons[n] = null)
			}
			this._ribbons.length < this._options.ribbonCount && this.addRibbon(),
				requestAnimationFrame(this._onDraw)
		},
		_onResize: function (t) {
			var i = s(t);
			this._width = i.width,
				this._height = i.height,
				this._canvas && (this._canvas.width = this._width,
					this._canvas.height = this._height,
					this._context && (this._context.globalAlpha = this._options.colorAlpha))
		},
		_onScroll: function (t) {
			var i = s(t);
			this._scroll = i.scrolly
		}
	},
		e
}()),
	new Ribbons({
		colorSaturation: "60%",
		colorBrightness: "50%",
		colorAlpha: .5,
		colorCycleSpeed: 5,
		verticalPosition: "random",
		horizontalSpeed: 200,
		ribbonCount: 3,
		strokeSize: 0,
		parallaxAmount: -.2,
		animateSections: true
	});
//# sourceMappingURL=/sm/c1df5c1b1d16877c7a2ef95f23335a100e5e7a2f76371ded79ec481b65ab6113.map
/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /gh/EmoryHuang/BlogBeautify@1.1/star.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
(function () {
	let cnt = 0;
	function t() {
		i(),
			a()
	}
	function i() {
		document.addEventListener("mousemove", o),
			document.addEventListener("touchmove", e),
			document.addEventListener("touchstart", e),
			window.addEventListener("resize", n)
	}
	function n(t) {
		d = window.innerWidth,
			window.innerHeight
	}
	function e(t) {
		if (++cnt % 50 == 0)
			if (t.touches.length > 0)
				for (var i = 0; i < t.touches.length; i++)
					s(t.touches[i].clientX, t.touches[i].clientY, r[Math.floor(Math.random() * r.length)])
	}
	function o(t) {
		if (++cnt % 50 == 0)
			u.x = t.clientX,
				u.y = t.clientY,
				s(u.x, u.y, r[Math.floor(Math.random() * r.length)])
	}
	function s(t, i, n) {
		var e = new l;
		e.init(t, i, n),
			f.push(e)
	}
	function h() {
		for (var t = 0; t < f.length; t++)
			f[t].update();
		for (t = f.length - 1; t >= 0; t--)
			f[t].lifeSpan < 0 && (f[t].die(),
				f.splice(t, 1))
	}
	function a() {
		requestAnimationFrame(a),
			h()
	}
	function l() {
		this.character = "*",
			this.lifeSpan = 120,
			this.initialStyles = {
				position: "fixed",
				top: "0",
				display: "block",
				pointerEvents: "none",
				"z-index": "10000000",
				fontSize: "20px",
				"will-change": "transform"
			},
			this.init = function (t, i, n) {
				this.velocity = {
					x: (Math.random() < .5 ? -1 : 1) * (Math.random() / 2),
					y: 1
				},
					this.position = {
						x: t - 10,
						y: i - 20
					},
					this.initialStyles.color = n,
					// console.log(n),
					this.element = document.createElement("span"),
					this.element.innerHTML = this.character,
					c(this.element, this.initialStyles),
					this.update(),
					document.body.appendChild(this.element)
			}
			,
			this.update = function () {
				this.position.x += this.velocity.x,
					this.position.y += this.velocity.y,
					this.lifeSpan--,
					this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + this.lifeSpan / 120 + ")"
			}
			,
			this.die = function () {
				this.element.parentNode.removeChild(this.element)
			}
	}
	function c(t, i) {
		for (var n in i)
			t.style[n] = i[n]
	}
	var r = ["#D61C59", "#E7D84B", "#1B8798"]
		, d = window.innerWidth
		, u = (window.innerHeight,
		{
			x: d / 2,
			y: d / 2
		})
		, f = [];
	t()
}
)();
document.addEventListener('DOMContentLoaded', function () {
	setTimeout(() => {
		//不同的日期显示不同的样式，200 天为黄色提示，400天为红色提示，可以自己定义。
		let warningDay = 200;
		let errorDay = 600;
		// 确保能够获取到文章时间以及在文章详情页
		let times = document.getElementsByTagName('time');
		if (times.length === 0) { return; }
		let posts = document.getElementsByClassName('footer-inner');
		if (posts.length === 0) { return; }

		// 获取系统当前的时间
		let pubTime = new Date(times[0].dateTime);  /* 文章发布时间戳 */
		let now = Date.now()  /* 当前时间戳 */
		let interval = parseInt(now - pubTime)
		let days = parseInt(interval / 86400000)
		/* 发布时间超过指定时间（毫秒） */
		if (interval > warningDay * 3600 * 24 * 1000 && interval < errorDay * 3600 * 24 * 1000) {
			posts[0].innerHTML = posts[0].innerHTML + '<div>' +
				'<strong>提示</strong><p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。</p>' +
				'</div>';
		} else if (interval >= errorDay * 3600 * 24 * 1000) {
			posts[0].innerHTML = posts[0].innerHTML + '<div>' +
				'<strong>提示</strong><p>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。</p>' +
				'</div>';
		}
	}, 100);
});