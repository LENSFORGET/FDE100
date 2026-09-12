"""Render both tour narrations. Only needed when the spoken script changes.

Requires edge-tts==7.2.7 and imageio-ffmpeg==0.6.0; normal site builds are offline.
Run from any directory with: python scripts/generate-tour-audio.py
"""

import asyncio
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

import edge_tts
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "src/data/tour-script.json"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
SAMPLE_RATE = 24000


async def main():
    scripts = json.loads(SCRIPT.read_text())
    output = ROOT / "public/audio"
    output.mkdir(exist_ok=True)
    tracks = {}
    with tempfile.TemporaryDirectory(prefix="fde100-tour-") as directory:
        work = Path(directory)
        for language, script in scripts.items():
            samples = bytearray()
            cues = []
            for index, step in enumerate(script["steps"]):
                segment = work / f"{language}-{index}.mp3"
                await edge_tts.Communicate(
                    step["text"], script["voice"], rate=script["rate"]
                ).save(str(segment))
                cues.append(len(samples) / (SAMPLE_RATE * 2))
                samples.extend(subprocess.check_output([
                    FFMPEG, "-v", "error", "-i", str(segment),
                    "-f", "s16le", "-ac", "1", "-ar", str(SAMPLE_RATE), "-",
                ]))
                print(f"{language}: rendered step {index + 1}/8", flush=True)
            raw_duration = len(samples) / (SAMPLE_RATE * 2)
            # Keep both editions near one minute, with identical timing for cues
            # and audio. Fail rather than making a long script unnaturally fast.
            tempo = raw_duration / 60
            if not 0.8 <= tempo <= 1.3:
                raise ValueError(f"Adjust {language} voice rate: {raw_duration:.1f}s")
            digest = hashlib.sha256(json.dumps(script).encode()).hexdigest()[:8]
            filename = f"tour-{language.lower()}-{digest}.mp3"
            subprocess.run([
                FFMPEG, "-v", "error", "-y", "-f", "s16le", "-ar",
                str(SAMPLE_RATE), "-ac", "1", "-i", "-", "-af",
                f"atempo={tempo:.8f},loudnorm=I=-18:TP=-2:LRA=7",
                "-ar", str(SAMPLE_RATE), "-c:a", "libmp3lame", "-b:a", "64k",
                str(output / filename),
            ], input=bytes(samples), check=True)
            tracks[language] = {
                "file": f"audio/{filename}",
                "duration": 60,
                "cues": [round(cue / tempo, 3) for cue in cues],
            }
            print(f"{language}: {raw_duration:.1f}s → 60s; saved {filename}", flush=True)
    (ROOT / "src/data/tour-audio.json").write_text(
        json.dumps(tracks, ensure_ascii=False, indent=2) + "\n"
    )


if __name__ == "__main__":
    asyncio.run(main())
