/* =====================================================================
   fase2.js — Mobs nuevos + Minimapa + Nicks  (cargar ANTES del juego)
   Usa el objeto window.JSCRAFT que el motor completa en JS.init(api).
   ===================================================================== */
(function () {
	const JS = window.JSCRAFT = window.JSCRAFT || {}
	let A = null
	JS.init = a => { A = a; Object.assign(A.MOB, DEF); initUI() }

	// ---------- texturas (el motor las mezcla en el atlas) ----------
	const S = (r, g, b, v) => () => [r, g, b, v === undefined ? 0.08 : v]
	const eyes = (c, e, extra) => (x, y) => ((y === 6 || y === 7) && (x === 4 || x === 5 || x === 10 || x === 11)) ? e : ((extra && extra(x, y)) || c)
	JS.tex = {
		chkBody: S(246, 246, 240), chkBeak: S(235, 160, 40), chkComb: S(205, 40, 40), chkFace: eyes([246, 246, 240, 0.06], [20, 20, 20, 0]),
		spdBody: S(48, 40, 38, 0.14), spdLeg: S(32, 28, 28, 0.1), spdFace: eyes([48, 40, 38, 0.14], [230, 30, 30, 0], (x, y) => (y === 9 && x > 5 && x < 10) ? [20, 16, 16, 0] : 0),
		birdBody: S(70, 130, 215), birdWing: S(45, 95, 180), birdFace: eyes([70, 130, 215, 0.08], [10, 10, 10, 0], (x, y) => (y >= 8 && y <= 9 && x >= 6 && x <= 9) ? [240, 170, 40, 0] : 0),
		wolfFur: S(84, 76, 70, 0.16), wolfFace: eyes([84, 76, 70, 0.16], [255, 200, 40, 0], (x, y) => (y >= 10 && y <= 12 && x >= 5 && x <= 10) ? [40, 30, 30, 0] : 0),
		witchRobe: S(86, 48, 126), witchHat: S(36, 26, 48), witchFace: eyes([205, 160, 120, 0.06], [40, 120, 40, 0], (x, y) => (y === 10 && x >= 6 && x <= 9) ? [120, 40, 40, 0] : 0), potion: S(150, 70, 210, 0.1),
		pumaFur: S(196, 160, 110, 0.12), pumaFace: eyes([196, 160, 110, 0.12], [240, 220, 60, 0], (x, y) => (y >= 10 && y <= 12 && x >= 5 && x <= 10) ? [235, 215, 190, 0] : 0),
		jagFur: (x, y) => ((x * 5 + y * 3) % 7 < 2) ? [60, 40, 20, 0.1] : [214, 160, 50, 0.1], jagFace: eyes([214, 160, 50, 0.1], [40, 160, 40, 0], (x, y) => (y >= 10 && y <= 12 && x >= 5 && x <= 10) ? [240, 225, 190, 0] : 0),
		tapFur: S(74, 68, 66, 0.12), tapSnout: S(124, 114, 110, 0.1), tapFace: eyes([74, 68, 66, 0.12], [10, 10, 10, 0]),
		capFur: S(150, 104, 64, 0.14), capFace: eyes([150, 104, 64, 0.14], [20, 16, 10, 0], (x, y) => (y >= 9 && y <= 11 && x >= 4 && x <= 11) ? [112, 78, 48, 0] : 0),
		crocSkin: S(60, 96, 48, 0.14), crocFace: eyes([60, 96, 48, 0.14], [230, 200, 40, 0]),
		fishGray: S(140, 146, 150, 0.1), fishPink: S(240, 140, 130, 0.08), fishT1: S(250, 150, 30, 0.06), fishT2: S(40, 170, 230, 0.06)
	}

	// ---------- definiciones (hostile:false => la IA propia las maneja) ----------
	const DEF = {
		chicken: { hp: 4, r: 0.3, h: 0.7, sp: 1.0 }, spider: { hp: 16, r: 0.45, h: 0.8, sp: 1.8 },
		bird: { hp: 4, r: 0.25, h: 0.5, sp: 1.3 }, werewolf: { hp: 24, r: 0.4, h: 1.9, sp: 2.4 }, witch: { hp: 26, r: 0.3, h: 1.95, sp: 1.3 },
		puma: { hp: 30, r: 0.45, h: 0.95, sp: 2.2 }, yagu: { hp: 25, r: 0.45, h: 0.75, sp: 2.9 }, tapir: { hp: 15, r: 0.5, h: 1.3, sp: 1.0 },
		capy: { hp: 8, r: 0.4, h: 0.75, sp: 1.0 }, yacare: { hp: 20, r: 0.5, h: 0.45, sp: 1.6, swim: true }, fish: { hp: 2, r: 0.2, h: 0.35, sp: 1.0, swim: true, quiet: true }
	}
	const X = n => [n, n, n, n, n, n]
	const F = (n, f) => [n, n, f, n, n, n]
	const away = (m, q) => Math.atan2(q.x - m.x, -(q.z - m.z))
	const toward = (m, q) => Math.atan2(-(q.x - m.x), q.z - m.z)
	function los(m, q) { // linea de vista barata (pasos de 1 bloque)
		const w = A.world, x0 = m.x, y0 = m.y + 1.5, z0 = m.z, dx = q.x - x0, dy = q.y - y0, dz = q.z - z0, n = Math.min(40, Math.ceil(Math.hypot(dx, dy, dz)))
		for (let i = 1; i < n; i++) { const t = i / n; if (w.getBlock(Math.round(x0 + dx * t), Math.round(y0 + dy * t), Math.round(z0 + dz * t))) return false }
		return true
	}
	const pots = []

	JS.mobs = {
		chicken: {
			draw(m, now, b, sw) {
				b(0, 0.42, 0, 0.3, 0.3, 0.45, X("chkBody")); b(0, 0.7, 0.28, 0.22, 0.24, 0.22, F("chkBody", "chkFace")); b(0, 0.66, 0.42, 0.1, 0.07, 0.1, X("chkBeak")); b(0, 0.86, 0.28, 0.06, 0.1, 0.12, X("chkComb"))
				b(0.08, 0.22, 0, 0.05, 0.22, 0.05, X("chkBeak"), sw, 0.11); b(-0.08, 0.22, 0, 0.05, 0.22, 0.05, X("chkBeak"), -sw, 0.11)
				b(0.18, 0.44, 0, 0.04, 0.2, 0.3, X("chkBody")); b(-0.18, 0.44, 0, 0.04, 0.2, 0.3, X("chkBody"))
			},
			ai(m, tq, d2, now) { // pone huevos cerca del jugador (survival)
				if (!m.egg) m.egg = now + 60000 + Math.random() * 60000
				if (now > m.egg) { m.egg = now + 70000 + Math.random() * 60000; if (A.survival && d2 < 144) { A.giveItem(A.blockIds.egg, 1); A.setHint("La gallina puso un huevo") } }
			},
			drops() { const l = [[A.blockIds.feather, Math.floor(Math.random() * 3)]]; l.push([A.blockIds.rawPork, 1]); return l }
		},
		bird: {
			draw(m, now, b, sw) {
				const fl = m.fly ? Math.sin(now / 55) * 1.0 : 0
				b(0, 0.3, 0, 0.2, 0.2, 0.35, X("birdBody")); b(0, 0.44, 0.2, 0.16, 0.16, 0.16, F("birdBody", "birdFace")); b(0, 0.42, 0.3, 0.06, 0.05, 0.08, X("chkBeak"))
				b(0.13, 0.34, 0, 0.03, 0.15, 0.3, X("birdWing"), fl, 0); b(-0.13, 0.34, 0, 0.03, 0.15, 0.3, X("birdWing"), -fl, 0)
				if (!m.fly) { b(0.05, 0.15, 0, 0.03, 0.15, 0.03, X("chkBeak"), sw, 0.07); b(-0.05, 0.15, 0, 0.03, 0.15, 0.03, X("chkBeak"), -sw, 0.07) }
			},
			ai(m, tq, d2, now, dt) { // vuela y camina
				if (!m.flyT || now > m.flyT) { m.fly = !m.fly; m.flyT = now + 5000 + Math.random() * 9000; if (m.fly) m.ty = m.y + 2.5 + Math.random() * 2 }
				if (m.fly) { m.vy = Math.max(-3, Math.min(3, (m.ty - m.y) * 2)); m.walk = true; m.spm = 1.6 } else m.spm = 1
			},
			drops() { return [[A.blockIds.feather, 1 + Math.floor(Math.random() * 2)]] }
		},
		spider: {
			draw(m, now, b, sw) {
				b(0, 0.45, 0, 0.5, 0.3, 0.6, X("spdBody")); b(0, 0.5, 0.5, 0.4, 0.3, 0.35, F("spdBody", "spdFace")); b(0, 0.5, -0.5, 0.55, 0.4, 0.6, X("spdBody"))
				for (let i = 0; i < 4; i++) { const z = -0.25 + i * 0.22, s = (i & 1 ? sw : -sw) * 0.5; b(0.55, 0.4, z, 0.7, 0.07, 0.07, X("spdLeg"), s, 0); b(-0.55, 0.4, z, 0.7, 0.07, 0.07, X("spdLeg"), -s, 0) }
			},
			ai(m, tq, d2, now) { // neutral de dia, hostil de noche (o si la golpean)
				if (m.hurtUntil > now) m.angry = true
				if ((A.dayLight < 0.5 || m.angry) && tq && d2 < 400) {
					m.yaw = toward(m, tq); m.walk = true; m.t = 1; m.spm = 1.3
					const fx = -Math.sin(m.yaw), fz = Math.cos(m.yaw)
					if (A.boxBlocked(m.x + fx * 0.8, m.y + 0.2, m.z + fz * 0.8, 0.3, 0.5)) m.vy = 4 // trepa paredes
					if (d2 < 2.25 && now - m.lastHit > 1000) { m.lastHit = now; if (A.survival) A.hurtP(tq, 2); tq.flashUntil = now + 300 }
				} else m.spm = 1
			},
			drops() { return [[A.blockIds.string, Math.floor(Math.random() * 3)]] }
		},
		werewolf: {
			draw(m, now, b, sw) {
				const a = m.mode === "leave" ? 0 : -1.2
				b(0.15, 0.95, 0, 0.25, 0.95, 0.25, X("wolfFur"), sw, 0.475); b(-0.15, 0.95, 0, 0.25, 0.95, 0.25, X("wolfFur"), -sw, 0.475)
				b(0, 1.35, 0, 0.6, 0.8, 0.35, X("wolfFur")); b(0.42, 1.75, 0.05, 0.2, 0.85, 0.2, X("wolfFur"), a, 0.4); b(-0.42, 1.75, 0.05, 0.2, 0.85, 0.2, X("wolfFur"), a, 0.4)
				b(0, 1.95, 0.1, 0.4, 0.4, 0.45, F("wolfFur", "wolfFace")); b(0, 1.85, 0.4, 0.2, 0.18, 0.25, X("wolfFur")); b(0.15, 2.22, 0.05, 0.1, 0.14, 0.08, X("wolfFur")); b(-0.15, 2.22, 0.05, 0.1, 0.14, 0.08, X("wolfFur"))
			},
			ai(m, tq, d2, now, dt) { // te persigue de noche; si te escondes (sin linea de vista 6s) se va
				if (!tq) return
				if (!m.mode) { m.mode = "hunt"; m.lost = 0; m.losT = 0 }
				if (A.dayLight > 0.65) m.mode = "leave"
				if ((m.losT -= dt) <= 0) { m.losT = 0.4; m.los = los(m, tq); m.lost = m.los ? 0 : m.lost + 0.4; if (m.lost > 6) m.mode = "leave" }
				if (m.mode === "leave") { m.yaw = away(m, tq); m.walk = true; m.t = 1; m.spm = 1.8; if (d2 > 2025) m.y = -99; return } // y=-99 => el motor lo elimina
				if (d2 < 1225) {
					m.yaw = toward(m, tq); m.walk = true; m.t = 1; m.spm = 1.4
					if (d2 < 2.7 && now - m.lastHit > 1200) { m.lastHit = now; if (A.survival) A.hurtP(tq, 4); tq.flashUntil = now + 300; tq.velocity.x += -Math.sin(m.yaw) * 0.35; tq.velocity.z += Math.cos(m.yaw) * 0.35; tq.velocity.y = 0.2 }
				}
			},
			drops() { return [[A.blockIds.leather, 1 + Math.floor(Math.random() * 2)]] }
		},
		witch: {
			draw(m, now, b, sw) {
				b(0, 0.8, 0, 0.55, 1.6, 0.4, X("witchRobe")); b(0, 1.8, 0, 0.4, 0.4, 0.4, F("witchFace", "witchFace")); b(0, 1.75, 0.22, 0.07, 0.12, 0.07, X("witchFace"))
				b(0, 2.05, 0, 0.55, 0.08, 0.55, X("witchHat")); b(0, 2.25, 0, 0.34, 0.3, 0.34, X("witchHat")); b(0, 2.5, 0, 0.14, 0.25, 0.14, X("witchHat"))
				b(0.33, 1.5, 0.1, 0.18, 0.6, 0.18, X("witchRobe"), -0.6, 0.3); b(-0.33, 1.5, 0.1, 0.18, 0.6, 0.18, X("witchRobe"), -0.6, 0.3)
			},
			ai(m, tq, d2, now) { // mantiene distancia y tira pociones
				if (!tq || d2 > 324) return
				m.yaw = toward(m, tq); m.t = 1; m.walk = d2 < 36; if (m.walk) m.yaw = away(m, tq)
				if (now - m.lastHit > 3000 && d2 < 256 && los(m, tq)) {
					m.lastHit = now; const dx = tq.x - m.x, dy = (tq.y - 0.9) - (m.y + 1.6), dz = tq.z - m.z, L = Math.hypot(dx, dy, dz) || 1
					pots.push({ x: m.x, y: m.y + 1.6, z: m.z, vx: dx / L * 9, vy: dy / L * 9 + 3, vz: dz / L * 9, t0: now })
				}
			},
			drops() { return [[A.blockIds.stick, 1 + Math.floor(Math.random() * 3)], [A.blockIds.coal, Math.floor(Math.random() * 2)]] }
		}
	}

	// ---------- BETA: mobs por bioma ----------
	const isW = (x, y, z) => (A.world.getBlock(Math.round(x), Math.round(y), Math.round(z)) & 0xff) === A.blockIds.waterBlock
	const leg = (b, x, z, h, w, tex, s) => b(x, h / 2, z, w, h, w, X(tex), s, h / 2)
	Object.assign(JS.mobs, {
		puma: { // montana: hostil de noche, neutral de dia; salto de ~3 bloques
			draw(m, now, b, sw) {
				b(0, 0.72, 0, 0.5, 0.5, 1.0, X("pumaFur")); b(0, 0.88, 0.62, 0.4, 0.4, 0.4, F("pumaFur", "pumaFace")); b(0.12, 1.12, 0.6, 0.1, 0.12, 0.08, X("pumaFur")); b(-0.12, 1.12, 0.6, 0.1, 0.12, 0.08, X("pumaFur")); b(0, 0.7, -0.75, 0.12, 0.12, 0.6, X("pumaFur"), sw * 0.3, 0)
				leg(b, 0.17, 0.38, 0.48, 0.16, "pumaFur", sw); leg(b, -0.17, 0.38, 0.48, 0.16, "pumaFur", -sw); leg(b, 0.17, -0.38, 0.48, 0.16, "pumaFur", -sw); leg(b, -0.17, -0.38, 0.48, 0.16, "pumaFur", sw)
			},
			ai(m, tq, d2, now) {
				if (m.hurtUntil > now) m.angry = true
				if (m.walk && m.onGround && Math.random() < 0.02) m.vy = 5 // saltitos
				if (!tq) return
				if (((A.hostiles && A.dayLight < 0.5) || m.angry) && d2 < 625) {
					m.yaw = toward(m, tq); m.walk = true; m.t = 1; m.spm = 1.2
					if (m.onGround && d2 > 6 && d2 < 14 && now - (m.leapT || 0) > 2500) { m.leapT = now; m.vy = 8; m.onGround = false; m.kx = -Math.sin(m.yaw) * 12; m.kz = Math.cos(m.yaw) * 12 }
					if (d2 < 2.7 && now - m.lastHit > 1100) { m.lastHit = now; if (A.survival) A.hurtP(tq, 5); tq.flashUntil = now + 300 }
				} else m.spm = 1
			},
			drops() { return [[A.blockIds.leather, 1], [A.blockIds.rawBeef, 1]] }
		},
		yagu: { // misiones: hostil siempre, agazapado, muerde y causa sangrado 3s
			draw(m, now, b, sw) {
				b(0, 0.48, 0, 0.46, 0.38, 1.0, X("jagFur")); b(0, 0.52, 0.62, 0.4, 0.34, 0.38, F("jagFur", "jagFace")); b(0.12, 0.74, 0.6, 0.1, 0.1, 0.08, X("jagFur")); b(-0.12, 0.74, 0.6, 0.1, 0.1, 0.08, X("jagFur")); b(0, 0.5, -0.75, 0.12, 0.12, 0.6, X("jagFur"), sw * 0.3, 0)
				leg(b, 0.17, 0.38, 0.3, 0.16, "jagFur", sw); leg(b, -0.17, 0.38, 0.3, 0.16, "jagFur", -sw); leg(b, 0.17, -0.38, 0.3, 0.16, "jagFur", -sw); leg(b, -0.17, -0.38, 0.3, 0.16, "jagFur", sw)
			},
			ai(m, tq, d2, now) {
				if (!tq || !A.hostiles && m.hurtUntil < now || d2 > 900) { m.spm = 1; return }
				m.yaw = toward(m, tq); m.walk = true; m.t = 1; m.spm = 1.3
				if (d2 < 2.4 && now - m.lastHit > 1200) { m.lastHit = now; if (A.survival) A.hurtP(tq, 6); tq.bleedUntil = now + 3000; tq.bleedNext = now + 1000; tq.flashUntil = now + 300 }
			},
			drops() { return [[A.blockIds.leather, 1], [A.blockIds.rawBeef, 1], [A.blockIds.bone, 1]] }
		},
		tapir: { // neutral, huye al ser golpeado (el motor ya lo hace con fleeUntil)
			draw(m, now, b, sw) {
				b(0, 0.88, 0, 0.6, 0.7, 1.1, X("tapFur")); b(0, 0.98, 0.75, 0.38, 0.4, 0.45, F("tapFur", "tapFace")); b(0, 0.82, 1.08, 0.16, 0.16, 0.3, X("tapSnout")); b(0.15, 1.22, 0.62, 0.08, 0.1, 0.06, X("tapSnout")); b(-0.15, 1.22, 0.62, 0.08, 0.1, 0.06, X("tapSnout"))
				leg(b, 0.22, 0.38, 0.54, 0.2, "tapFur", sw); leg(b, -0.22, 0.38, 0.54, 0.2, "tapFur", -sw); leg(b, 0.22, -0.38, 0.54, 0.2, "tapFur", -sw); leg(b, -0.22, -0.38, 0.54, 0.2, "tapFur", sw)
			},
			drops() { return [[A.blockIds.rawBeef, 1 + Math.floor(Math.random() * 2)], [A.blockIds.leather, 1]] }
		},
		capy: { // litoral: pasivo, en grupos, busca el agua
			draw(m, now, b, sw) {
				b(0, 0.5, 0, 0.5, 0.42, 0.9, X("capFur")); b(0, 0.58, 0.6, 0.34, 0.34, 0.34, F("capFur", "capFace"))
				leg(b, 0.17, 0.3, 0.28, 0.13, "capFur", sw); leg(b, -0.17, 0.3, 0.28, 0.13, "capFur", -sw); leg(b, 0.17, -0.3, 0.28, 0.13, "capFur", -sw); leg(b, -0.17, -0.3, 0.28, 0.13, "capFur", sw)
			},
			ai(m, tq, d2, now) {
				if (m.inW) { m.spm = 0.7; return }
				if (!m.wT || now > m.wT) { m.wT = now + 4000
					for (let i = 0; i < 6; i++) { const a = Math.random() * 6.283, r = 3 + Math.random() * 7, x = m.x + Math.cos(a) * r, z = m.z + Math.sin(a) * r
						if (isW(x, m.y, z) || isW(x, m.y - 1, z)) { if (Math.random() < 0.5) { m.yaw = toward(m, { x, z }); m.walk = true; m.t = 3 } break } } }
			},
			drops() { return [[A.blockIds.rawBeef, 1]] }
		},
		yacare: { // litoral: hostil en el agua, arrastra al jugador hacia abajo
			draw(m, now, b, sw) {
				b(0, 0.22, 0, 0.55, 0.26, 1.3, X("crocSkin")); b(0, 0.2, 0.95, 0.36, 0.2, 0.6, F("crocSkin", "crocFace")); b(0, 0.18, -1.0, 0.3, 0.18, 0.8, X("crocSkin"), sw * 0.2, 0)
				b(0.38, 0.1, 0.5, 0.14, 0.2, 0.14, X("crocSkin"), sw, 0.1); b(-0.38, 0.1, 0.5, 0.14, 0.2, 0.14, X("crocSkin"), -sw, 0.1); b(0.38, 0.1, -0.5, 0.14, 0.2, 0.14, X("crocSkin"), -sw, 0.1); b(-0.38, 0.1, -0.5, 0.14, 0.2, 0.14, X("crocSkin"), sw, 0.1)
			},
			ai(m, tq, d2, now) {
				if (!m.inW) { m.spm = 0.5; return }
				const pw = tq && (isW(tq.x, tq.y - 1, tq.z) || isW(tq.x, tq.y - 1.6, tq.z))
				if (pw && d2 < 400) {
					m.yaw = toward(m, tq); m.walk = true; m.t = 1; m.spm = 1.5; m.ty = Math.min(m.y + 1, tq.y - 1.2)
					if (d2 < 3.6 && now - m.lastHit > 1500) { m.lastHit = now; if (A.survival) A.hurtP(tq, 4); tq.dragUntil = now + 2000; tq.flashUntil = now + 300 }
				} else { m.spm = 0.8; m.ty = m.y }
			},
			drops() { return [[A.blockIds.leather, 1], [A.blockIds.rawBeef, 1]] }
		},
		fish: { // pez comun / salmon / tropical: nada, huye del jugador
			draw(m, now, b, sw) {
				const v = m.v | 0, body = v === 1 ? "fishPink" : v === 2 ? "fishT1" : "fishGray", fin = v === 2 ? "fishT2" : body
				b(0, 0.15, 0, 0.16, 0.2, 0.5, X(body)); b(0, 0.15, -0.32, 0.04, 0.26, 0.16, X(fin)); b(0, 0.3, 0, 0.03, 0.1, 0.2, X(fin))
			},
			ai(m, tq, d2, now) {
				if (!m.inW) { m.walk = false; return }
				m.walk = true; m.t = 1
				if (!isW(m.x - Math.sin(m.yaw) * 0.8, m.y, m.z + Math.cos(m.yaw) * 0.8)) m.yaw += 2 + Math.random() * 2
				if (tq && d2 < 25) { m.yaw = away(m, tq); m.spm = 2.2 } else m.spm = 1
				if (!m.ft || now > m.ft) { m.ft = now + 2500; m.ty = m.y + (Math.random() - 0.5) * 2 }
				if (!isW(m.x, m.y + 0.6, m.z) && m.ty > m.y - 0.3) m.ty = m.y - 0.5
			},
			drops() { return [[A.blockIds.rawFish, 1]] }
		}
	})

	JS.onKill = m => { const X2 = JS.mobs[m.type]; if (X2 && X2.drops) for (const [id, n] of X2.drops()) if (id && n > 0) A.giveItem(id, n) }
	JS.draw = now => {
		for (const o of pots) A.drawBox(o.x, o.y, o.z, 0, 0, 0, 0, 0.28, 0.28, 0.28, X("potion"), 0, 0)
	}

	// ---------- spawn + pociones + UI (una sola funcion por frame) ----------
	let nextSp = 0
	const mk = (type, x, y, z, v) => A.mobs.push({ type, x, y, z, yaw: Math.random() * 6.283, vy: 0, kx: 0, kz: 0, hp: DEF[type].hp, t: 0, walk: false, moving: false, onGround: false, hurtUntil: 0, fleeUntil: 0, ph: Math.random() * 6, fuse: 0, lastHit: 0, spm: 1, v: v || 0 })
	function waterTop(x, z, refY) {
		const c = A.world.chunks[x >> 4] && A.world.chunks[x >> 4][z >> 4]; if (!c || !c.buffer) return null
		for (let y = Math.round(refY) + 5; y > Math.round(refY) - 12; y--) { const b = A.world.getBlock(x, y, z); if (b) return (b & 0xff) === A.blockIds.waterBlock && isW(x, y - 1, z) ? y : null }
		return null
	}
	function spawn(now, ps) {
		if (now < nextSp || !A.animals || A.world.isNether) return
		nextSp = now + (A.potato ? 9000 : 4500)
		let tot = 0, fish = 0; const cnt = {}
		for (const m of A.mobs) if (DEF[m.type]) { cnt[m.type] = (cnt[m.type] || 0) + 1; if (m.type === "fish") fish++; else tot++ }
		const q = ps[Math.floor(Math.random() * ps.length)], an = Math.random() * 6.283, dist = 10 + Math.random() * 14
		const x = Math.round(q.x + Math.cos(an) * dist), z = Math.round(q.z + Math.sin(an) * dist)
		const night = A.dayLight < 0.45, bad = A.hostiles && A.survival, r = Math.random(), bio = A.biomeAt(x, z)
		const wt = waterTop(x, z, q.y)
		if (wt !== null) { // agua: yacare (litoral) o peces
			if (bio === 2 && bad && !cnt.yacare && r < 0.3) { mk("yacare", x, wt - 0.2, z); return }
			if (fish < (A.potato ? 2 : 6)) { const v = Math.random() * 3 | 0, n = 1 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) { const fx = x + (i & 1), fz = z + (i >> 1), fy = wt - 1 - (Math.random() * 2 | 0); if (isW(fx, fy, fz)) mk("fish", fx, fy - 0.2, fz, v) } }
			return
		}
		if (tot >= (A.potato ? 3 : 6)) return
		const gy = A.findGround(x, z, q.y); if (gy === null) return
		let type
		if (bio === 3) type = night ? (r < 0.55 ? "puma" : r < 0.75 ? "spider" : "bird") : (r < 0.4 ? "puma" : r < 0.7 ? "bird" : "chicken")
		else if (bio === 1) type = r < 0.3 ? (bad ? "yagu" : "tapir") : r < 0.6 ? "tapir" : r < 0.85 ? "bird" : "spider"
		else if (bio === 2) type = r < 0.45 ? "capy" : r < 0.65 ? "tapir" : r < 0.85 ? "bird" : "chicken"
		else if (bio === 4) type = r < 0.6 ? "spider" : "bird"
		else type = night ? (r < 0.35 ? "spider" : r < 0.65 && bad ? "werewolf" : r < 0.8 && bad ? "witch" : "chicken") : (r < 0.5 ? "chicken" : r < 0.85 ? "bird" : "spider")
		if ((type === "werewolf" || type === "witch") && cnt[type]) return
		if ((type === "puma" || type === "yagu") && cnt[type] >= 2) return
		if (type === "capy") { const n = 3 + (Math.random() * 3 | 0); for (let i = 0; i < n; i++) { const cx = x + Math.round((Math.random() - 0.5) * 4), cz = z + Math.round((Math.random() - 0.5) * 4), cy = A.findGround(cx, cz, q.y); if (cy !== null) mk("capy", cx, cy, cz) } return }
		mk(type, x, gy, z)
	}
	function updPots(now, dt, ps) {
		for (let i = pots.length - 1; i >= 0; i--) {
			const o = pots[i]; o.vy -= 14 * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.z += o.vz * dt; let dead = now - o.t0 > 4000 || A.world.getBlock(Math.round(o.x), Math.round(o.y), Math.round(o.z))
			if (!dead) for (const q of ps) { const dx = q.x - o.x, dy = (q.y - 0.9) - o.y, dz = q.z - o.z; if (dx * dx + dy * dy + dz * dz < 1.4) { if (A.survival) A.hurtP(q, 3); q.flashUntil = now + 300; q.velocity.x *= 0.3; q.velocity.z *= 0.3; dead = true; break } }
			if (dead) pots.splice(i, 1)
		}
	}

	// ---------- minimapa circular ----------
	const COLS = ["#82b1ff", "#ff8a80", "#a5e88a", "#ffe082"]
	let mm, mc, tc, tcx, nextMM = 0, nextTer = 0
	function initUI() {
		mm = document.createElement("canvas"); mm.width = mm.height = 120
		mm.style.cssText = "position:fixed;right:12px;top:12px;width:120px;height:120px;z-index:30;border-radius:50%;border:3px solid #222;box-shadow:0 0 0 2px #999;pointer-events:none;display:none;background:#1b2a1b"
		document.body.appendChild(mm); mc = mm.getContext("2d")
		tc = document.createElement("canvas"); tc.width = tc.height = 21; tcx = tc.getContext("2d")
	}
	function terrain(p) { // 21x21 columnas, cada 2 bloques (3 en POTATO)
		const st = A.potato ? 3 : 2, bx = Math.floor(p.x), bz = Math.floor(p.z), top = Math.round(p.y) + 10, w = A.world
		for (let i = -10; i <= 10; i++) for (let j = -10; j <= 10; j++) {
			let col = "#111"; const x = bx + i * st, z = bz + j * st
			try { for (let y = top; y > top - 36; y--) { const b = w.getBlock(x, y, z); if (b) { col = A.blockColor(b & 0xff); break } } } catch (e) {}
			tcx.fillStyle = col; tcx.fillRect(i + 10, j + 10, 1, 1)
		}
	}
	function drawMM(now, p) {
		const R = 60, sc = R / (A.potato ? 31 : 21); const st = A.potato ? 3 : 2 // bloques -> px
		mc.clearRect(0, 0, 120, 120); mc.save(); mc.beginPath(); mc.arc(R, R, R, 0, 6.283); mc.clip()
		if (now > nextTer) { nextTer = now + (A.potato ? 1800 : 900); terrain(p) }
		mc.imageSmoothingEnabled = false; mc.drawImage(tc, 0, 0, 120, 120); mc.fillStyle = "rgba(0,0,0,0.18)"; mc.fillRect(0, 0, 120, 120)
		const dot = (x, z, col, s, edge) => { let dx = (x - p.x) / st * (120 / 21), dz = (z - p.z) / st * (120 / 21); const L = Math.hypot(dx, dz); if (L > R - 5) { if (!edge) return; dx *= (R - 5) / L; dz *= (R - 5) / L }; mc.fillStyle = col; mc.beginPath(); mc.arc(R + dx, R + dz, s, 0, 6.283); mc.fill(); mc.strokeStyle = "#000"; mc.lineWidth = 1; mc.stroke() }
		for (const m of A.mobs) if ((DEF[m.type] && !DEF[m.type].quiet) || A.MOB[m.type].hostile) dot(m.x, m.z, "#d33", 2.5, false)
		if (A.coop) A.players.forEach((q, i) => { if (q !== p) dot(q.x, q.z, COLS[i] || "#fff", 4.5, true) })
		if (A.ent) { const k = 0.6 + 0.4 * Math.sin(now / 120); dot(A.ent.x, A.ent.z, "rgb(255," + Math.floor(40 * k) + "," + Math.floor(40 * k) + ")", 6.5, true) }
		const d = p.direction, a = Math.atan2(d.z, d.x); mc.translate(R, R); mc.rotate(a); mc.fillStyle = "#fff"; mc.beginPath(); mc.moveTo(7, 0); mc.lineTo(-5, -5); mc.lineTo(-5, 5); mc.closePath(); mc.fill(); mc.strokeStyle = "#000"; mc.stroke()
		mc.restore()
	}

	// ---------- nicks flotantes (proyeccion correcta, tags reutilizados) ----------
	const tags = []
	function nicks() {
		let used = 0
		if (A.coop && A.screen === "play") {
			const ps = A.players, W = A.canvas.width, H = A.canvas.height
			const vs = A.coopCam === "shared" ? [{ cam: A.cam, c: { x: 0, y: 0, w: W, h: H } }] : ps.map((q, i) => ({ cam: q, c: A.cellOf(i) }))
			for (const v of vs) for (let j = 0; j < ps.length; j++) {
				const q = ps[j]; if (q === v.cam) continue
				const e = v.cam.transformation.elements, pr = v.cam.projection, wx = q.x, wy = q.y + 0.55, wz = q.z
				const cx = e[0] * wx + e[1] * wy + e[2] * wz + e[3], cy = e[4] * wx + e[5] * wy + e[6] * wz + e[7], cz = e[8] * wx + e[9] * wy + e[10] * wz + e[11], w = pr[4] * cz
				if (w <= 0.05) continue
				const nx = pr[0] * cx / w, ny = pr[1] * cy / w; if (nx < -1.1 || nx > 1.1 || ny < -1.1 || ny > 1.1) continue
				let t = tags[used++]; if (!t) { t = tags[used - 1] = document.createElement("div"); t.style.cssText = "position:fixed;z-index:35;pointer-events:none;transform:translate(-50%,-100%);font:bold 13px monospace;text-shadow:1px 1px 2px #000,-1px -1px 2px #000;padding:1px 5px;background:rgba(0,0,0,.35);border-radius:3px"; document.body.appendChild(t) }
				t.textContent = "P" + (j + 1); t.style.color = COLS[j] || "#fff"; t.style.display = "block"
				t.style.left = Math.round(v.c.x + (nx * 0.5 + 0.5) * v.c.w) + "px"; t.style.top = Math.round(v.c.y + (1 - (ny * 0.5 + 0.5)) * v.c.h) + "px"
			}
		}
		for (let i = used; i < tags.length; i++) tags[i].style.display = "none"
	}
	JS.nicks = nicks

	JS.idle = () => { if (mm) mm.style.display = "none"; for (const t of tags) t.style.display = "none" }
	JS.tick = (now, dt, ps) => {
		spawn(now, ps); updPots(now, dt, ps); nicks()
		for (const q of ps) { // sangrado (yaguarete) y arrastre bajo el agua (yacare)
			if (q.bleedUntil > now && now > q.bleedNext) { q.bleedNext = now + 1000; if (A.survival) A.hurtP(q, 1) }
			if (q.dragUntil > now) q.velocity.y = -0.12
		}
		if (now < nextMM) return; nextMM = now + 100
		if (A.screen !== "play") { mm.style.display = "none"; return }
		mm.style.display = "block"; drawMM(now, A.players[0])
	}
})()
