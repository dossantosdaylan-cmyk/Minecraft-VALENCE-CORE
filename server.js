/* JSCraft - servidor de salas. Uso:  npm i ws   &&   node server.js   (puerto 3000 o process.env.PORT)
   Sirve los archivos del juego y el WebSocket en /ws (mismo dominio => el cliente se conecta solo).
   Detras de HTTPS (nginx/Cloudflare/Caddy) reenviar /ws con soporte WebSocket. */
const http = require("http"), fs = require("fs"), path = require("path"), { WebSocketServer } = require("ws")
const PORT = process.env.PORT || 3000, ROOT = __dirname
const MIME = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".txt": "text/plain", ".png": "image/png", ".css": "text/css" }
const srv = http.createServer((req, res) => {
	let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = fs.existsSync(path.join(ROOT, "index.html")) ? "/index.html" : "/Minecraft_version_5.html"
	const f = path.join(ROOT, path.normalize(p))
	if (!f.startsWith(ROOT) || /server\.js$|node_modules|package/.test(f)) { res.writeHead(403); return res.end() }
	fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end("404") } res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); res.end(d) })
})
const wss = new WebSocketServer({ server: srv, path: "/ws", maxPayload: 16384 })
const rooms = new Map(); let nid = 1
const send = (c, o) => { if (c.readyState === 1) c.send(JSON.stringify(o)) }
const clean = (s, n) => String(s || "").replace(/[^\w \-ñÑáéíóúÁÉÍÓÚ]/g, "").trim().slice(0, n)
const pub = r => ({ id: r.id, name: r.name, host: r.host.nick, n: r.players.size, max: r.max, lock: !!r.pass, mode: r.mode, started: r.started })
const info = r => ({ id: r.id, code: r.code, name: r.name, host: r.host.id, max: r.max, mode: r.mode, pub: r.pub, started: r.started, players: [...r.players].map(p => ({ id: p.id, nick: p.nick, skin: p.skin })) })
const bc = (r, o, ex) => { for (const p of r.players) if (p !== ex) send(p, o) }
const code = () => { let c; do { c = Array.from({ length: 5 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.random() * 32 | 0]).join("") } while ([...rooms.values()].some(r => r.code === c)); return c }
function leave(c) {
	const r = c.room; if (!r) return; r.players.delete(c); c.room = null
	if (!r.players.size) { rooms.delete(r.id); return }
	if (r.host === c) r.host = [...r.players][0]
	bc(r, { t: "room", room: info(r) })
}
function enter(c, r) { if (c.room) leave(c); r.players.add(c); c.room = r; bc(r, { t: "room", room: info(r) }) }
wss.on("connection", ws => {
	ws.id = nid++; ws.nick = "Jugador" + ws.id; ws.skin = 0; ws.room = null; ws.alive = true; ws.hits = 0
	ws.on("pong", () => { ws.alive = true })
	send(ws, { t: "welcome", id: ws.id })
	ws.on("message", raw => {
		if (++ws.hits > 60) return // anti-spam: 60 msgs / seg
		let m; try { m = JSON.parse(raw) } catch (e) { return }
		const err = s => send(ws, { t: "err", m: s })
		switch (m.t) {
			case "hello": case "set": ws.nick = clean(m.nick, 16) || ws.nick; ws.skin = Math.max(0, m.skin | 0) % 64; if (ws.room) bc(ws.room, { t: "room", room: info(ws.room) }); break
			case "list": send(ws, { t: "rooms", online: wss.clients.size, rooms: [...rooms.values()].filter(r => r.pub).map(pub) }); break
			case "create": {
				const name = clean(m.name, 24), pass = String(m.pass || "").slice(0, 20), isPub = !!m.pub
				if (name.length < 3) return err("Nombre de sala inválido.")
				if (!isPub && pass.length < 3) return err("Una sala privada necesita contraseña.")
				const r = { id: "r" + nid++, code: code(), name, pass, pub: isPub, max: [2, 3, 4, 6, 8].includes(m.max | 0) ? m.max | 0 : 4, mode: m.mode === "survival" ? "survival" : "creative", host: ws, players: new Set(), started: false, seed: 0 }
				rooms.set(r.id, r); enter(ws, r); break
			}
			case "join": {
				const r = m.code ? [...rooms.values()].find(x => x.code === String(m.code).toUpperCase()) : rooms.get(m.id)
				if (!r) return err("Sala no encontrada.")
				if (r.pass && r.pass !== String(m.pass || "")) return err("Contraseña incorrecta.")
				if (r.players.size >= r.max) return err("La sala está llena.")
				enter(ws, r); if (r.started) send(ws, { t: "start", seed: r.seed, mode: r.mode }); break
			}
			case "leave": leave(ws); send(ws, { t: "left" }); break
			case "chat": if (ws.room) bc(ws.room, { t: "chat", from: ws.nick, m: clean(m.m, 120) }); break
			case "start": {
				const r = ws.room; if (!r || r.host !== ws) return err("Solo el anfitrión puede iniciar.")
				r.started = true; r.seed = Math.random() * 2e9 | 0; bc(r, { t: "start", seed: r.seed, mode: r.mode }); break
			}
			case "rel": if (ws.room) bc(ws.room, { t: "rel", from: ws.id, d: m.d }, ws); break // reenvio generico (posiciones, bloques...)
		}
	})
	ws.on("close", () => leave(ws))
})
setInterval(() => { for (const c of wss.clients) { if (!c.alive) { c.terminate(); continue } c.alive = false; c.hits = 0; c.ping() } }, 1000 * 30)
setInterval(() => { for (const c of wss.clients) c.hits = 0 }, 1000)
srv.listen(PORT, () => console.log("JSCraft server en http://localhost:" + PORT))
