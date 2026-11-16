# Gera assets/animacoes/gas.webm, gas_toxico.webm, cura.webm e estimulante.webm.
# Uso: python gas_cura_estimulante.py <pasta>  → quadros em <pasta>/<nome>/; depois, para cada um:
#   ffmpeg -framerate 24 -i q%03d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 -auto-alt-ref 0 <nome>.webm
# Gás (nuvem translúcida), cura e estimulante (pulsos leves) desenhados por código.
# Uso: suaves.py <pasta de saída>  → subpastas de quadros PNG (24 fps, 512 px, fundo transparente)
import sys, os, math, random
from PIL import Image, ImageDraw, ImageFilter
saida = sys.argv[1]; L = 512; c = L / 2
ease = lambda k: 1 - (1 - k) ** 3
def salvar(nome, quadros):
    d = os.path.join(saida, nome); os.makedirs(d, exist_ok=True)
    for i, q in enumerate(quadros): q.save(os.path.join(d, f"q{i:03d}.png"))

def gas(nome, cor, seed, Q=60):
    """Tufos macios que saem do centro, se espalham, giram devagar e se desfazem (2,5 s)."""
    rnd = random.Random(seed)
    tufos = [dict(ang=rnd.uniform(0, 2*math.pi), dist=rnd.uniform(0.15, 1.0), r=rnd.uniform(38, 80),
                  giro=rnd.uniform(-0.4, 0.4), atraso=rnd.uniform(0, 0.25), a=rnd.uniform(0.5, 1.0)) for _ in range(34)]
    quadros = []
    for q in range(Q):
        t = q / (Q - 1)
        cam = Image.new("RGBA", (L, L), (0, 0, 0, 0)); d = ImageDraw.Draw(cam)
        geral = min(1, t / 0.15) * (1 - max(0, (t - 0.55) / 0.45)) ** 1.3     # aparece rápido, some devagar
        for p in tufos:
            k = max(0, min(1, (t - p["atraso"]) / 0.8))
            if k <= 0: continue
            dist = 30 + 150 * p["dist"] * ease(k)
            ang = p["ang"] + p["giro"] * t
            x, y = c + dist * math.cos(ang), c + dist * math.sin(ang)
            r = p["r"] * (0.5 + 0.8 * ease(k))
            a = int(95 * p["a"] * geral)
            d.ellipse([x - r, y - r, x + r, y + r], fill=(*cor, a))
        cam = cam.filter(ImageFilter.GaussianBlur(22))
        # recorte redondo e macio: nada encosta na borda do arquivo
        m = Image.new("L", (L, L), 0); ImageDraw.Draw(m).ellipse([20, 20, L - 20, L - 20], fill=255)
        m = m.filter(ImageFilter.GaussianBlur(30))
        a = Image.composite(cam.getchannel("A"), Image.new("L", (L, L), 0), m); cam.putalpha(a)
        quadros.append(cam)
    salvar(nome, quadros)

def cura(Q=36):
    """Brilho dourado suave em volta do token, com faíscas e pequenas cruzes que sobem (1,5 s)."""
    rnd = random.Random(5)
    faiscas = [dict(x=rnd.uniform(-130, 130), y0=rnd.uniform(40, 150), v=rnd.uniform(140, 260), s=rnd.uniform(3, 6),
                    atraso=rnd.uniform(0, 0.45), cruz=rnd.random() < 0.35) for _ in range(26)]
    quadros = []
    for q in range(Q):
        t = q / (Q - 1)
        cam = Image.new("RGBA", (L, L), (0, 0, 0, 0))
        brilho = Image.new("RGBA", (L, L), (0, 0, 0, 0)); db = ImageDraw.Draw(brilho)
        a = int(110 * math.sin(math.pi * t))
        r = 120 + 25 * t
        db.ellipse([c - r, c - r, c + r, c + r], fill=(255, 225, 140, a))
        cam = Image.alpha_composite(cam, brilho.filter(ImageFilter.GaussianBlur(40)))
        d = ImageDraw.Draw(cam)
        for f in faiscas:
            k = (t - f["atraso"]) / 0.55
            if not 0 <= k <= 1: continue
            x = c + f["x"]; y = c + f["y0"] - f["v"] * k
            al = int(235 * math.sin(math.pi * k)); s = f["s"]
            if f["cruz"]:
                d.rectangle([x - s * 0.45, y - s * 1.6, x + s * 0.45, y + s * 1.6], fill=(255, 245, 200, al))
                d.rectangle([x - s * 1.6, y - s * 0.45, x + s * 1.6, y + s * 0.45], fill=(255, 245, 200, al))
            else:
                d.ellipse([x - s, y - s, x + s, y + s], fill=(255, 236, 170, al))
        quadros.append(Image.alpha_composite(cam.filter(ImageFilter.GaussianBlur(2)), cam))
    salvar("cura", quadros)

def estimulante(Q=30):
    """Batida dupla de coração: dois pulsos finos vermelhos e um brilho que some (1,25 s)."""
    quadros = []
    pulsos = [(0.0, 1.0), (0.22, 0.75)]           # (início, força): tum-TUM
    for q in range(Q):
        t = q / (Q - 1)
        cam = Image.new("RGBA", (L, L), (0, 0, 0, 0))
        brilho = Image.new("RGBA", (L, L), (0, 0, 0, 0)); db = ImageDraw.Draw(brilho)
        for ini, forca in pulsos:
            k = (t - ini) / 0.55
            if 0 <= k <= 1:
                a = int(120 * forca * (1 - k) ** 1.5); r = 70 + 50 * ease(k)
                db.ellipse([c - r, c - r, c + r, c + r], fill=(255, 40, 40, a))
        cam = Image.alpha_composite(cam, brilho.filter(ImageFilter.GaussianBlur(30)))
        d = ImageDraw.Draw(cam)
        for ini, forca in pulsos:
            k = (t - ini) / 0.6
            if 0 <= k <= 1:
                R = 90 + 120 * ease(k); a = int(230 * forca * (1 - k) ** 1.4); w = max(2, int(6 * (1 - k)))
                d.ellipse([c - R, c - R, c + R, c + R], outline=(255, 90, 80, a), width=w)
        quadros.append(Image.alpha_composite(cam.filter(ImageFilter.GaussianBlur(4)), cam))
    salvar("estimulante", quadros)

gas("gas", (235, 230, 190), 11)            # lacrimogêneo e pimenta: branco amarelado
gas("gas_toxico", (150, 215, 70), 23)      # mostarda e Miasma: verde-amarelo
cura(); estimulante()
print("ok")
