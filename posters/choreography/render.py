"""Plate IV: four-body periodic choreography. Renders PDF (vector) + PNG."""
import cairo, math, itertools, sys
import numpy as np

W, H = 1800, 2400            # points (6:8 poster, 25 x 33.3 in at 72pt)
PAPER = (0.925, 0.898, 0.843)
INK = (0.075, 0.075, 0.09)
VERM = (0.80, 0.27, 0.17)

HARM = [(1, 1.0), (-2, 0.5), (-5, 0.35)]   # every term ≡ 1 (mod 3): three-fold path
ROT = math.pi / 2                           # one loop points up
PHASE0 = 0.7854                              # the "now": the most evenly spaced instant (π/4)

def z(t):
    return sum(a * np.exp(1j * n * t) for n, a in HARM) * np.exp(1j * ROT)

CX, CY = W / 2, 1100
T = np.linspace(0, 2 * math.pi, 6000)
SC = 700 / np.abs(z(T)).max()
P = lambda c: (CX + c.real * SC, CY - c.imag * SC)


def tracked(ctx, text, x, y, size, family, tracking=0.0, anchor='left', slant=cairo.FONT_SLANT_NORMAL):
    ctx.select_font_face(family, slant, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(size)
    widths = [ctx.text_extents(ch).x_advance for ch in text]
    total = sum(widths) + tracking * size * (len(text) - 1)
    if anchor == 'center': x -= total / 2
    elif anchor == 'right': x -= total
    for ch, w in zip(text, widths):
        ctx.move_to(x, y); ctx.show_text(ch); x += w + tracking * size
    return total


def reg_cross(ctx, x, y, r, color, lw=0.6):
    ctx.set_source_rgb(*color); ctx.set_line_width(lw)
    ctx.arc(x, y, r * 0.55, 0, 2 * math.pi); ctx.stroke()
    ctx.move_to(x - r, y); ctx.line_to(x + r, y)
    ctx.move_to(x, y - r); ctx.line_to(x, y + r); ctx.stroke()


def draw(ctx, grain=True):
    ctx.set_source_rgb(*PAPER); ctx.paint()

    if grain:  # archival paper tooth, deterministic
        rng = np.random.default_rng(4)
        g = cairo.ImageSurface(cairo.FORMAT_ARGB32, 900, 1200)
        buf = np.ndarray((1200, 900, 4), np.uint8, g.get_data())
        n = rng.normal(0, 1, (1200, 900))
        a = np.clip(np.abs(n) * 9, 0, 40).astype(np.uint8)
        buf[..., 0] = buf[..., 1] = buf[..., 2] = 0; buf[..., 3] = a
        g.mark_dirty()
        ctx.save(); ctx.scale(W / 900, H / 1200); ctx.set_source_surface(g); ctx.paint_with_alpha(0.22); ctx.restore()

    M = 90  # outer margin
    ctx.set_source_rgb(*INK); ctx.set_line_width(0.5)
    ctx.rectangle(M, M, W - 2 * M, H - 2 * M); ctx.stroke()
    for x, y in [(M, M), (W - M, M), (M, H - M), (W - M, H - M)]:
        reg_cross(ctx, x, y, 18, INK, 0.5)

    # the long exposure: every pair of bodies joined, at equal instants over one quarter period
    ctx.set_line_width(0.32)
    ctx.set_source_rgba(*INK, 0.028)
    for t in np.linspace(0, math.pi / 2, 1100, endpoint=False):
        q = [P(z(t + k * math.pi / 2)) for k in range(4)]
        for a, b in itertools.combinations(range(4), 2):
            ctx.move_to(*q[a]); ctx.line_to(*q[b])
        ctx.stroke()

    # the shared path
    pts = [P(c) for c in z(T)]
    ctx.set_source_rgb(*INK); ctx.set_line_width(1.15)
    ctx.move_to(*pts[0])
    for p in pts[1:]: ctx.line_to(*p)
    ctx.close_path(); ctx.stroke()

    # equal-interval ticks along the path (T/96), normal to the curve
    ctx.set_line_width(0.6)
    for i in range(96):
        t = 2 * math.pi * i / 96
        c = z(t); d = (z(t + 1e-4) - c) / 1e-4
        nrm = 1j * d / abs(d)
        L = 9 if i % 24 == 0 else (6 if i % 8 == 0 else 3.5)
        a, b = P(c - nrm * L / SC), P(c + nrm * L / SC)
        ctx.move_to(*a); ctx.line_to(*b)
    ctx.stroke()

    # the present instant: four bodies and their six bonds in vermilion
    bodies = [z(PHASE0 + k * math.pi / 2) for k in range(4)]
    bp = [P(c) for c in bodies]
    ctx.set_source_rgb(*VERM); ctx.set_line_width(0.9)
    for a, b in itertools.combinations(range(4), 2):
        ctx.move_to(*bp[a]); ctx.line_to(*bp[b])
    ctx.stroke()
    for k, (x, y) in enumerate(bp):
        ctx.set_source_rgb(*PAPER); ctx.arc(x, y, 13, 0, 2 * math.pi); ctx.fill()
        ctx.set_source_rgb(*INK); ctx.set_line_width(0.7); ctx.arc(x, y, 13, 0, 2 * math.pi); ctx.stroke()
        ctx.arc(x, y, 6.5, 0, 2 * math.pi); ctx.fill()
        # roman index, pushed outward from the centre
        dx, dy = x - CX, y - CY; r = math.hypot(dx, dy)
        lx, ly = x + dx / r * 46, y + dy / r * 46
        ctx.set_source_rgb(*INK)
        tracked(ctx, ['I', 'II', 'III', 'IV'][k], lx, ly + 7, 19, 'DM Mono', 0.12, 'center')

    # the empty centre: barycentre, at rest
    reg_cross(ctx, CX, CY, 16, VERM, 0.8)

    # ---- typography ----
    ctx.set_source_rgb(*INK)
    tracked(ctx, 'PLANȘA IV', M + 40, M + 62, 15, 'DM Mono', 0.32)
    tracked(ctx, 'COREGRAFIE PERIODICĂ  ·  n = 4', W - M - 40, M + 62, 15, 'DM Mono', 0.32, 'right')
    ctx.set_line_width(0.5)
    ctx.move_to(M + 40, M + 84); ctx.line_to(W - M - 40, M + 84); ctx.stroke()

    # the name: the one loud gesture on the sheet
    tracked(ctx, 'MauTaxi Tynusia', CX, 1905, 150, 'Instrument Serif', -0.005, 'center')
    tracked(ctx, 'Nimeni nu conduce.  Nimeni nu rămâne în urmă.', CX, 1995, 44, 'Instrument Serif', 0.005,
            'center', cairo.FONT_SLANT_ITALIC)

    ctx.set_source_rgb(*INK); ctx.set_line_width(0.5)
    ctx.move_to(M + 40, 2122); ctx.line_to(W - M - 40, 2122); ctx.stroke()
    tracked(ctx, 'FIG. 1', M + 40, 2162, 14, 'DM Mono', 0.3)
    tracked(ctx, 'PATRU CORPURI  ·  UN SINGUR TRASEU  ·  DECALAJ T/4  ·  CENTRUL DE MASĂ ÎN REPAUS',
            CX, 2162, 14, 'DM Mono', 0.22, 'center')
    math_line(ctx, [('z', ''), ('1', 'sub'), (' + z', ''), ('2', 'sub'), (' + z', ''), ('3', 'sub'),
                    (' + z', ''), ('4', 'sub'), (' = 0', '')], W - M - 40, 2162, 14, 'right')
    ctx.set_source_rgb(*VERM)
    math_line(ctx, [('z(t) = e', ''), ('it', 'sup'), (' + ½ e', ''), ('−2it', 'sup'),
                    (' + 0.35 e', ''), ('−5it', 'sup')], CX, 2212, 15, 'center')


def math_line(ctx, segs, x, y, size, anchor='left'):
    """Monospaced formula with hand-set super/subscripts (DM Mono lacks those glyphs)."""
    ctx.select_font_face('DM Mono'); parts = []
    for text, kind in segs:
        fs = size * (0.68 if kind else 1.0)
        dy = -size * 0.42 if kind == 'sup' else (size * 0.22 if kind == 'sub' else 0)
        ctx.set_font_size(fs)
        parts.append((text, fs, dy, ctx.text_extents(text).x_advance + (size * 0.06 * len(text) if not kind else 0)))
    total = sum(p[3] for p in parts)
    if anchor == 'center': x -= total / 2
    elif anchor == 'right': x -= total
    for text, fs, dy, w in parts:
        ctx.set_font_size(fs)
        cx = x
        for ch in text:
            ctx.move_to(cx, y + dy); ctx.show_text(ch)
            cx += ctx.text_extents(ch).x_advance + (size * 0.06 if fs == size else 0)
        x += w


if __name__ == '__main__':
    out = sys.argv[1]
    pdf = cairo.PDFSurface(f'{out}.pdf', W, H); c = cairo.Context(pdf); draw(c); pdf.finish()
    s = 2
    png = cairo.ImageSurface(cairo.FORMAT_RGB24, W * s, H * s); c = cairo.Context(png); c.scale(s, s); draw(c); png.write_to_png(f'{out}.png')
    print('ok')
