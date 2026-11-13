# TalcoCloud

Notes personnelles (Personal) + discussions publiques (Community) + réglages (Settings), PWA Firebase.

## Mise en ligne
1. Mets **tous les fichiers à la racine** de ton dépôt (favicons inclus), servis en HTTPS.
2. Firebase → Authentication : active « E-mail/Mot de passe » et ajoute ton domaine aux domaines autorisés.
3. Firebase → Realtime Database → Règles : colle le contenu de `firebase-rules.json` et publie.

## Outils Python (`tools/`)
- `python3 tools/make_icons.py` : régénère les icônes PNG (nécessite Pillow).
- `python3 tools/build.py` : versionne le cache hors-ligne (`sw.js`) et crée `TalcoCloud.zip`. À relancer après chaque modification.
