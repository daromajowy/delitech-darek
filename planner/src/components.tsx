import React, { useEffect, useRef } from "react";
import { iconMap } from "./icons";
import { attachmentUrl, type Project } from "./model";
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const Component = iconMap[name as keyof typeof iconMap] || iconMap.Circle;
  return <Component size={size} strokeWidth={1.7} aria-hidden={true} />;
}
export function Tool({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="tool"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name={icon} />
    </button>
  );
}
export function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const grouped = React.isValidElement(children) && children.type === "div";
  return grouped ? (
    <div
      className={`field ${wide ? "wide" : ""}`}
      role="group"
      aria-label={label}
    >
      <span>{label}</span>
      {children}
    </div>
  ) : (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Select({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (s: string) => void;
  label?: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
export function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
export function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="stat">
      <Icon name={icon} size={24} />
      <div>
        <strong>{value}</strong> <span>{label}</span>
      </div>
    </div>
  );
}
export function Brand() {
  return (
    <a
      className="brand"
      href="https://intelispaces.pl/"
      aria-label="InteliSpaces - strona główna"
    >
      INTELI<span>SPACES</span>
      <i />
    </a>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => d.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <Tool icon="X" label="Zamknij okno" onClick={onClose} />
      </div>
      {children}
    </dialog>
  );
}
export function Files({
  project,
  upload,
  remove,
  busy,
}: {
  project: Project;
  upload: (f: File) => void;
  remove: (id: string) => void;
  busy: boolean;
}) {
  return (
    <section className="files">
      <h3>Dokumentacja</h3>
      {project.attachments.map((a) => (
        <div className="file-row" key={a.id}>
          <a
            className="file"
            href={attachmentUrl(project.id, a.id)}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name={a.mime === "application/pdf" ? "FileText" : "Image"} />
            <span>
              {a.name}
              <small>{(a.size / 1024 / 1024).toFixed(1)} MB</small>
            </span>
            <Icon name="Download" size={17} />
          </a>
          <Tool
            icon="X"
            label={`Odepnij ${a.name}`}
            disabled={busy}
            onClick={() => remove(a.id)}
          />
        </div>
      ))}
      <label className={`upload ${busy ? "disabled" : ""}`}>
        <Icon name="Upload" />
        <span>
          {busy ? "Zapisywanie…" : "Dodaj rzut lub widok ściany"}
          <small>PDF, JPG, PNG · do 12 MB</small>
        </span>
        <input
          aria-label="Dodaj dokumentację"
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </label>
    </section>
  );
}
export function NumberInput({
  value,
  onChange,
  label,
  max = 100000,
}: {
  value: number | null;
  onChange: (n: number | null) => void;
  label?: string;
  max?: number;
}) {
  return (
    <input
      aria-label={label}
      type="number"
      min="0"
      max={max}
      step="1"
      value={value ?? ""}
      placeholder="Do ustalenia"
      onChange={(e) => {
        const n = e.target.value === "" ? null : Number(e.target.value);
        if (n === null || (n >= 0 && n <= max)) onChange(n);
      }}
    />
  );
}
