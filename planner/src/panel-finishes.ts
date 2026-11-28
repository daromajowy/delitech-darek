import lcColors from './data/jung-lc.json';

export type FinishMaterial = 'gloss' | 'matte' | 'metal' | 'polished';
export interface PanelFinish {
  id: string;
  label: string;
  color: string;
  material: FinishMaterial;
  group: string;
  code?: string;
}
const finish = (id: string, label: string, color: string, material: FinishMaterial, group: string, code?: string): PanelFinish => ({ id, label, color, material, group, code });

// Stable IDs retain the finish values already stored in customer projects.
// Colours are screen approximations; product availability is model-specific.
const jungClassic = [
  finish('Biały', 'Biel alpejska', '#f6f6f2', 'gloss', 'Tworzywo', 'WW'),
  finish('Kość słoniowa', 'Kość słoniowa', '#e9dfc3', 'gloss', 'Tworzywo', 'W'),
  finish('Jasnoszary', 'Jasnoszary', '#c6c8c3', 'gloss', 'Tworzywo', 'LG'),
  finish('Czarny', 'Czarny', '#242526', 'gloss', 'Tworzywo', 'SW'),
  finish('Śnieżnobiały mat', 'Śnieżnobiały mat', '#f1f2ef', 'matte', 'Tworzywo', 'WWM'),
  finish('Grafitowoczarny mat', 'Grafitowoczarny mat', '#353637', 'matte', 'Tworzywo', 'SWM'),
  finish('Aluminium', 'Aluminium', '#b8bcbd', 'metal', 'Metal', 'AL'),
  finish('Stal', 'Stal szlachetna', '#949b9b', 'metal', 'Metal', 'ES'),
  finish('Antracyt', 'Antracyt', '#55595c', 'metal', 'Metal', 'AN'),
  finish('Dark', 'Dark', '#34302e', 'metal', 'Metal', 'D'),
  finish('Mosiądz', 'Mosiądz klasyczny', '#c6aa70', 'metal', 'Metal', 'ME C'),
  finish('Mosiądz antyczny', 'Mosiądz antyczny', '#8c7252', 'metal', 'Metal', 'ME AT'),
  finish('Brąz szczotkowany', 'Brąz szczotkowany', '#b68e69', 'metal', 'Metal', 'BRG'),
];
const jungF50Metals = [
  finish('Chrom', 'Chrom błyszczący', '#bdc4c7', 'polished', 'Metal', 'GCR'),
  finish('Złoty', 'Złoty', '#d6b05a', 'polished', 'Metal', 'GO'),
  finish('Pozłacany', 'Pozłacany', '#d6b973', 'polished', 'Metal', 'GGO'),
];
export const leCorbusierFinishes: PanelFinish[] = lcColors.map(c => finish(`LC ${c.code}`, c.name, c.color, 'matte', 'Les Couleurs® Le Corbusier®', c.code));
const ekinexFinishes = [
  finish('Biały', 'Biały Pure White', '#f4f4f1', 'gloss', 'Tworzywo', 'GAR'),
  finish('Ciepły biały', 'Ciepły biały', '#eae5dc', 'gloss', 'Tworzywo', 'GAA'),
  finish('Czarny', 'Intensywny czarny', '#242526', 'gloss', 'Tworzywo', 'GAE'),
  finish('Srebrny', 'Srebrny', '#aeb3b6', 'gloss', 'Tworzywo', 'GAG'),
  finish('Aluminium', 'Aluminium', '#bdc1c3', 'metal', 'Metal', 'GBQ'),
  finish('Nikiel', 'Nikiel', '#a5a29b', 'metal', 'Metal', 'GBR'),
  finish('Tytan', 'Tytan', '#777874', 'metal', 'Metal', 'GBS'),
  finish('Carbon', 'Carbon', '#373a3c', 'metal', 'Metal', 'GBU'),
  finish('Mosiądz', 'Mosiądz Brass 26', '#b79d6b', 'metal', 'Metal', 'GBC'),
  finish('Chrom HT', 'Chrom', '#bdc4c7', 'polished', 'Metal HT', 'CRO'),
  finish('Black Metal HT', 'Black Metal', '#404449', 'polished', 'Metal HT', 'CBM'),
  finish('Szampański HT', 'Szampański', '#beaf91', 'polished', 'Metal HT', 'CHA'),
  finish('Fenix White Malè', 'White Malè', '#e7e3d9', 'matte', 'Fenix NTM', 'FBM'),
  finish('Fenix Beige Luxor', 'Beige Luxor', '#b8a88f', 'matte', 'Fenix NTM', 'FBL'),
  finish('Fenix Beaver Ottawa', 'Beaver Ottawa', '#8b8072', 'matte', 'Fenix NTM', 'FCO'),
  finish('Fenix Grey Ephesus', 'Grey Ephesus', '#a4a39a', 'matte', 'Fenix NTM', 'FGE'),
  finish('Fenix Grey London', 'Grey London', '#777974', 'matte', 'Fenix NTM', 'FGL'),
  finish('Fenix Grey Bromine', 'Grey Bromine', '#50595b', 'matte', 'Fenix NTM', 'FGB'),
  finish('Fenix Cocoa Orinoco', 'Cocoa Orinoco', '#4d4943', 'matte', 'Fenix NTM', 'FCC'),
  finish('Fenix Green Commodore', 'Green Commodore', '#40524c', 'matte', 'Fenix NTM', 'FVC'),
  finish('Fenix Black Ingo', 'Black Ingo', '#232526', 'matte', 'Fenix NTM', 'FNI'),
];

export function panelFinishes(sensor: string): PanelFinish[] {
  if (sensor === 'JUNG Smart Control 5″') return [jungClassic[3]];
  if (sensor === 'JUNG F50') return [...jungClassic, ...jungF50Metals, ...leCorbusierFinishes];
  if (sensor === 'JUNG F40' || sensor === 'JUNG LS TOUCH') return [...jungClassic, ...leCorbusierFinishes];
  if (sensor === 'Ekinex FF · bez ramki (NF)') return ekinexFinishes;
  return jungClassic.filter(f => ['Biały', 'Czarny', 'Aluminium', 'Stal', 'Mosiądz'].includes(f.id))
    .map(f => ({ ...f, label: f.id, code: undefined, group: 'Kolory' }));
}
export function panelFinish(sensor: string, id: string): PanelFinish {
  return panelFinishes(sensor).find(f => f.id === id)
    ?? [...jungClassic, ...jungF50Metals, ...leCorbusierFinishes, ...ekinexFinishes].find(f => f.id === id)
    ?? finish(id, id || 'Do ustalenia', '#dfe3e2', 'matte', 'Zapisane wykończenie');
}
export function mixFinish(color: string, target: string, amount: number): string {
  const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const a = channels(color), b = channels(target);
  return '#' + a.map((value, i) => Math.round(value + (b[i] - value) * amount).toString(16).padStart(2, '0')).join('');
}
export function finishInk(color: string): string {
  const channels = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  const luminance = .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
  return luminance > .179 ? '#000000' : '#ffffff';
}
export function finishSurface(f: PanelFinish): string {
  const strength = f.material === 'polished' ? .5 : f.material === 'metal' ? .2 : f.material === 'gloss' ? .12 : .035;
  return `linear-gradient(125deg, ${mixFinish(f.color, '#ffffff', strength)}, ${f.color} 44%, ${mixFinish(f.color, '#000000', strength * .55)} 72%, ${mixFinish(f.color, '#ffffff', strength * .5)})`;
}
export const finishes: Record<string, string> = Object.fromEntries([...ekinexFinishes, ...jungClassic, ...jungF50Metals, ...leCorbusierFinishes].map(f => [f.id, f.color]));
