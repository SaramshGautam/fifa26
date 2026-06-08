import React, { useState } from "react";
import TeamPicker from "../TeamPicker/TeamPicker";
import "./KnockoutStage.css";

/**
 * KnockoutStage — generic bracket stage (R32, R16, QF, SF).
 * Renders `count` team slots; user picks or removes teams.
 *
 * Props:
 *   stageId   — "r32" | "r16" | "qf" | "sf"
 *   label     — display name
 *   icon      — emoji icon
 *   count     — number of slots
 *   description
 *   predictions — full predictions object
 *   onUpdate(stageId, array) — persist changes
 */
export default function KnockoutStage({
  stageId,
  label,
  icon,
  count,
  description,
  predictions,
  onUpdate,
}) {
  const [pickerSlot, setPickerSlot] = useState(null);

  const teams   = predictions[stageId] || Array(count).fill(null);
  const takenIds = teams.filter(Boolean).map((t) => t.id);
  const filled   = takenIds.length;
  const pct      = Math.round((filled / count) * 100);

  const openPicker  = (idx) => setPickerSlot(idx);
  const closePicker = () => setPickerSlot(null);

  const handleSelect = (team) => {
    const updated = [...teams];
    while (updated.length < count) updated.push(null);
    updated[pickerSlot] = team;
    onUpdate(stageId, updated);
    setPickerSlot(null);
  };

  const handleRemove = (idx) => {
    const updated = [...teams];
    updated[idx] = null;
    onUpdate(stageId, updated);
  };

  return (
    <section className="knockout-stage">
      <div className="section-header">
        <h2 className="section-header__title">
          {icon} {label}
        </h2>
        <p className="section-header__sub">{description}</p>
      </div>

      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__value">{filled}</div>
          <div className="stat-card__label">Selected</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{count - filled}</div>
          <div className="stat-card__label">Remaining</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{count}</div>
          <div className="stat-card__label">Total spots</div>
        </div>
      </div>

      <div className="bracket-grid">
        {Array.from({ length: count }, (_, i) => {
          const team = teams[i] || null;
          return (
            <div
              key={i}
              className={`bracket-slot${team ? " bracket-slot--filled" : ""}`}
              onClick={() => (team ? handleRemove(i) : openPicker(i))}
              role="button"
              tabIndex={0}
              aria-label={team ? `Remove ${team.name}` : "Add team"}
              onKeyDown={(e) =>
                e.key === "Enter" && (team ? handleRemove(i) : openPicker(i))
              }
            >
              {team ? (
                <>
                  <span className="bracket-slot__flag">{team.flag}</span>
                  <span className="bracket-slot__name">{team.name}</span>
                  <span className="bracket-slot__remove" aria-hidden="true">✕</span>
                </>
              ) : (
                <span className="bracket-slot__empty">+ Add team</span>
              )}
            </div>
          );
        })}
      </div>

      {pickerSlot !== null && (
        <TeamPicker
          takenIds={takenIds}
          onSelect={handleSelect}
          onClose={closePicker}
        />
      )}
    </section>
  );
}
