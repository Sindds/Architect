"""
Собирает шрифты сайта src/fonts/*-wght.woff2: один файл на семейство вместо срезов cyrillic, latin и latin-ext.

Внутри: кириллица, латиница, знаки препинания, ₽, №, стрелки и математические знаки; толщины 400–700
(на сайте используются только они). У JetBrains Mono убраны лигатуры для кода: в метках они не нужны.

Исходники — вариативные TTF из репозитория Google Fonts (лицензия OFL):
  https://github.com/google/fonts/tree/main/ofl/onest        Onest[wght].ttf
  https://github.com/google/fonts/tree/main/ofl/manrope      Manrope[wght].ttf
  https://github.com/google/fonts/tree/main/ofl/jetbrainsmono JetBrainsMono[wght].ttf

Запуск (Python 3.10+):
  python -m venv .venv && .venv/bin/pip install fonttools==4.60.1 brotli==1.1.0
  .venv/bin/python scripts/subset-fonts.py <папка с TTF>

Новый символ в текстах, которого нет в UNICODES, браузер покажет запасным шрифтом: добавьте его сюда и пересоберите.
"""
import io
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

UNICODES = (
    'U+0020-007E,U+00A0-00BF,U+00D7,U+00F7,U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,'
    'U+2000-200B,U+2010-2027,U+202F,U+2030-203A,U+2044,U+20AC,U+20BD,U+2116,U+2122,'
    'U+2190-2193,U+2212,U+2248,U+2260,U+2264-2265'
)
WEIGHT = (400, 700)
FONTS = [
    ('Onest[wght].ttf', 'onest-wght.woff2', ()),
    ('Manrope[wght].ttf', 'manrope-wght.woff2', ()),
    ('JetBrainsMono[wght].ttf', 'jetbrains-mono-wght.woff2', ('calt', 'liga', 'clig')),
]


def build(src: Path, out: Path, drop: tuple[str, ...]) -> None:
    font = TTFont(src)
    opts = subset.Options()
    opts.layout_features = [t for t in opts.layout_features + ['tnum', 'lnum', 'case'] if t not in drop]
    opts.name_IDs = ['*']
    opts.name_languages = ['*']
    opts.notdef_outline = True
    opts.hinting = False
    subsetter = subset.Subsetter(opts)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    # Сначала подмножество, потом сужение оси: в обратном порядке fontTools падает на ленивой таблице gvar.
    buf = io.BytesIO()
    font.save(buf)
    buf.seek(0)
    font = instancer.instantiateVariableFont(TTFont(buf), {'wght': WEIGHT})
    font.flavor = 'woff2'
    font.save(out)
    print(f'{out.name}: {out.stat().st_size // 1024} КБ')


if __name__ == '__main__':
    src_dir = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    out_dir = Path(__file__).resolve().parent.parent / 'src' / 'fonts'
    for src, out, drop in FONTS:
        build(src_dir / src, out_dir / out, drop)
