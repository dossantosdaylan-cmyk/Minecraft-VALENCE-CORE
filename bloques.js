/* =====================================================================
   bloques.js - DATOS del juego (texturas de caras, skins, nombres, bloques nuevos)
   Para agregar un bloque: editar la lista JC.BLOCKS de abajo. No se toca el motor.
   ===================================================================== */
(function () {
	const JC = window.JC = {}
	JC.FACE_B64 = {"herobrine": "SiwZRCsZQiwaQywaRCwcRCsbQCgVQCcVPyQSPyQSQCkXQCkXQiwaQiwaPykZQDEbSCsaQisZQi8dQy8eRS8fRC0ePikXPikWPycSPycSQy4bQy4cQy8eQi8ePigYPzAZRSsaQCwaRjIhRjIhRjIhRTEgRC4cRC8cUTEcUTEcVTopVDopRzEiRjIiPigWPzAXRSsaQS8cTDsqTDsqTDwqSzspSTYkSTcjVTgiVTgiW0MxWkMxTTkqTDoqPyoXPzEYRSsaU0gyoIuCoYyCpo6GpY6GqI+IqI6HoYV+oYV+po+Ipo+ImX52mH51UTIlRTcgRS0bU0ozoYyDoo2Ep5CIpo+HqI+IqI6HoYV+oYV+p5GJp5GJmn94mX93UTQmRTkhlHt0lYB4o4yGooyFnIiBmoZ/lH55lH14h3JsiHRtqJCKqJCLlndvlXZtimhdimxdlX11n4uEuaiju6qmtaahrJuWmIN/lX96iXRuj3x2u6ikv62psZqTq5KLkHBni21frJaR0sfD/v7+/v7+/v7++PX1v62pt6Ofuqmky766/v7+/v7+/v79/f38vK2oo5OJrpiS08nF////////////+vf3wa+ruaWhvaunzsC9////////////////vq+rpJSLkmldn4B2v6yowrCsxLOxuKCfeVRNdlBIdlBJfl1Uw7Gsx7WwvKScuJ+VjGRWgl9LjmJWkGxhooeAooiCpo6Kn4B+a0M7a0M7a0M7bUk+qZCHqpCHmndqmXZogFREfVhCil5RimFTlW1fkGJXbEM3bEU4fktHfktHfktHf0pGcEU4b0U4j2lYkmhZflNEfVhEiV1PiV9QkmdYi1pOXTUlXzophExJhExJhExIhElHYTYnYTcni2ZTkGVVflNEfVhEeEs9d00+fVNEeEs9WzIhWzEgYCseYCseYS8iYS8iXzMkXzUlg19Ph19Qek8/elU/c0k4cEo5dU48cUY3WTIfWDAdVSUTVSYTVisZVisZXTMiXTQigF5Ng15OeVA+eVY+", "steve": "LyANLx8OLR0NLR0NMCAQLh8PKRwLKRwLJRgIJRgIJxoKJxoKKx4OKx4OKh0NKh0NLx8OLx8OLB0NLB0NMCAQLh8PKRwLKBwKJRgIJRkIJxoKKBoKKx4OKx4OKh0NKh0NKx0NKx0NLB0NLR0NLR0NLR0MMiQSNCQSQSoTQSkTPykUPCkWLB0NLB0OKRwLKRwLKx4NLB4MLx8PLx8PLx8OLh8ONiUSNyUQRSoURCsUQisVQCsWLx4OLh4PKRwKKRwLKx4NLiEPtIlvtYluu490vI50xJeAxJZ/u4xzu4xzvI51u45zqHdZpXVbNSQSNCQTLB4NMSAOtohutohtvI9zvY5zxpZ/xZV/u4xzu4xzvY10vY1zqnZYpnVYNiQQNiUSqH1pqH5otIRvs4Rtq35mq35mroBqrX5sn3BcoHFduYlzuodwnGlMnGlLm2lNm2lMq35nqn5ntot2tIt2pHlppHlprYBtrX5soHNgoXNhtIV2s4N0n3BYoHBYnWpPnWpMtIRttIhy/f35+vj3Uz6CVTyBtHpstHxouYlytYR1VD2DWEWF/P35+fn0qH1nq31ms4NqsoZv+fXx9vHxWEKCWUGAr3dqsXlmtoVvsYFzWz+BXUiC+PXx9PDppXtlqHpimmNGnmNHsXtksHxlt4F3tYJ3az8va0AvbEAwbkM0vYhzvIZun2tKn2pKf1M1gFM2m2NHnGNHsnpgsnphs35vsn9wbUAvbEAwbEAwb0QyuIVrt4RnoGpGn2pHgVM1gFM0kV5Dkl1BlV5Bk15BQh8KQh8KiUw/iUw/iUw/hUs8RiAMSSQOj18/jl4+gVM5gVM4j15Ej11DlF9Bk11BQSELQSELh0s+h0s+h0s+g0o8RSINSSUQjV9AjF5AgFI5gFI4b0Usb0UsbUMpbEMpQSEMQiAMQxwKQxwKRiEORSMPRSMPSSQQhFY8g1U7e00ze00zcUUsb0UsbUMqbEMpQSENQiAMQh0KQh0KRSIORiMPRiMPSSQQg1U8g1U7e00zek4z", "alex": "6Y1A6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Yw/6Y0/6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Y0/6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Y0/6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Y0/6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+89q69dq89dq89dq66Yw+6Yw+6Yw+6Yw+6Y0/6Yw+6Yw+6Yw+6Yw+6Yw+6Yw+6Iw+9N7A9t7C9t7C9t7A6Yw+6Yw96Yw+6Yw+6Y0/6Yw+6Yw+6Yw+6Yw+6Ys99t7A9t7B9t7C9t7C9t7C9t7C9t7B9d2+6Yw96Yw+6I0/6Iw96Is+6Ys+6Y0/6Yw+9t7B9t7C9t7C9t7C9d/D9eDD9t7C9N2/6Iw96Iw+9d/D9uDE///9/P37IWMxIWMx8t3A9t7C9t7C9d/CImMyIWQz8PTv/v/+9eDE9t/C9d/D9t/E///+/P77IWMxIWMx8t3A9t7C9t7C9d/CImMxIWQz8PTv///+9d/E9t7C9d/D9t7C9d/D9d/D8dzA8dzA9t7C9t7C9t7C9t7C8dzA8dzA9d7D9d/D9t7C9t7C9d/D9t7C9t7C9t7C9t7C9t7C9t7C9t7B9t7B9t7B9t7C9t7C9t7C9t7C9t7C9t7C9d/D9t7C9t7C9t7C9t7C9d/C8byv8buv8buv8buv9t7C9t7C9t7C9t7C9t7C9t7C9d/D9t7C9t7C9t7C9t7C9d/C8b2w8byv8byv8byv9t7C9t7C9t7C9t7C9t7C9t7C9d/D9t7C9t7C9t7C9t7C9t7C9d7C9d7C9d7C9d/C9t7C9t7C9t7C9t7C9t7C9t7C9d/D9t7C9t7C9t7C9t7C9t7C9t7C9t7C9t7C9t7C9t7C9t7C9t7C9t7C9t7C", "zombie": "R3U1R3U1RW01RG01S3Q3S3U2PWgyPGcxOF8qOF8qPGIvPGIwQ2w1RG01Q2o1Q2o1R3U1R3U1RW01RG01S3Q3S3U2PWgyPGcxOF8pOF8pPGIuPGIvQ2w1RG01Q2o1Q2o1RGw1RGw1RG01RG01RG01RG01T3w+T309WZQ+WZU9W5FEXJFESHA3Rm02PWcxPGcxRG01RG01RG01RG01RG01RG01T3w+T30+WZQ+WZU+W5FDW5FESHA3Rm02PWcxPGcxRG01RG01Z5BWZ5BWbJRcbZRdeZxkeZxkcpZbcpVbcJRdb5RdX4dJXoZIUH4/T30+RG01RG01Z5BWZ5BWbJRcbZRdeZxleZxlcpZbcpVbb5Reb5ReX4dJXoZIUH4+T309Y4VSY4VSao1Wao1VY4VTY4VSaYZWaYZWWntIWnpIcJNacZRaU30/UXs8UXs8UXs8Y4VSY4VSao1Wao1VY4VSY4VTaYZWaYZWWntJWnpIcJNacZRaVHxAUXs9UXs9UXs8ao1VaoxWHR8dHR8dHR4eHR4daIhPa41RcJNZcJNaISQfHR8dHR4dHB4cXXxNYoRRao1Vao1WGhoaGhobGhobGhoaaIhOa41QcZRacZRbHh8dGhocGhobGhoaXXxNY4VSUHw3UHw3ZIdNZYdNb4tYcItZPVYpPFQnPFQoO1UnZo1SaJBTTnw4THs2PWgrO2YqT3s3T3s3Z4xPZ4xOcpBac5BbPFQnOlElOlElOVIlaZJTa5VVUIE5TX83O2cpOWUoSXE3SXE2SXY0SXYzQ2cvQmYvTGwxTWwxTWwxTWwxOl0mOVsmRG8wRXExQGYsQGQsSXA3SXA2SXUzSHUyQWUtQWQsTm0xT20xTm0xTm0xOFskOFkkQ24wRHAxQWUsQWQsNVckNVckM1UiM1UiN1okN1okOFslOFslQmQrQmQsOFskN1okQ2YuRGcvOl8pOV4oNFYjNFYjMlQhMlQhN1okN1okN1okN1okQWQrQWQsOFskN1okQ2YuRGcvOl8pOV4o", "creeper": "pcyfocubRsU3S8Y9g8yDhMuFjcCXhcaNYOFiY+Bhb9xdfNhupcyff7qDLZRFH2QvpMyeoMuaR8Q5TMU+gsyCg8uEjMGVhMaMYOFhY+Bgb9xdfNhupMyef7qDLpRGIGQwLZRFL5NGYIhlWYldCJIGD5gLRsU4Rrk6RIBDTZRIb9xdVsFJDXAPTI9M0tLSjY2NL5dEMJZFWn9gVH9YCYgHEZANTcY/S7pAQYZESZVIaM1YUbNFDWkOTIpM09PTjo6ORsU4RL02AgECAQEBAQEBFRoVpcygjM2PG9ZHF6c5AQEBAQEBAQEBR0dH3NzclJSUP8QyPrwxAgECAQEBAQEBExoUlseUgMiEGcxBFp80AQEBAQEBAQEBQ0dCzt3Oi5WLCbkMCrENAQEBAQEBAQEBBRQIHaE3G5gwDXEPC1kNAQEBAQEBAQEBGkocTOVTNZo5FMAWFbkXDiIMDiIMEyYTFDIXGYgvF4ApC14NEVISIiQiHiQeEiYSJWEmTOBPNJc2TORTTeRTRsU4SMc7YOFiVsdXAQEBAQEBAQEBLC8sxdPCq9epYOFiWNhURsU3MIUnWd1gWdxfQbs6Qrs8TrRQRp9HAQEBAQEBAQEBIyYjnqmbjrONYM9jXs1cW8ZPPoY2jcCXiL6SLZRGKohAAQEBAQEBAQEBAQEBAQEBAQEBAQEBGiMbYIhmeZ59scytd4l1mciglMabNpZLM4pFAQEBAQEBAQEBAQEBAQEBAQEBAQEBHikfbqBzeap+kr+VY4Blw+G/vt64V55cUZJVAQEBAQEBAQEBAQEBAQEBAQEBAQEBKj4qnvCeetOCLZRFH2MvltCYlM+WbKpuZJ1lAQEBBQgGJD0nJz0pNT40KjEpAQEBJDsjhuSDb9BxPKNJKW4yHKI3IaQ7pcyfmLySAAAAERwSfd+IiuCSw+G9mbGWAAAAEzMPRsU4UMhBZcxWRoo7FWwmF24pcIpsZ39jAAAADBMMVpddXpdjg5iAZ3dlAAAADSILMIQnN4ctRYo7MF0p"}
	JC.SKINS = [
		{ n: "Clasico", sk: [224,172,132], hr: [86,56,34], sh: [46,125,210], pn: [52,56,120] }, { n: "Exploradora", sk: [224,172,132], hr: [200,110,40], sh: [70,170,80], pn: [90,70,50] },
		{ n: "Minero", sk: [196,150,110], hr: [40,30,24], sh: [200,140,40], pn: [70,70,80] }, { n: "Ninja", sk: [224,172,132], hr: [20,20,24], sh: [30,30,36], pn: [30,30,36] },
		{ n: "Astronauta", sk: [224,172,132], hr: [230,230,235], sh: [235,235,240], pn: [210,210,220] }, { n: "Pirata", sk: [190,140,100], hr: [120,30,30], sh: [170,40,40], pn: [40,40,60] },
		{ n: "Mago", sk: [224,172,132], hr: [200,200,205], sh: [110,50,170], pn: [60,30,100] }, { n: "Caballero", sk: [224,172,132], hr: [150,150,160], sh: [150,155,165], pn: [100,105,115] },
		{ n: "Granjero", sk: [224,172,132], hr: [230,200,90], sh: [190,60,60], pn: [50,80,150] }, { n: "Robot", sk: [150,155,165], hr: [90,95,105], sh: [120,125,135], pn: [80,85,95] },
		{ n: "Fantasma", sk: [235,235,245], hr: [215,215,230], sh: [225,225,240], pn: [205,205,225] }, { n: "Esqueleto", sk: [225,225,215], hr: [200,200,190], sh: [210,210,200], pn: [170,170,160] }
	].concat([{ n: "Steve", sk: [198,134,100], hr: [60,40,25], sh: [0,170,170], pn: [50,50,150], img: "steve", tex: 0 },
		{ n: "Alex", sk: [222,175,140], hr: [200,110,40], sh: [100,170,70], pn: [100,75,50], img: "alex", tex: 1 },
		{ n: "Herobrine", sk: [198,134,100], hr: [50,30,20], sh: [0,150,150], pn: [50,50,150], img: "herobrine", white: true, tex: 0 },
		{ n: "Zombie", sk: [84,140,72], hr: [60,100,50], sh: [48,112,150], pn: [62,52,128], img: "zombie" },
		{ n: "Creeper", sk: [80,175,70], hr: [60,140,50], sh: [80,175,70], pn: [60,140,50], img: "creeper" }])
	JC.NAMES_ES = {
		craftingTable: "Mesa de crafteo", furnace: "Horno", stick: "Palo", coal: "Carbon", ironIngot: "Lingote de hierro",
		leather: "Cuero", woodPickaxe: "Pico de madera", stonePickaxe: "Pico de piedra", ironPickaxe: "Pico de hierro",
		woodSword: "Espada de madera", stoneSword: "Espada de piedra", ironSword: "Espada de hierro",
		woodAxe: "Hacha de madera", stoneAxe: "Hacha de piedra", ironAxe: "Hacha de hierro", flintAndSteel: "Mechero",
		rawPork: "Chuleta cruda", cookedPork: "Chuleta cocida", rawBeef: "Carne cruda", cookedBeef: "Bistec",
		rawMutton: "Carne de oveja cruda", cookedMutton: "Carne de oveja cocida",
		ironOre: "Mineral de hierro", coalOre: "Mineral de carbon", oakLog: "Tronco de roble", birchLog: "Tronco de abedul",
		oakPlanks: "Tablones", cobblestone: "Roca", stone: "Piedra", dirt: "Tierra", grass: "Cesped", whiteWool: "Lana",
		glowstone: "Bloque de luz", sand: "Arena", gravel: "Grava", leaves: "Hojas", obsidian: "Obsidiana", lavaBlock: "Lava", netherPortal: "Portal del Nether"
	}

	// ------------------------------------------------------------------
	// BLOQUES NUEVOS. Formato: { name, es, tex: fn(x,y)->[r,g,b,variacion] }
	//   tex puede ser { top: fn, side: fn }.  transparent:true + raw:true => fn devuelve [r,g,b,alpha0-255]
	//   item:true => objeto (sin textura de bloque; su dibujo va en JC.sprites)
	// ------------------------------------------------------------------
	const N = (r, g, b, v) => () => [r, g, b, v === undefined ? 0.08 : v]
	const BR = (c1, c2, v) => (x, y) => (y % 4 === 0 || (x + ((y >> 2) & 1 ? 4 : 0)) % 8 === 0) ? c2.concat(v || 0.1) : c1.concat(v || 0.1)
	const PL = (c1, c2) => (x, y) => (y % 4 === 0) ? c2.concat(0.08) : c1.concat(0.1)
	const CK = (c1, c2, s) => (x, y) => (((x / s | 0) + (y / s | 0)) & 1) ? c1.concat(0.08) : c2.concat(0.08)
	JC.BLOCKS = [
		{ name: "copperBlock", es: "Bloque de cobre", tex: (x, y) => ((x + y) % 8 === 0) ? [150, 80, 55, 0.1] : [196, 110, 76, 0.1] },
		{ name: "oxidizedCopper", es: "Cobre oxidado", tex: (x, y) => ((x * 3 + y * 5) % 7 < 2) ? [48, 130, 112, 0.1] : [70, 170, 148, 0.1] },
		{ name: "deepslate", es: "Pizarra abisal", tex: (x, y) => (y % 5 === 0) ? [44, 44, 50, 0.12] : [62, 62, 70, 0.14] },
		{ name: "deepslateBricks", es: "Ladrillos de pizarra", tex: BR([64, 64, 72], [38, 38, 44]) },
		{ name: "tuff", es: "Toba", tex: N(108, 109, 100, 0.2) },
		{ name: "calcite", es: "Calcita", tex: N(226, 226, 220, 0.07) },
		{ name: "amethystBlock", es: "Bloque de amatista", tex: CK([150, 104, 210], [122, 84, 184], 4) },
		{ name: "cherryPlanks", es: "Tablones de cerezo", tex: PL([228, 176, 186], [205, 150, 162]) },
		{ name: "cherryLeaves", es: "Hojas de cerezo", transparent: true, raw: true, tex: () => { const c = Math.random(); return [c < 0.5 ? 244 : 232, c < 0.5 ? 176 : 150, c < 0.5 ? 196 : 176, Math.random() < 0.3 ? 0 : 255] } },
		{ name: "bambooPlanks", es: "Tablones de bambu", tex: PL([216, 194, 96], [190, 168, 70]) },
		{ name: "mudBricks", es: "Ladrillos de barro", tex: BR([138, 104, 86], [100, 74, 60]) },
		{ name: "mossBlock", es: "Bloque de musgo", tex: N(90, 112, 44, 0.2) },
		{ name: "honeycomb", es: "Panal", tex: (x, y) => ((x % 4 === 0) !== (y % 4 === 0)) ? [255, 196, 60, 0.06] : [226, 146, 24, 0.06] },
		{ name: "seaLantern", es: "Linterna marina", tex: (x, y) => (x % 8 < 1 || y % 8 < 1) ? [120, 160, 150, 0.06] : [186, 214, 204, 0.06] },
		{ name: "prismarine", es: "Prismarina", tex: (x, y) => ((x * 7 + y * 3) % 9 < 3) ? [76, 150, 138, 0.1] : [100, 176, 162, 0.1] },
		{ name: "blackstone", es: "Piedra negra", tex: (x, y) => ((x * 5 + y * 3) % 11 < 2) ? [66, 58, 66, 0.15] : [40, 34, 40, 0.2] },
		{ name: "hayBale", es: "Fardo de heno", tex: { top: (x, y) => (Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5)) | 0) % 3 === 0 ? [150, 110, 20, 0.1] : [200, 170, 52, 0.1], side: (x, y) => (x % 4 === 0) ? [150, 110, 20, 0.1] : [214, 180, 60, 0.1] } },
		{ name: "cutCopper", es: "Cobre cortado", tex: BR([196, 110, 76], [150, 80, 55]) },
		{ name: "polishedDeepslate", es: "Pizarra pulida", tex: CK([70, 70, 78], [62, 62, 70], 8) },
		{ name: "terracotta", es: "Terracota", tex: N(152, 94, 68, 0.1) },
		{ name: "packedIce", es: "Hielo compacto", tex: (x, y) => ((x * 5 + y * 7) % 11 < 3) ? [170, 200, 255, 0.05] : [128, 164, 240, 0.05] },
		// items (los usa fase2.js)
		{ name: "feather", es: "Pluma", item: true },
		{ name: "egg", es: "Huevo", item: true },
		{ name: "string", es: "Hilo", item: true },
		// biomas (agregados al final para no mover los ids de lo anterior)
		{ name: "redDirt", es: "Tierra roja", tex: (x, y) => ((x * 7 + y * 3) % 9 < 2) ? [122, 78, 50, 0.1] : [138, 90, 58, 0.1] },
		{ name: "redGrass", es: "Cesped rojizo", tex: { top: N(62, 104, 44, 0.12), side: (x, y) => y < 4 ? [62, 104, 44, 0.12] : [138, 90, 58, 0.1] } },
		{ name: "mud", es: "Barro", tex: (x, y) => ((x + y * 2) % 7 === 0) ? [88, 70, 52, 0.04] : [74, 58, 42, 0.04] },
		{ name: "clay", es: "Arcilla", tex: N(168, 168, 184, 0.04) },
		{ name: "cactus", es: "Cactus", tex: { top: (x, y) => (Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5)) | 0) % 3 === 0 ? [30, 100, 40, 0.06] : [48, 130, 56, 0.06], side: (x, y) => (x % 4 === 0 && y % 3 === 0) ? [232, 232, 170, 0] : (x % 15 < 1 ? [30, 96, 40, 0.05] : [50, 140, 60, 0.07]) } },
		{ name: "reeds", es: "Juncos", transparent: true, raw: true, tex: (x, y) => (x % 4 === 1 || x % 6 === 4) ? [150 + (y % 3) * 8, 170, 70, 255] : [0, 0, 0, 0] },
		{ name: "bamboo", es: "Bambu", transparent: true, raw: true, tex: (x, y) => (x >= 6 && x <= 9) ? [(y % 8 === 0) ? 70 : 104, (y % 8 === 0) ? 130 : 178, 52, 255] : [0, 0, 0, 0] }
,
		// fase 3: items (al final para no mover ids)
		{ name: "diamond", es: "Diamante", item: true },
		{ name: "goldIngot", es: "Lingote de oro", item: true },
		{ name: "emerald", es: "Esmeralda", item: true },
		{ name: "bone", es: "Hueso", item: true },
		{ name: "rawFish", es: "Pescado crudo", item: true },
		{ name: "cookedFish", es: "Pescado cocido", item: true },
		{ name: "diamondPickaxe", es: "Pico de diamante", item: true },
		{ name: "diamondSword", es: "Espada de diamante", item: true },
		{ name: "diamondAxe", es: "Hacha de diamante", item: true },
		{ name: "leatherHelmet", es: "Casco de cuero", item: true },
		{ name: "leatherChestplate", es: "Peto de cuero", item: true },
		{ name: "leatherLeggings", es: "Pantalones de cuero", item: true },
		{ name: "leatherBoots", es: "Botas de cuero", item: true },
		{ name: "ironHelmet", es: "Casco de hierro", item: true },
		{ name: "ironChestplate", es: "Peto de hierro", item: true },
		{ name: "ironLeggings", es: "Pantalones de hierro", item: true },
		{ name: "ironBoots", es: "Botas de hierro", item: true },
		{ name: "diamondHelmet", es: "Casco de diamante", item: true },
		{ name: "diamondChestplate", es: "Peto de diamante", item: true },
		{ name: "diamondLeggings", es: "Pantalones de diamante", item: true },
		{ name: "diamondBoots", es: "Botas de diamante", item: true }
	]
	JC.NEWSET = new Set(JC.BLOCKS.filter(b => !b.item).map(b => b.name))
	JC.BLOCKS.forEach(b => { JC.NAMES_ES[b.name] = b.es })
	// dibujo 16x16 de los items nuevos: rect(x, y, ancho, alto, color)
	JC.sprites = {
		feather: r => { r(10, 2, 3, 3, "#f4f4f4"); r(8, 4, 3, 3, "#ffffff"); r(6, 6, 3, 3, "#e6e6e6"); r(5, 8, 2, 3, "#dcdcdc"); r(4, 11, 2, 2, "#aaa"); r(3, 13, 1, 2, "#777") },
		egg: r => { r(6, 3, 4, 2, "#f0e2c4"); r(5, 5, 6, 6, "#f4e8cc"); r(6, 11, 4, 2, "#e2d2ae"); r(6, 5, 2, 2, "#fff6e2") },
		string: r => { r(3, 3, 2, 2, "#d8d8d8"); r(5, 5, 2, 2, "#cfcfcf"); r(7, 7, 2, 2, "#d8d8d8"); r(9, 9, 2, 2, "#cfcfcf"); r(11, 11, 2, 2, "#d8d8d8") }
	}


	// ---- fase 3: herramientas, comida, armadura (el motor lee JC.TOOLS / JC.FOODS / JC.ARMOR) ----
	JC.TOOLS = [["diamondPickaxe", "pick", 4, 5], ["diamondSword", "sword", 4, 7], ["diamondAxe", "axe", 4, 6]]
	JC.FOODS = [["rawFish", 2], ["cookedFish", 6]]
	JC.ARMOR = {}
	const PTS = { Helmet: ["h", [1, 2, 3]], Chestplate: ["c", [3, 6, 8]], Leggings: ["l", [2, 5, 6]], Boots: ["b", [1, 2, 3]] }
	const MATC = { leather: ["#8a5a32", "#6b4423"], iron: ["#e8e8e8", "#a4a4a4"], diamond: ["#4de8d8", "#1fa89c"] }
	Object.keys(MATC).forEach((mat, mi) => Object.keys(PTS).forEach(k => {
		const nm = mat + k; JC.ARMOR[nm] = [PTS[k][0], PTS[k][1][mi]]; const c1 = MATC[mat][0], c2 = MATC[mat][1]
		JC.sprites[nm] = k === "Helmet" ? r => { r(3, 4, 10, 5, c1); r(3, 9, 3, 4, c1); r(10, 9, 3, 4, c1); r(4, 5, 8, 1, c2) }
			: k === "Chestplate" ? r => { r(2, 3, 12, 4, c1); r(4, 7, 8, 7, c1); r(2, 3, 3, 6, c2); r(11, 3, 3, 6, c2); r(7, 4, 2, 9, c2) }
			: k === "Leggings" ? r => { r(4, 2, 8, 5, c1); r(4, 7, 3, 7, c1); r(9, 7, 3, 7, c1); r(4, 3, 8, 1, c2) }
			: r => { r(3, 8, 4, 5, c1); r(9, 8, 4, 5, c1); r(3, 12, 4, 1, c2); r(9, 12, 4, 1, c2) }
	}))
	Object.assign(JC.sprites, {
		diamond: r => { r(6, 3, 4, 1, "#b8fff6"); r(4, 4, 8, 3, "#4de8d8"); r(5, 7, 6, 3, "#2fc9ba"); r(7, 10, 2, 2, "#1fa89c"); r(5, 4, 2, 1, "#e8fffb") },
		goldIngot: r => { r(4, 6, 9, 5, "#f3c93a"); r(4, 10, 9, 1, "#b8901c"); r(4, 6, 9, 1, "#fff08a"); r(12, 6, 1, 5, "#d8a82a") },
		emerald: r => { r(6, 3, 4, 1, "#9bf5b4"); r(4, 4, 8, 3, "#2fcf5a"); r(5, 7, 6, 3, "#1fa845"); r(7, 10, 2, 2, "#157a30") },
		bone: r => { r(3, 3, 3, 3, "#f2efe0"); r(5, 5, 2, 2, "#f2efe0"); r(7, 7, 2, 2, "#e4e0cc"); r(9, 9, 2, 2, "#f2efe0"); r(10, 10, 3, 3, "#f2efe0") },
		rawFish: r => { r(3, 6, 8, 4, "#8d98a0"); r(11, 5, 3, 6, "#6f7a82"); r(4, 7, 1, 1, "#111"); r(5, 9, 6, 1, "#c8d0d4") },
		cookedFish: r => { r(3, 6, 8, 4, "#b9743f"); r(11, 5, 3, 6, "#8a5128"); r(4, 7, 1, 1, "#222"); r(5, 9, 6, 1, "#d9a066") }
	})

})()
