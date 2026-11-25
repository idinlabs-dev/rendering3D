"""Backsound gamelan 15 detik untuk film Pajajaran — sintesis murni numpy.

Instrumen (semua dari sinus + partial metalik, tanpa sample / tanpa internet):
- gong ageng (55 Hz, decay panjang) di awal, tengah, akhir
- kempul (110 Hz) tiap ~3,75 detik
- bonang: melodi pentatonik slendro-ish, nada metalik (partial 2.76x, 5.40x)
- saron: oktaf bawah melodi, lebih lembut
- kenong: aksen tiap 4 ketuk
- kendang: ketukan rendah (sweep 160 -> 70 Hz)

Output: public/gamelan.wav, stereo 44.1 kHz, 15.0 detik.
"""

import os

import numpy as np

SR = 44100
DUR = 15.0
N = int(SR * DUR)
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "gamelan.wav")


def metal(tone_t, freq, dur, decay, partials=((1.0, 1.0), (0.55, 2.76), (0.22, 5.40))):
    """Satu pukulan logam: beberapa partial sinus x peluruhan eksponensial."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    env = np.exp(-t / decay)
    env[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    y = np.zeros(n)
    for amp, mult in partials:
        y += amp * np.sin(2 * np.pi * freq * mult * t)
    return y * env


def gong(freq, dur=5.0, decay=2.2):
    return metal(None, freq, dur, decay, ((1.0, 1.0), (0.7, 1.51), (0.4, 2.02), (0.2, 2.94)))


def kendang(dur=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 160 - (160 - 70) * (t / dur)
    phase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(phase) * np.exp(-t / 0.09)


def add(mix, y, start):
    s = int(start * SR)
    e = min(N, s + len(y))
    if s >= N:
        return
    mix[s:e] += y[: e - s]


# Tangga slendro-ish (Hz): A3 C4 D4 E4 G4 A4
SCALE = [220.0, 261.6, 293.7, 329.6, 392.0, 440.0]
# Balungan 16 ketuk (0.9375 dtk/ketuk): naik-turun, berakhir di nada dasar.
MELODY = [0, 2, 4, 5, 4, 2, 3, 4, 5, 4, 3, 2, 1, 2, 0, 0]
BEAT = DUR / 16

left = np.zeros(N)
right = np.zeros(N)

# Gong ageng: awal, tengah, akhir (akhir mulai 13.5 agar gaungnya menutup film).
for t0 in (0.0, 7.5, 13.5):
    g = gong(55.0)
    add(left, g * 0.9, t0)
    add(right, g * 0.9, t0)

# Kempul tiap 3.75 detik.
for t0 in (0.0, 3.75, 7.5, 11.25):
    k = metal(None, 110.0, 3.0, 1.4, ((1.0, 1.0), (0.5, 2.76), (0.2, 5.4)))
    add(left, k * 0.55, t0)
    add(right, k * 0.55, t0)

# Bonang (melodi) + saron (oktaf bawah, ketuk genap) + kenong (aksen).
for i, deg in enumerate(MELODY):
    t0 = i * BEAT
    f = SCALE[deg]
    b = metal(None, f, 1.4, 0.55)
    add(left, b * 0.5, t0)
    add(right, metal(None, f * 1.003, 1.4, 0.55) * 0.5, t0)  # detune kanan = shimmer
    if i % 2 == 0:
        s = metal(None, f / 2, 1.2, 0.5)
        add(left, s * 0.32, t0)
        add(right, s * 0.32, t0)
    if i % 4 == 0:
        kn = metal(None, f * 2, 1.0, 0.7)
        add(left, kn * 0.35, t0)
        add(right, kn * 0.35, t0)

# Kendang: pola ketukan (ketuk 0, 2, 3, 5, 6, 8, 10, 11, 13, 14).
for i in (0, 2, 3, 5, 6, 8, 10, 11, 13, 14):
    k = kendang()
    add(left, k * 0.5, i * BEAT)
    add(right, k * 0.5, i * BEAT)

mix = np.stack([left, right], axis=1)
peak = np.max(np.abs(mix))
mix = mix / peak * 0.85
# Fade out 1 detik terakhir supaya berakhir halus.
fade = np.ones(N)
fade[-SR:] = np.linspace(1, 0, SR)
mix = mix * fade[:, None]

os.makedirs(os.path.dirname(OUT), exist_ok=True)
import wave

with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())

print(f"wrote {OUT} ({DUR}s, peak {peak:.2f} -> 0.85)")
