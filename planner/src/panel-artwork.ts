import { mixFinish, panelFinish } from './panel-finishes';

type PanelIdentity = { sensor: string; finish: string; bindings: unknown[] };
export type KeyZone = { x: number; y: number; width: number; height: number };
export function panelKeyZones(point: PanelIdentity): KeyZone[] {
  if (point.bindings.length !== 4) return [];
  if (point.sensor === 'JUNG F50') return [
    { x: 47, y: 47, width: 54, height: 111 }, { x: 219, y: 47, width: 54, height: 111 },
    { x: 47, y: 161, width: 54, height: 112 }, { x: 219, y: 161, width: 54, height: 112 },
  ];
  if (point.sensor === 'JUNG F40') return [
    { x: 47, y: 47, width: 111, height: 111 }, { x: 161, y: 47, width: 112, height: 111 },
    { x: 47, y: 161, width: 111, height: 112 }, { x: 161, y: 161, width: 112, height: 112 },
  ];
  if (point.sensor === 'Ekinex FF · bez ramki (NF)') return [
    { x: 40, y: 40, width: 118, height: 119 }, { x: 162, y: 40, width: 118, height: 119 },
    { x: 40, y: 161, width: 118, height: 119 }, { x: 162, y: 161, width: 118, height: 119 },
  ];
  return [];
}

// A vector finish preview, not a product photo. The same artwork is used in the PDF.
// No project strings are interpolated into XML: only known geometry and palette colours.
export function panelArtwork(point: PanelIdentity): string | null {
  if (!['JUNG F40', 'JUNG F50', 'JUNG LS TOUCH', 'Ekinex FF · bez ramki (NF)'].includes(point.sensor)) return null;
  const f = panelFinish(point.sensor, point.finish);
  const shine = f.material === 'polished' ? .46 : f.material === 'metal' ? .22 : f.material === 'gloss' ? .14 : .045;
  const light = mixFinish(f.color, '#ffffff', shine), dark = mixFinish(f.color, '#000000', shine * .5);
  const rect = (x: number, y: number, width: number, height: number, fill = 'url(#surface)', radius = 1.4) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${mixFinish(f.color, '#000000', .3)}" stroke-width=".7"/>`;
  const key = (x: number, y: number, width: number, height: number) => rect(x, y, width, height) + `<path d="M${x + 1} ${y + height - 1}V${y + 1}H${x + width - 1}" fill="none" stroke="white" stroke-opacity="${f.material === 'matte' ? .14 : .4}"/>`;
  const frame = rect(32, 32, 256, 256, 'url(#frame)', 2) + `<path d="M33 286V33H286" stroke="white" stroke-opacity=".6" fill="none"/>` + rect(45, 45, 230, 230, '#202626', 1);
  let body: string;
  if (point.sensor === 'Ekinex FF · bez ramki (NF)') {
    body = rect(39, 40, 242, 242, '#242b2c', 1) + key(40, 40, 118, 240) + key(162, 40, 118, 240)
      + [40, 278].flatMap(x => [94, 216].map(y => `<rect x="${x}" y="${y}" width="2" height="17" rx="1" fill="#a4d3d9" opacity=".8"/>`)).join('');
  } else if (point.sensor === 'JUNG F50') {
    body = frame + key(104, 47, 112, 226) + panelKeyZones({ ...point, bindings: [0, 1, 2, 3] }).map(z => key(z.x, z.y, z.width, z.height)).join('')
      + [98, 219].flatMap(x => [100, 214].map(y => `<rect x="${x}" y="${y}" width="3" height="8" rx="1" fill="#b4d3d4" opacity=".8"/>`)).join('');
  } else if (point.sensor === 'JUNG F40') {
    body = frame + panelKeyZones({ ...point, bindings: [0, 1, 2, 3] }).map(z => key(z.x, z.y, z.width, z.height)).join('');
  } else {
    const screen = mixFinish(f.color, '#ffffff', .06);
    body = frame + rect(48, 48, 224, 224, '#171a1b', 1) + rect(61, 61, 198, 198, screen, 0)
      + `<path d="M61 92H259M61 175H259M160 92V245M61 245H259" stroke="${dark}" stroke-opacity=".6" fill="none"/>`
      + [106, 210].flatMap(x => [134, 211].map(y => `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${dark}" stroke-width="2"/>`)).join('');
  }
  const texture = f.material === 'metal' ? `<rect x="32" y="32" width="256" height="256" rx="2" fill="url(#brush)" opacity=".07" style="mix-blend-mode:soft-light"/>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><defs>
    <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${light}"/><stop offset=".44" stop-color="${f.color}"/><stop offset=".73" stop-color="${dark}"/><stop offset="1" stop-color="${light}"/></linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${light}"/><stop offset=".48" stop-color="${f.color}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
    <pattern id="brush" width="3" height="2" patternUnits="userSpaceOnUse"><path d="M0 .5H3" stroke="white" stroke-width=".5"/></pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#23323a" flood-opacity=".16"/></filter>
    </defs><g filter="url(#shadow)">${body}</g>${texture}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
