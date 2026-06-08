import React, { useState, useEffect, useRef } from "react";
import { TEAMS } from "../../data/teams";
import "./TeamPicker.css";

/**
 * TeamPicker — modal dialog for selecting a team.
 *
 * Props:
 *   onSelect(team)  — called when user clicks a non-taken team
 *   onClose()       — called when backdrop or close button is clicked
 *   takenIds        — array of team IDs already used in this stage
 *   filterFn(team)  — optional predicate to limit eligible teams
 */
export default function TeamPicker({ onSelect, onClose, takenIds = [], filterFn }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = TEAMS.filter((t) => {
    if (filterFn && !filterFn(t)) return false;
    return t.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Select a team">
      <div className="picker" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="picker__header">
          <h2 className="picker__title">Select Team</h2>
          <button
            className="btn btn--ghost btn--sm"
            onClick={onClose}
            aria-label="Close picker"
          >
            ✕ Close
          </button>
        </div>

        {/* Search */}
        <input
          ref={inputRef}
          className="picker__search"
          placeholder="Search teams…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search teams"
        />

        {/* Team list */}
        <ul className="picker__list" role="listbox">
          {filtered.length === 0 && (
            <li className="picker__empty">No teams found</li>
          )}
          {filtered.map((team) => {
            const taken = takenIds.includes(team.id);
            return (
              <li
                key={team.id}
                role="option"
                aria-selected={taken}
                className={`picker__item${taken ? " picker__item--taken" : ""}`}
                onClick={() => !taken && onSelect(team)}
              >
                <span className="picker__flag" aria-hidden="true">{team.flag}</span>
                <span className="picker__name">{team.name}</span>
                <span className="picker__conf">{team.confederation}</span>
                <span className="picker__group">Grp {team.group}</span>
                {taken && <span className="picker__taken-badge">✓</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
