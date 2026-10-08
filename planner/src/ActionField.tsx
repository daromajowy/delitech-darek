import { actionOptions, actionProblem, findCircuit, isDimmable } from './behavior';
import { Field, Select } from './components';
import { type Command } from './behavior';
import { targets, type Project } from './model';

export function ActionField({ project, value, change, label, scene = false }: {
  project: Project; value: Command; change: (value: Command) => void; label: string; scene?: boolean;
}) {
  const options = actionOptions(project, value.target, scene);
  const current = options.includes(value.action) ? options : [value.action, ...options];
  const c = findCircuit(project, value.target);
  const dimmer = c && isDimmable(c) && /^\d+%$/.test(value.action);
  const problem = actionProblem(project, value);
  return <div className="action-fields">
    <Field label={scene ? 'Obwód' : 'Obwód lub scena'}><select aria-label={`${label}: cel`} value={value.target} onChange={e => {
      const target = e.target.value;
      change({ target, action: actionOptions(project, target, scene)[0] });
    }}><option value="">Do ustalenia</option>{targets(project).filter(t => !scene || !project.scenes.some(s => s.id === t.id) || t.id === value.target).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</select></Field>
    {!(project.scenes.some(s => s.id === value.target) && value.action === 'Uruchom scenę') && <Field label="Działanie"><Select label={`${label}: działanie`} value={value.action} options={current} onChange={action => change({ ...value, action })}/></Field>}
    {dimmer && <label className="level-control"><span>Jasność</span><input aria-label={`${label}: jasność`} type="range" min="0" max="100" step="1" value={parseInt(value.action)} onChange={e => change({ ...value, action: `${e.target.value}%` })}/><output>{value.action}</output></label>}
    {problem && <small className="field-warning">{problem}. Zapisane ustawienie pozostaje do poprawy.</small>}
  </div>;
}
