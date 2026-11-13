"""Génère les icônes PNG de TalcoCloud à la racine du projet (favicon, PWA, iOS)."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
A, B = (35, 195, 160), (43, 125, 233)

def gradient(n):
    g = Image.new("RGB", (256, 256))
    px = g.load()
    for y in range(256):
        for x in range(256):
            t = (x + y) / 510
            px[x, y] = tuple(round(A[i] + (B[i] - A[i]) * t) for i in range(3))
    return g.resize((n, n), Image.BICUBIC)

def icon(size, rounded=True, scale=1.0):
    S = 4                       # sur-échantillonnage pour des bords nets
    n = size * S
    img = gradient(n)
    k = n / 512
    mask = Image.new("L", (n, n), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, n - 1, n - 1), radius=118 * k if rounded else 0, fill=255)
    cloud = Image.new("L", (n, n), 0)
    d = ImageDraw.Draw(cloud)
    def tf(v):  # redimensionne autour du centre
        return (256 + (v - 256) * scale) * k
    d.rounded_rectangle((tf(118), tf(262), tf(394), tf(362)), radius=50 * scale * k, fill=255)
    for cx, cy, r in ((205, 270, 68), (305, 245, 82)):
        d.ellipse((tf(cx - r), tf(cy - r), tf(cx + r), tf(cy + r)), fill=255)
    white = Image.new("RGB", (n, n), (255, 255, 255))
    img.paste(white, mask=cloud)
    out = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    out.paste(img, mask=mask)
    return out.resize((size, size), Image.LANCZOS)

icon(32).save(ROOT / "favicon.png")
icon(192).save(ROOT / "icon-192.png")
icon(512).save(ROOT / "icon-512.png")
icon(512, rounded=False, scale=0.72).save(ROOT / "icon-maskable-512.png")
icon(180, rounded=False).convert("RGB").save(ROOT / "apple-touch-icon.png")
print("icônes générées")
