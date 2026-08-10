/**
 * Generate favicons from public/logo.jpeg — same asset as the site header,
 * trimmed, circular, with the yellow ring used in LandingContent.
 */
import sharp from "sharp";
import toIco from "to-ico";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public", "logo.jpeg");
const OUT = path.join(ROOT, "src", "app");
const RING_COLOR = "#f2c94c";

async function buildBrandedIcon(size) {
  const ring = Math.max(2, Math.round(size * (2 / 44)));

  const trimmed = await sharp(SRC).trim({ threshold: 20 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const side = Math.min(meta.width ?? size, meta.height ?? size);
  const left = Math.floor(((meta.width ?? side) - side) / 2);
  const top = Math.floor(((meta.height ?? side) - side) / 2);

  const inner = size - ring * 2;
  const logo = await sharp(trimmed)
    .extract({ left, top, width: side, height: side })
    .resize(inner, inner, { fit: "cover" })
    .png()
    .toBuffer();

  const circleMask = Buffer.from(
    `<svg width="${inner}" height="${inner}"><circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2}" fill="#fff"/></svg>`,
  );

  const circularLogo = await sharp(logo)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const ringSvg = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - ring / 2}" fill="none" stroke="${RING_COLOR}" stroke-width="${ring}"/></svg>`,
  );

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: circularLogo, gravity: "center" },
      { input: ringSvg, gravity: "center" },
    ])
    .png()
    .toBuffer();
}

const icon512 = await buildBrandedIcon(512);
const icon180 = await buildBrandedIcon(180);
const icon48 = await buildBrandedIcon(48);
const icon32 = await buildBrandedIcon(32);
const icon16 = await buildBrandedIcon(16);

fs.writeFileSync(path.join(OUT, "icon.png"), icon512);
fs.writeFileSync(path.join(OUT, "apple-icon.png"), icon180);
fs.writeFileSync(
  path.join(OUT, "favicon.ico"),
  await toIco([icon16, icon32, icon48]),
);

console.log("Favicons generated from public/logo.jpeg");
