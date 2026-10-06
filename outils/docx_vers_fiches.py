#!/usr/bin/env python3
"""Convertit les fiches Word (.docx) en un fichier privé de fiches à importer dans l'appli.

Usage : python3 outils/docx_vers_fiches.py "/chemin/du/dossier des fiches" [fichier de sortie .json]
Par défaut : ~/Documents/RegistrePatient-prive/mes-fiches.json (hors du dépôt, jamais publié).
Les images des documents ne sont pas reprises (le site est public) : un repère est laissé à leur place,
elles s'ajoutent dans l'appli (« Mes images »), où elles restent sur le téléphone.
"""
import json, re, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

# nom du fichier Word -> (id fixe, titre affiché dans l'appli). L'id ne doit jamais changer.
FICHES = {
    'Fracture perthrochantérienne - DHS.docx': ('dhs-pertrochanterienne', 'DHS'),
    'Fracture bimalléolaire.docx': ('bimalleolaire', 'Fracture bimalléolaire'),
    'Fracture jambe-clou.docx': ('clou-tibia', 'Clou tibial'),
    'Fracture de l.docx': ('humerus-proximal', 'Humérus proximal'),
    'Fracture col du fémur-PIH.docx': ('pih-col-femur', 'PIH'),
    'Fracture poignet-plaque antérieur.docx': ('radius-distal-plaque', 'Plaque de poignet'),
}

IMAGE = '🖼 Schéma de la fiche Word : à ajouter dans « Mes images » en haut de la fiche'


def on(rpr, tag):
    el = rpr.find(W + tag) if rpr is not None else None
    return el is not None and el.get(W + 'val') not in ('0', 'false')


def paragraph(p):
    """Renvoie (texte avec **gras**, texte brut, niveau de liste ou None, contient une image)."""
    ppr = p.find(W + 'pPr')
    level = None
    if ppr is not None and ppr.find(W + 'numPr') is not None:
        ilvl = ppr.find(W + 'numPr').find(W + 'ilvl')
        level = int(ilvl.get(W + 'val')) if ilvl is not None else 0
    parts, plain = [], []
    for r in p.iter(W + 'r'):
        text = ''
        for el in r:
            if el.tag == W + 't':
                text += el.text or ''
            elif el.tag in (W + 'tab', W + 'br'):
                text += ' '
            elif el.tag == W + 'sym':
                text += '→'
        text = re.sub('[]', '→', text)  # flèches Wingdings
        if not text:
            continue
        rpr = r.find(W + 'rPr')
        color = rpr.find(W + 'color') if rpr is not None else None
        red = color is not None and color.get(W + 'val', '').upper() == 'EE0000'
        # gras et rouge deviennent du gras (**…**), seule mise en valeur gérée par l'appli
        parts.append((text, on(rpr, 'b') or red))
        plain.append(text)
    merged = ''
    for text, bold in parts:
        core = text.strip()
        if bold and core:
            lead, trail = text[:len(text) - len(text.lstrip())], text[len(text.rstrip()):]
            merged += f'{lead}**{core}**{trail}'
        else:
            merged += text
    merged = re.sub(r'\*\*(\s*)\*\*', r'\1', merged)  # recolle les morceaux de gras voisins
    has_image = next(p.iter(W + 'drawing'), None) is not None
    return re.sub(r'\s+', ' ', merged).strip(), re.sub(r'\s+', ' ', ''.join(plain)).strip(), level, has_image


def convert(path):
    """Découpe le document en rubriques : { entete, sections: [{ titre, texte }] }."""
    with zipfile.ZipFile(path) as z:
        body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    items = []  # (genre, texte) avec genre parmi h3, h4, p, li, sub, img
    for p in body.iter(W + 'p'):
        text, plain, level, has_image = paragraph(p)
        bare = text.replace('**', '')
        if plain:
            if level is not None:
                items.append(('sub' if level else 'li', text))
            elif re.match(r'^\d+\.\s+[A-ZÀ-Ý’\']{3,}', plain):
                items.append(('h3', bare))
            elif not items or plain.startswith('('):
                items.append(('tete', bare))
            elif len(plain) < 70 and not plain.endswith('.'):
                items.append(('h4', bare))
            else:
                items.append(('p', text))
        if has_image and (not items or items[-1][0] != 'img'):
            items.append(('img', IMAGE))

    # Les rubriques sont les grands titres numérotés ; à défaut (fiche courte), les sous-titres.
    cut = 'h3' if any(kind == 'h3' for kind, _ in items) else 'h4'
    entete, sections, current = [], [], None
    for kind, text in items:
        if kind == 'tete' and current is None and not sections:
            entete.append(text)
        elif kind == cut:
            current = {'titre': text.rstrip(' :'), 'lines': []}
            sections.append(current)
        else:
            if current is None:
                current = {'titre': 'Généralités', 'lines': []}
                sections.append(current)
            if kind == 'h4':
                current['lines'] += ['', '# ' + text]
            elif kind == 'li':
                current['lines'].append('- ' + text)
            elif kind == 'sub':
                current['lines'].append('  - ' + text)
            else:
                current['lines'] += ['', text, ''] if kind == 'img' else [text]
    out = []
    for s in sections:
        texte = re.sub(r'\n{3,}', '\n\n', '\n'.join(s['lines'])).strip()
        out.append({'titre': s['titre'], 'texte': texte})
    return {'entete': ' '.join(entete), 'sections': out}


def main():
    folder = Path(sys.argv[1])
    fiches = []
    for name, (fid, titre) in FICHES.items():
        # macOS peut stocker les accents sous forme décomposée : on compare sans tenir compte de la forme.
        import unicodedata
        match = next((f for f in folder.glob('*.docx') if unicodedata.normalize('NFC', f.name) == unicodedata.normalize('NFC', name)), None)
        if not match:
            print('Introuvable :', name)
            continue
        fiches.append({'id': fid, 'titre': titre, **convert(match)})
    # Les fiches sont personnelles : elles ne vont plus dans le site (public) mais dans un fichier privé,
    # à importer dans l'appli par ⚙︎ → « Importer des fiches ».
    for fiche in fiches:
        for n, sec in enumerate(fiche['sections'], 1):
            sec['id'] = f's{n}'
    target = Path(sys.argv[2]) if len(sys.argv) > 2 else Path.home() / 'Documents' / 'RegistrePatient-prive' / 'mes-fiches.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({'type': 'fiches-registre-operatoire', 'fiches': fiches}, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{len(fiches)} fiches écrites dans {target}')


if __name__ == '__main__':
    main()
