import type { CSSProperties } from 'react';
import type { Room } from './model';

export const roomPalette = [
  { name: 'Miętowy', fill: '#A8DCC8', stroke: '#397D65' },
  { name: 'Brzoskwiniowy', fill: '#F3C4A2', stroke: '#A16238' },
  { name: 'Błękitny', fill: '#ACCFEA', stroke: '#427DA6' },
  { name: 'Lawendowy', fill: '#CBBCE8', stroke: '#7860A4' },
  { name: 'Maślany', fill: '#EDDA91', stroke: '#8E7728' },
  { name: 'Pudrowy róż', fill: '#EDB9CE', stroke: '#A35D7A' },
  { name: 'Szałwiowy', fill: '#C6D7AB', stroke: '#6D844B' },
  { name: 'Turkusowy', fill: '#A4DBDB', stroke: '#3F8186' },
  { name: 'Koralowy', fill: '#EFB5AD', stroke: '#A56157' },
  { name: 'Barwinkowy', fill: '#B9C6EB', stroke: '#6079AA' },
  { name: 'Piaskowy', fill: '#DECDB3', stroke: '#8C7453' },
  { name: 'Liliowy', fill: '#DEBEE0', stroke: '#95649B' },
] as const;

export function roomColor(room: Pick<Room, 'color'>) {
  return roomPalette.find(color => color.fill === room.color) ?? roomPalette[0];
}

/** Give uncoloured rooms a persistent, least-used pastel; keep all existing choices. */
export function assignRoomColors(rooms: Room[]) {
  const counts = roomPalette.map(color => rooms.filter(room => room.color === color.fill).length);
  for (const room of rooms) {
    if (roomPalette.some(color => color.fill === room.color)) continue;
    const index = counts.indexOf(Math.min(...counts));
    room.color = roomPalette[index].fill;
    counts[index]++;
  }
}

export function roomColorStyle(room: Pick<Room, 'color'>): CSSProperties {
  const color = roomColor(room);
  return { '--room-fill': color.fill, '--room-stroke': color.stroke } as CSSProperties;
}
