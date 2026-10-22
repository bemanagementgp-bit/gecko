"""
Procesa el material crudo de ../videos-gecko y genera los archivos optimizados de public/media.

  python scripts/build-media.py            # procesa lo que falta
  python scripts/build-media.py --force    # rehace todo

Requiere: ffmpeg/ffprobe en el PATH, Pillow y pillow-heif (pip install pillow pillow-heif).
Las fotos salen en WebP a 640 y 1600 px (lado largo). Los clips salen en H.264 sin audio,
los reels con audio. Para sumar material nuevo, agregá entradas al MANIFEST.
"""
import os, sys, subprocess, json
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '..', '..', 'videos-gecko'))
OUT = os.path.normpath(os.path.join(HERE, '..', 'public', 'media'))
FORCE = '--force' in sys.argv
SIZES = (640, 1600)

FG = 'Farmacia GARCIA'
GV = 'Grafica Varios'
CO = 'Grafica Varios/corporeas'
VE = 'Grafica Varios/Grafica vehicular'
T = '19.10'

# ---------- fotos de proyectos: (carpeta destino, nombre, archivo fuente) ----------
PHOTOS = {
    'farmacia-garcia': [
        ('cover', f'{FG}/IMG_7979.JPG'), ('noche-frente', f'{FG}/IMG_7993.JPG'), ('isologo', f'{FG}/IMG_8026.JPG'),
        ('acceso', f'{FG}/IMG_8045.JPG'), ('letras', f'{FG}/IMG_8046.JPG'), ('vidriera-noche', f'{FG}/IMG_8047.JPG'),
        ('cruz', f'{FG}/IMG_8170.JPG'), ('vinilo', f'{FG}/IMG_8175.JPG'), ('vidriera-dia', f'{FG}/IMG_8168.JPG'),
        ('panel-dia', f'{FG}/IMG_8183.JPG'), ('dia', f'{FG}/IMG_8165.JPG'), ('obra-1', f'{FG}/IMG_7429.HEIC'),
        ('obra-2', f'{FG}/IMG_7437.HEIC'), ('largaexpo', f'{FG}/edit 1.png'), ('antes', f'{FG}/photo1712860922 (6).jpeg'),
        ('instalacion-vinilo', f'{GV}/IMG_5392.JPG'), ('acceso-dia', f'{GV}/IMG_5407.JPG'),
    ],
    'farmacia-sanchez': [
        ('cover', f'{GV}/IMG_5654.JPG'), ('vidriera', f'{GV}/IMG_5657.JPG'), ('puerta', f'{GV}/IMG_5651.JPG'),
        ('puerta-2', f'{GV}/IMG_5649.JPG'), ('detalle', f'{GV}/IMG_5645.JPG'),
    ],
    'farmacia-roux': [('cover', f'{GV}/IMG_8275.JPG')],
    'club-rambla': [
        ('cover', f'{GV}/IMG_8340.JPG'), ('frente', f'{GV}/IMG_8338.JPG'), ('lateral', f'{GV}/IMG_8343.JPG'),
        ('vidrio', f'{GV}/IMG_7603.JPG'), ('cafe', f'{GV}/IMG_7597.JPG'),
    ],
    'amalaya': [
        ('cover', f'{GV}/IMG_9217.JPG'), ('instalacion', f'{GV}/IMG_9214.JPG'), ('detalle', f'{GV}/IMG_9207.JPG'),
        ('aplicacion', f'{GV}/IMG_9206.JPG'),
    ],
    'ev-days': [('cover', f'{GV}/IMG_7498.JPG')],
    'colfarma': [
        ('cover', f'{CO}/IMG_7163.JPG'), ('sala', f'{CO}/IMG_7161.JPG'), ('isologo', f'{CO}/IMG_7166.JPG'),
        ('detalle', f'{CO}/IMG_7154.JPG'), ('pared', f'{CO}/IMG_7150.JPG'),
    ],
    'cala': [('cover', f'{CO}/IMG_5631.JPG'), ('frente', f'{CO}/IMG_5630.JPG'), ('acceso', f'{CO}/IMG_5632.JPG')],
    'crayon': [('cover', f'{CO}/IMG_8332.JPG')],
    'campos-de-la-enriqueta': [('cover', f'{CO}/166559BF-B159-477A-95F9-1BED3B4D2518.jpg')],
    'grupo-tannat': [
        ('cover', f'{VE}/IMG_5792.JPG'), ('logo', f'{VE}/IMG_5785.JPG'), ('trasera', f'{VE}/IMG_5782.JPG'),
        ('lateral', f'{VE}/IMG_5794.JPG'), ('perfil', f'{VE}/IMG_5732.JPG'),
    ],
    'creperie-on-the-road': [
        ('cover', f'{VE}/IMG_7196.JPG'), ('lateral', f'{VE}/IMG_7192.JPG'), ('frente', f'{VE}/IMG_7194.JPG'),
        ('taller', f'{VE}/IMG_7191.JPG'), ('antes', f'{VE}/IMG_7173.JPG'), ('aplicacion', f'{VE}/IMG_7176.JPG'),
    ],
    'pro-laser': [('cover', f'{VE}/IMG_8956.JPG'), ('lateral', f'{VE}/IMG_8955.JPG'), ('frente', f'{VE}/IMG_8954.JPG')],
}

# ---------- imágenes de productos y materiales: fotos o fotogramas de video ----------
# (destino, fuente, segundo del video o None si es foto)
STILLS = {
    'productos': [
        ('cruz-led', f'{T}/Proceso 10/C5140.MP4', 1.5), ('cruz-led-2', f'{T}/Proceso 10/C5137.MP4', 2.0), ('cruz-led-3', f'{FG}/IMG_8170.JPG', None),
        ('cruz-led-4', f'{T}/Proceso 10/C5146.MP4', 6.0),
        ('letras-iluminadas', f'{FG}/IMG_8047.JPG', None), ('letras-iluminadas-2', f'{FG}/IMG_8046.JPG', None),
        ('letras-corporeas', f'{CO}/IMG_5631.JPG', None), ('letras-corporeas-2', f'{T}/Proceso 6/C5185.MP4', 1.5), ('letras-corporeas-3', f'{CO}/IMG_8332.JPG', None),
        ('letras-corporeas-4', f'{T}/General/C5219.MP4', 3.0),
        ('isologo-corporeo', f'{CO}/IMG_7166.JPG', None), ('isologo-corporeo-2', f'{CO}/IMG_7163.JPG', None),
        ('panel-perforado', f'{FG}/IMG_8183.JPG', None), ('panel-perforado-2', f'{GV}/IMG_8338.JPG', None), ('panel-perforado-3', f'{FG}/IMG_7437.HEIC', None),
        ('vinilo-esmerilado', f'{FG}/IMG_8175.JPG', None), ('vinilo-esmerilado-2', f'{GV}/IMG_5651.JPG', None), ('vinilo-esmerilado-3', f'{GV}/IMG_5390.JPG', None),
        ('vinilo-impreso', f'{GV}/IMG_9217.JPG', None), ('vinilo-impreso-2', f'{GV}/IMG_7498.JPG', None), ('vinilo-impreso-3', f'{GV}/IMG_9207.JPG', None),
        ('vinilo-corte', f'{GV}/IMG_7660.JPG', None), ('vinilo-corte-2', f'{GV}/IMG_7603.JPG', None),
        ('ploteo', f'{VE}/IMG_5785.JPG', None), ('ploteo-2', f'{VE}/IMG_8955.JPG', None), ('ploteo-3', f'{VE}/IMG_7194.JPG', None),
        ('luminoso-forma', f'{CO}/IMG_5921.JPG', None),
        ('cartel-acceso', f'{CO}/166559BF-B159-477A-95F9-1BED3B4D2518.jpg', None),
        ('polifan', f'{T}/Proceso 1/C5244.MP4', 2.0), ('polifan-2', f'{T}/Proceso 1/C5243.MP4', 2.5), ('polifan-3', f'{T}/General/C5231.MP4', 2.5),
        ('stickers', f'{T}/Grafica/C5121.MP4', 2.5), ('stickers-2', f'{T}/Grafica/C5123.MP4', 2.5), ('stickers-3', f'{T}/Grafica/C5120.MP4', 3.5),
        ('acrilico-cnc', f'{T}/Proceso 6/C5182.MP4', 5.0), ('acrilico-cnc-2', f'{T}/Proceso 6/C5180.MP4', 5.0),
        ('impresion-uv', f'{T}/Grafica/C5118.MP4', 2.0),
    ],
    'materiales': [
        ('acm', f'{T}/Proceso 3/C5229.MP4', 1.5), ('acrilico', f'{T}/Proceso 6/C5185.MP4', 1.5), ('led', f'{T}/Proceso 10/C5140.MP4', 1.5),
        ('vinilo-esmerilado', f'{FG}/IMG_8175.JPG', None), ('vinilo-impreso', f'{GV}/IMG_9207.JPG', None), ('vinilos-color', f'{T}/Grafica/C5130.MP4', 3.0),
        ('chapa-galvanizada', f'{T}/General/C5220.MP4', 2.0), ('polifan', f'{T}/Proceso 1/C5202.MP4', 3.0), ('pvc', f'{T}/Proceso 6/C5173.MP4', 3.0),
        ('mdf', f'{T}/General/C5166.MP4', 2.5), ('impresion-3d', f'{T}/Grafica/C5126.MP4', 3.0), ('perforado', f'{FG}/IMG_8183.JPG', None),
    ],
    'taller': [
        ('equipo', f'{T}/General/C5108.MP4', 2.0), ('pizarra', f'{T}/General/C5106.MP4', 2.0), ('herramientas', f'{T}/General/C5165.MP4', 2.0),
    ],
}

# ---------- clips sin audio: (destino, fuente, inicio, duración) ----------
CLIPS = [
    ('taller/plotter', f'{T}/Grafica/C5120.MP4', 0.5, 5), ('taller/uv', f'{GV}/IMG_8449.MOV', 6, 6), ('taller/3d', f'{T}/Grafica/C5126.MP4', 0.5, 5),
    ('taller/cnc', f'{T}/Proceso 6/C5180.MP4', 2, 6), ('taller/polifan', f'{T}/Proceso 1/C5198.MP4', 0.3, 4.5), ('taller/cruz', f'{T}/Proceso 10/C5146.MP4', 2, 6),
    ('taller/acm', f'{T}/Proceso 3/C5225.MP4', 0.5, 6), ('taller/corporeas', f'{T}/General/C5219.MP4', 0.3, 5), ('taller/vinilos', f'{T}/Grafica/C5130.MP4', 0.3, 5),
    ('taller/letras', f'{T}/Proceso 1/C5243.MP4', 0.3, 4.5),
    ('p/farmacia-garcia/instalacion', f'{FG}/IMG_7446.MOV', 0, 6), ('p/farmacia-garcia/noche', f'{FG}/IMG_7996.MOV', 1, 8),
    ('p/farmacia-roux/vinilo', f'{GV}/IMG_8273.MOV', 1, 8), ('p/amalaya/instalacion', f'{GV}/IMG_9212.MOV', 1, 8),
    ('p/ev-days/instalacion', f'{GV}/IMG_7495.MOV', 3, 8), ('p/grupo-tannat/recorrido', f'{VE}/IMG_5797.MOV', 1, 8),
    ('p/creperie-on-the-road/impresion', f'{GV}/IMG_8218.MOV', 2, 8), ('p/creperie-on-the-road/recorrido', f'{VE}/IMG_7187.MOV', 2, 8),
    ('p/pro-laser/recorrido', f'{VE}/IMG_8958.MOV', 0, 7), ('p/farmacia-sanchez/vidriera', f'{GV}/IMG_5403.MOV', 2, 8),
]

# ---------- reels editados (con audio) ----------
REELS = [
    'gecko-v7-antes-despues-farmacia-garcia', 'gecko-v6-fachada-sin-obra', 'gecko-v4-mucho-mas-que-un-cartel',
    'gecko-v5-acm-aluminio-compuesto', 'gecko-v3-perdiendo-clientes', 'gecko-v2-48-horas', 'gecko-v1-disenador-idioma',
]


def src(p):
    return os.path.join(SRC, p.replace('/', os.sep))


def need(path):
    return FORCE or not os.path.exists(path)


def save_sizes(im, base):
    im = im.convert('RGB')
    for w in SIZES:
        out = f'{base}-{w}.webp'
        if not need(out):
            continue
        c = im.copy()
        c.thumbnail((w, w), Image.LANCZOS)
        c.save(out, 'WEBP', quality=78, method=6)
    return im.size


def duration(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


def frame(path, t):
    import io
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', path, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True)
    if not r.stdout:  # el segundo pedido quedó fuera del clip: usar la mitad
        r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(duration(path) * 0.5), '-i', path, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True)
    return Image.open(io.BytesIO(r.stdout))


def do_photo(job):
    folder, name, source, t = job
    os.makedirs(folder, exist_ok=True)
    base = os.path.join(folder, name)
    if not FORCE and all(os.path.exists(f'{base}-{w}.webp') for w in SIZES):
        im = Image.open(f'{base}-1600.webp')
        return base, im.size
    p = src(source)
    im = frame(p, t) if t is not None else ImageOps.exif_transpose(Image.open(p))
    return base, save_sizes(im, base)


def do_clip(job):
    dest, source, start, dur = job
    out = os.path.join(OUT, dest.replace('/', os.sep) + '.mp4')
    poster = out[:-4] + '.webp'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if need(out):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start), '-t', str(dur), '-i', src(source), '-an',
                        '-vf', "scale='if(gt(iw,ih),1280,720)':-2:flags=lanczos,fps=30", '-c:v', 'libx264', '-crf', '28',
                        '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], check=True)
    if need(poster):
        frame(out, 0.2).convert('RGB').save(poster, 'WEBP', quality=72)
    return out


def do_reel(name):
    out = os.path.join(OUT, 'reels', name + '.mp4')
    poster = out[:-4] + '.webp'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if need(out):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src(f'Finales/{name}.mp4'), '-vf', 'scale=720:-2:flags=lanczos',
                        '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k',
                        '-movflags', '+faststart', out], check=True)
    if need(poster):
        frame(out, 1.0).convert('RGB').save(poster, 'WEBP', quality=75)
    return out


if __name__ == '__main__':
    jobs = [(os.path.join(OUT, 'p', slug), n, s, None) for slug, items in PHOTOS.items() for n, s in items]
    jobs += [(os.path.join(OUT, group), n, s, t) for group, items in STILLS.items() for n, s, t in items]
    dims = {}
    with ThreadPoolExecutor(6) as ex:
        for base, size in ex.map(do_photo, jobs):
            dims[os.path.relpath(base, OUT).replace(os.sep, '/')] = size
            print('foto', os.path.relpath(base, OUT))
    with ThreadPoolExecutor(3) as ex:
        for out in ex.map(do_clip, CLIPS):
            print('clip', os.path.relpath(out, OUT))
        for out in ex.map(do_reel, REELS):
            print('reel', os.path.relpath(out, OUT))
    # proporciones de cada foto, para reservar el espacio antes de que cargue
    with open(os.path.join(OUT, 'dimensions.json'), 'w') as f:
        json.dump(dims, f, indent=0, sort_keys=True)
