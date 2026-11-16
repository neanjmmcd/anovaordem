# Gera assets/animacoes/soco.webm e impacto.webm a partir de ref_soco.png e ref_impacto.png (recortes da folha de referência do usuário).
# Uso: python soco_impacto.py <esta pasta (ferramentas/efeitos)>  → quadros em soco_pow/ e impacto_pow/; depois, para cada um:
#   ffmpeg -framerate 24 -i q%03d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 -auto-alt-ref 0 <nome>.webm
# Soco e impacto a partir das figuras de referência (branco em fundo preto): brilho vira transparência.
import sys
from PIL import Image, ImageFilter, ImageDraw
pasta = sys.argv[1]
L = 512; c = L // 2
def rgba(cinza):
    a = cinza.point(lambda v: 0 if v < 18 else min(255, int((v - 18) * 1.25)))
    return Image.merge("RGBA", (Image.new("L", cinza.size, 248), Image.new("L", cinza.size, 250), Image.new("L", cinza.size, 255), a))
def mult_alfa(im, f):
    im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * f))); return im
def colar(base, spr, cx, cy, escala=1.0, giro=0.0, alfa=1.0):
    s = spr
    if escala != 1.0: s = s.resize((max(1, int(s.width * escala)), max(1, int(s.height * escala))), Image.LANCZOS)
    if giro: s = s.rotate(giro, resample=Image.BICUBIC, expand=True)
    if alfa < 1: s = mult_alfa(s, alfa)
    cam = Image.new("RGBA", (L, L), (0, 0, 0, 0)); cam.paste(s, (int(cx - s.width / 2), int(cy - s.height / 2)), s)
    return Image.alpha_composite(base, cam)
ease = lambda k: 1 - (1 - k) ** 3
def salvar(frames, nome):
    import os; d = f"{pasta}/{nome}"; os.makedirs(d, exist_ok=True)
    for i, f in enumerate(frames): f.save(f"{d}/q{i:03d}.png")

# ---------- IMPACTO (estrela POW) ----------
imp = Image.open(f"{pasta}/ref_impacto.png").convert("L")
m = Image.new("L", imp.size, 0); ImageDraw.Draw(m).rectangle([40, 0, 470, imp.height], fill=255)   # tira restos dos vizinhos
imp = Image.composite(imp, Image.new("L", imp.size, 0), m)
imp = rgba(imp.crop((0, 0, 512, 300)))           # centro da estrela ~ (255,150) = centro do recorte
fr = []
for q in range(15):
    base = Image.new("RGBA", (L, L), (0, 0, 0, 0))
    if q < 4: e = 0.45 + 0.55 * ease(min(1, (q + 1) / 3)); a = 1.0
    else:
        k = (q - 4) / 10; e = 1.0 + 0.18 * k; a = (1 - k) ** 1.4
    fr.append(colar(base, imp, c, c, e * 1.05, giro=6 * q / 13, alfa=a))
salvar(fr, "impacto_pow")

# ---------- SOCO (braço + punho entram, explosão estoura no contato) ----------
soco = Image.open(f"{pasta}/ref_soco.png").convert("L")
W, H = soco.size; bx, by = 365, 165             # centro da explosão (nós dos dedos)
grad = Image.linear_gradient("L").rotate(90, expand=True).resize((W, H))   # 255 à esquerda → 0 à direita
corte = 345
braco_m = Image.new("L", (W, H), 0); ImageDraw.Draw(braco_m).rectangle([0, 112, corte, 232], fill=255)   # só a faixa do braço
braco_m = braco_m.filter(ImageFilter.GaussianBlur(10))
estouro_m = Image.new("L", (W, H), 0); ImageDraw.Draw(estouro_m).rectangle([corte - 25, 0, W, H], fill=255)
estouro_m = estouro_m.filter(ImageFilter.GaussianBlur(10))
braco = rgba(Image.composite(soco, Image.new("L", (W, H), 0), braco_m))
inteiro = rgba(soco)
estouro = rgba(Image.composite(soco, Image.new("L", (W, H), 0), estouro_m))
esc = 0.92
dx, dy = (W / 2 - bx) * esc, (H / 2 - by) * esc  # desloca para a explosão ficar no centro do quadro
fr = []
for q in range(18):
    base = Image.new("RGBA", (L, L), (0, 0, 0, 0))
    if q < 5:                                    # braço avança
        k = ease((q + 1) / 5); off = -170 * (1 - k)
        fr.append(colar(base, braco, c + dx + off, c + dy, esc, alfa=0.35 + 0.6 * k))
    else:                                        # contato: explosão cresce e tudo some
        k = (q - 5) / 12
        a = 1.0 if k < 0.3 else (1 - (k - 0.3) / 0.7) ** 1.4   # segura a explosão e depois some
        b2 = colar(base, braco, c + dx + 8 * k, c + dy, esc, alfa=0.95 * a)
        e = 0.55 + 0.6 * ease(min(1, k * 3)) if k < 0.34 else 1.15 + 0.1 * k
        # a explosão cresce em volta dos nós dos dedos
        ex = estouro.resize((int(W * esc * e), int(H * esc * e)), Image.LANCZOS)
        ox = c - (bx * esc * e) + ex.width / 2; oy = c - (by * esc * e) + ex.height / 2
        b2 = colar(b2, ex, ox, oy, 1.0, alfa=a)
        fr.append(b2)
salvar(fr, "soco_pow")
print("ok")
