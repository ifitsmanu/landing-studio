#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { realpathSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function probeMedia(file) {
  const raw = execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_name,pix_fmt,width,height,r_frame_rate,duration:format=duration,size',
    '-of', 'json',
    file,
  ], { encoding: 'utf8' });
  const parsed = JSON.parse(raw);
  const video = parsed.streams?.[0];
  if (!video) throw new Error(`no video stream: ${file}`);
  return {
    file: basename(file),
    width: Number(video.width),
    height: Number(video.height),
    codec: video.codec_name,
    pixelFormat: video.pix_fmt,
    frameRate: video.r_frame_rate,
    durationSeconds: Number(video.duration ?? parsed.format?.duration ?? 0),
    sizeBytes: Number(parsed.format?.size ?? 0),
  };
}

if (process.argv[1]
  && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  const [output, ...files] = process.argv.slice(2);
  if (!output || files.length === 0) {
    console.error('usage: node inspect-media.mjs <output.json> <media...>');
    process.exit(1);
  }
  const media = files.map(probeMedia);
  writeFileSync(output, `${JSON.stringify({ schemaVersion: 1, media }, null, 2)}\n`);
}
