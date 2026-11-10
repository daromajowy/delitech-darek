import type { DetectorEvent, DetectorKind, DetectorRule, Point } from './model';

export const detectorKinds: Record<DetectorKind, { label: string; icon: string; events: DetectorEvent[] }> = {
  motion: { label: 'Czujka ruchu KNX', icon: 'Radar', events: ['detected', 'absent'] },
  presence: { label: 'Czujka obecności KNX', icon: 'ScanEye', events: ['detected', 'absent'] },
  window: { label: 'Kontaktron okna', icon: 'PanelsTopLeft', events: ['opened', 'closed'] },
  door: { label: 'Kontaktron drzwi', icon: 'DoorOpen', events: ['opened', 'closed'] },
};
export const detectorEvents: Record<DetectorEvent, string> = {
  detected: 'Wykrycie ruchu / obecności', absent: 'Brak ruchu / obecności', opened: 'Otwarcie', closed: 'Zamknięcie',
};
export const detectorConnections = { knx: 'Urządzenie KNX', binary: 'Wejście binarne KNX', alarm: 'Integracja z alarmem', undecided: 'Do ustalenia' };
export const detectorConditions = { always: 'Zawsze', dark: 'Gdy jest ciemno', day: 'W dzień', night: 'W nocy' };
export const pauseClimate = 'Wstrzymaj ogrzewanie / chłodzenie';
export const restoreClimate = 'Przywróć poprzedni tryb';
export const lockShades = 'Zablokuj automatyczne zamykanie';
export const unlockShades = 'Odblokuj automatyczne zamykanie';
export const pointIcon = (point: Point) => point.detector ? detectorKinds[point.detector.kind].icon : 'MapPin';
export function newDetectorRule(event: DetectorEvent): DetectorRule {
  return { id: crypto.randomUUID(), event, condition: 'always', luxThreshold: 150, delaySeconds: 0,
    actions: [{ id: crypto.randomUUID(), target: '', action: 'Do ustalenia' }] };
}
export function detectorRuleLabel(rule: DetectorRule): string {
  return `${detectorEvents[rule.event]} · ${detectorConditions[rule.condition]}${rule.condition === 'dark' ? ` (< ${rule.luxThreshold} lx)` : ''} · ${rule.delaySeconds ? `po ${rule.delaySeconds} s` : 'od razu'}`;
}
