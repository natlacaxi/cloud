"""Versionne le cache du service worker (hash du contenu) puis crée TalcoCloud.zip."""
import hashlib, re, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "TalcoCloud.zip"
SKIP = {"__pycache__", ".DS_Store"}

files = sorted(p for p in ROOT.rglob("*") if p.is_file() and not (SKIP & set(p.parts)) and p.name != "sw.js")
h = hashlib.sha1()
for p in files:
    h.update(p.relative_to(ROOT).as_posix().encode())
    h.update(p.read_bytes())
version = "talcocloud-" + h.hexdigest()[:10]

sw = ROOT / "sw.js"
sw.write_text(re.sub(r'const CACHE = "[^"]*";', f'const CACHE = "{version}";', sw.read_text(encoding="utf-8")), encoding="utf-8")

with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for p in sorted(ROOT.rglob("*")):
        if p.is_file() and not (SKIP & set(p.parts)):
            z.write(p, p.relative_to(ROOT).as_posix())   # fichiers à la racine du zip
print(version, "->", OUT, f"({OUT.stat().st_size // 1024} Ko)")
