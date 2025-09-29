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
	setInterval(() => {
		//不同的日期显示不同的样式，200 天为黄色提示，400天为红色提示，可以自己定义。
		let warningDay = 200;
		let errorDay = 600;
		// 确保能够获取到文章时间以及在文章详情页
		let times = document.getElementsByTagName('time');
		if (times.length === 0) { return; }
		let posts = document.getElementsByClassName('post-meta-container');
		if (posts.length !== 1 || document.getElementsByClassName('__temp__errorDay').length > 0) { return; }

		// 获取系统当前的时间
		let pubTime = new Date(times[0].dateTime);  /* 文章发布时间戳 */
		let now = Date.now()  /* 当前时间戳 */
		let interval = parseInt(now - pubTime)
		let days = parseInt(interval / 86400000)
		/* 发布时间超过指定时间（毫秒） */
		if (interval > warningDay * 3600 * 24 * 1000 && interval < errorDay * 3600 * 24 * 1000) {
			posts[0].innerHTML = posts[0].innerHTML + '<div>' +
				'<p class="__temp__errorDay"><strong>提示</strong><br/>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。</p>' +
				'</div>';
		} else if (interval >= errorDay * 3600 * 24 * 1000) {
			posts[0].innerHTML = posts[0].innerHTML + '<div>' +
				'<p class="__temp__errorDay"><strong>警告</strong><br/>这是一篇发布于 ' + days + ' 天前的文章，部分信息可能已发生改变，请注意甄别。</p>' +
				'</div>';
		}
	}, 1000);

	// 专为 Hexo Next 主题设计的外链图标，使用 MIT 协议开源
	(function() {
	    // 检查是否已加载 Font Awesome
	    function loadFontAwesome() {
	        if (!document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')) {
	            const faLink = document.createElement('link');
	            faLink.rel = 'stylesheet';
	            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
	            document.head.appendChild(faLink);
	        }
	    }
	
	    function setExternalLinkIcons() {
	        const allLinks = document.querySelectorAll('a[href]:not(.fa):not([href^="#"]):not([href^="javascript:"])');
	        const currentHost = window.location.hostname;
	        
	        allLinks.forEach(link => {
	            // 排除 Next 主题的特殊链接
	            if (shouldSkipLink(link)) return;
	            
	            try {
	                const url = new URL(link.href);
	                if (isExternalLink(url, currentHost) && !hasExternalIcon(link)) {
	                    addExternalIcon(link);
	                }
	            } catch (e) {
	                // 无效 URL，跳过
	            }
	        });
	    }
	
	    function shouldSkipLink(link) {
	        // Next 主题需要跳过的链接选择器
	        const skipSelectors = [
	            '.site-nav a',
	            '.menu-item a', 
	            '.pagination a',
	            '.post-nav a',
	            '.post-meta a',
	            '.footer a',
	            '.links a',
	            '[data-fancybox]',
	            '.fancybox',
	            '.header-nav a',
	            '.sidebar a',
	            '.widget a',
	            '.tag-cloud a',
	            '.category-list a',
				'.post-header a',
				'.social-item a'
	        ];
	        
	        return skipSelectors.some(selector => link.closest(selector));
	    }
	
	    function isExternalLink(url, currentHost) {
	        return url.hostname && 
	               url.hostname !== currentHost && 
	               url.hostname !== '' &&
	               !url.hostname.includes('localhost') &&
	               !url.hostname.includes('127.0.0.1');
	    }
	
	    function hasExternalIcon(link) {
	        return link.querySelector('.fa-external-link-alt, .fa-up-right-from-square, .fa-external-link');
	    }
	
	    function addExternalIcon(link) {
	        const icon = document.createElement('i');
	        icon.className = 'fas fa-external-link-alt';
	        icon.style.cssText = 'margin-left: 4px; font-size: 0.8em;';
	        link.appendChild(icon);
	    }
	
	    // 不需要初始化
	    // loadFontAwesome();
	    
	    // // 设置定时检测
	    // setInterval(setExternalLinkIcons, 1000);
	    
	    // // 各种事件监听
	    setTimeout(setExternalLinkIcons, 500);
	    // document.addEventListener('DOMContentLoaded', setExternalLinkIcons);
	    document.addEventListener('pjax:complete', function() {
	        setTimeout(setExternalLinkIcons, 500);
	    });
	
	    // 支持手动调用
	    window.setExternalLinkIcons = setExternalLinkIcons;
	})();

// // 修复滚动高度问题的链接预览
// class LinkPreview {
// 	constructor() {
// 		this.preview = null;
// 		this.container = null;
// 		this.timer = null;
// 		this.currentUrl = null;
// 		this.isLoading = false;
// 		this.isMouseOverPreview = false;
// 		this.currentMouseX = 0;
// 		this.currentMouseY = 0;
// 		this.init();
// 	}

// 	init() {
// 		this.createPreviewContainer();
// 		this.bindHoverEvents();
// 		this.bindPJAXEvents();
// 		this.bindMouseMove();
// 	}

// 	createPreviewContainer() {
// 		const existingContainer = document.querySelector('.link-preview-container');
// 		if (existingContainer) {
// 			existingContainer.remove();
// 		}

// 		this.container = document.createElement('div');
// 		this.container.className = 'link-preview-container';
// 		this.container.style.cssText = `
//             position: fixed;
//             z-index: 10000;
//             pointer-events: none;
//             opacity: 0;
//             transition: opacity 0.3s ease;
//             display: block;
//         `;

// 		this.preview = document.createElement('iframe');
// 		this.preview.style.cssText = `
//             width: 400px;
//             height: 300px;
//             border: 1px solid #e1e1e1;
//             background: white;
//             border-radius: 8px;
//             box-shadow: 0 8px 30px rgba(0,0,0,0.2);
//             pointer-events: none;
//         `;

// 		// this.preview.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups');
// 		// this.preview.setAttribute('loading', 'lazy');

// 		this.container.appendChild(this.preview);
// 		document.body.appendChild(this.container);

// 		this.bindPreviewEvents();
// 	}

// 	bindPJAXEvents() {
// 		const pjaxEvents = ['pjax:complete', 'pjax:success', 'pjax:end'];
// 		pjaxEvents.forEach(event => {
// 			document.addEventListener(event, () => {
// 				this.reinitialize();
// 			});
// 		});

// 		let currentUrl = window.location.href;
// 		setInterval(() => {
// 			if (window.location.href !== currentUrl) {
// 				currentUrl = window.location.href;
// 				this.reinitialize();
// 			}
// 		}, 200);
// 	}

// 	reinitialize() {
// 		this.destroy();
// 		setTimeout(() => {
// 			this.init();
// 		}, 100);
// 	}

// 	bindMouseMove() {
// 		document.addEventListener('mousemove', (e) => {
// 			this.currentMouseX = e.clientX;  // 不需要加滚动，clientX/Y 已经是相对于视口的
// 			this.currentMouseY = e.clientY;
// 		});
// 	}

// 	bindHoverEvents() {
// 		const links = document.querySelectorAll('.post-body a[href^="http"]:not([href*="' + window.location.host + '"])');

// 		links.forEach(link => {
// 			if (link._previewHandlers) {
// 				link.removeEventListener('mouseenter', link._previewHandlers.enter);
// 				link.removeEventListener('mouseleave', link._previewHandlers.leave);
// 				link.removeEventListener('mousemove', link._previewHandlers.move);
// 			}
// 		});

// 		links.forEach(link => {
// 			const enterHandler = (e) => this.handleMouseEnter(e, link);
// 			const leaveHandler = this.handleMouseLeave.bind(this);
// 			const moveHandler = (e) => this.handleMouseMoveOnLink(e);

// 			link.addEventListener('mouseenter', enterHandler);
// 			link.addEventListener('mouseleave', leaveHandler);
// 			link.addEventListener('mousemove', moveHandler);

// 			link._previewHandlers = {
// 				enter: enterHandler,
// 				leave: leaveHandler,
// 				move: moveHandler
// 			};
// 		});
// 	}

// 	bindPreviewEvents() {
// 		this.container.addEventListener('mouseenter', () => {
// 			this.isMouseOverPreview = true;
// 		});

// 		this.container.addEventListener('mouseleave', () => {
// 			this.isMouseOverPreview = false;
// 			this.hidePreview();
// 		});
// 	}

// 	handleMouseEnter(e, link) {
// 		const url = link.href;
// 		if (!this.isValidUrl(url)) return;

// 		this.currentMouseX = e.clientX;
// 		this.currentMouseY = e.clientY;

// 		if (this.timer) {
// 			clearTimeout(this.timer);
// 		}

// 		this.timer = setTimeout(() => {
// 			this.showPreview(url);
// 		}, 600);
// 	}

// 	handleMouseMoveOnLink(e) {
// 		this.currentMouseX = e.clientX;
// 		this.currentMouseY = e.clientY;

// 		if (this.container.style.opacity === '1') {
// 			this.updatePosition();
// 		}
// 	}

// 	handleMouseLeave(e) {
// 		if (this.timer) {
// 			clearTimeout(this.timer);
// 			this.timer = null;
// 		}

// 		setTimeout(() => {
// 			if (!this.isMouseOverPreview) {
// 				this.hidePreview();
// 			}
// 		}, 200);
// 	}

// 	isValidUrl(url) {
// 		try {
// 			const urlObj = new URL(url);

// 			// 判断是不是网页
// 			if (!['http:', 'https:'].includes(urlObj.protocol)) {
// 				return false;
// 			}

// 			if (urlObj.hostname === window.location.hostname) {
// 				return false;
// 			}

// 			if (urlObj.pathname.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp|mp4|mp3|avi|mkv|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar)$/i)) {
// 				return false;
// 			}

// 			return true;
// 		} catch {
// 			return false;
// 		}
// 	}

// 	showPreview(url) {
// 		if (this.currentUrl === url || this.isLoading) return;

// 		this.currentUrl = url;
// 		this.isLoading = true;

// 		this.updatePosition();
// 		this.container.style.opacity = '1';

// 		this.preview.src = url;

// 		this.preview.onload = () => {
// 			this.isLoading = false;
// 		};

// 		this.preview.onerror = () => {
// 			this.isLoading = false;
// 			this.hidePreview();
// 		};
// 	}

// 	updatePosition() {
// 		const viewportWidth = window.innerWidth;
// 		const viewportHeight = window.innerHeight;

// 		// 使用 clientX/clientY，它们是相对于视口的，不需要加滚动距离
// 		const mouseX = this.currentMouseX;
// 		const mouseY = this.currentMouseY;

// 		const previewWidth = 400;
// 		const previewHeight = 300;

// 		// 计算位置 - 直接使用 clientX/clientY
// 		let left = mouseX + 15;
// 		let top = mouseY + 15;

// 		// 如果右边空间不够，显示在鼠标左侧
// 		if (left + previewWidth > viewportWidth) {
// 			left = mouseX - previewWidth - 15;
// 		}

// 		// 如果下边空间不够，显示在鼠标上方
// 		if (top + previewHeight > viewportHeight) {
// 			top = mouseY - previewHeight - 15;
// 		}

// 		// 确保在视口内
// 		left = Math.max(10, Math.min(left, viewportWidth - previewWidth - 10));
// 		top = Math.max(10, Math.min(top, viewportHeight - previewHeight - 10));

// 		this.container.style.left = left + 'px';
// 		this.container.style.top = top + 'px';
// 	}

// 	hidePreview() {
// 		this.container.style.opacity = '0';
// 		this.currentUrl = null;
// 		this.isLoading = false;

// 		setTimeout(() => {
// 			if (this.container.style.opacity === '0') {
// 				this.preview.src = 'about:blank';
// 			}
// 		}, 300);
// 	}

// 	destroy() {
// 		if (this.timer) {
// 			clearTimeout(this.timer);
// 		}
// 		if (this.container && this.container.parentNode) {
// 			this.container.parentNode.removeChild(this.container);
// 		}

// 		const links = document.querySelectorAll('a[href^="http"]');
// 		links.forEach(link => {
// 			if (link._previewHandlers) {
// 				link.removeEventListener('mouseenter', link._previewHandlers.enter);
// 				link.removeEventListener('mouseleave', link._previewHandlers.leave);
// 				link.removeEventListener('mousemove', link._previewHandlers.move);
// 				delete link._previewHandlers;
// 			}
// 		});
// 	}
// }

// // 全局实例管理
// let linkPreviewInstance = null;

// function initLinkPreview() {
// 	if (linkPreviewInstance) {
// 		linkPreviewInstance.destroy();
// 	}
// 	linkPreviewInstance = new LinkPreview();
// }

// // 初始化
// function setupLinkPreview() {
// 	setTimeout(initLinkPreview, 0);

// 	if (document.readyState === 'loading') {
// 		document.addEventListener('DOMContentLoaded', initLinkPreview);
// 	}

// 	const pjaxEvents = ['pjax:complete', 'pjax:success', 'pjax:end'];
// 	pjaxEvents.forEach(event => {
// 		document.addEventListener(event, () => {
// 			setTimeout(initLinkPreview, 50);
// 		});
// 	});

// 	window.addEventListener('beforeunload', () => {
// 		if (linkPreviewInstance) {
// 			linkPreviewInstance.destroy();
// 		}
// 	});
// }

// // 启动
// setupLinkPreview();
	
});



