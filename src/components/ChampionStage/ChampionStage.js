import React, { useState } from "react";
import TeamPicker from "../TeamPicker/TeamPicker";
import "./ChampionStage.css";

/**
 * ChampionStage — lets the user pick their predicted World Cup champion.
 */
export default function ChampionStage({ predictions, onUpdate }) {
  const [showPicker, setShowPicker] = useState(false);

  const champion = (predictions.final || [])[0] || null;

  const handleSelect = (team) => {
    onUpdate("final", [team]);
    setShowPicker(false);
  };

  const handleRemove = () => {
    onUpdate("final", [null]);
  };

  return (
    <section className="champion-stage">
      <div className="section-header">
        <h2 className="section-header__title">🏆 World Cup Champion</h2>
        <p className="section-header__sub">
          Who will lift the FIFA World Cup trophy on July 19, 2026?
        </p>
      </div>

      <div className="champion-stage__card">
        {champion ? (
          <div className="champion-card">
            <span className="champion-card__trophy" aria-hidden="true">🏆</span>
            <span className="champion-card__flag">{champion.flag}</span>
            <h3 className="champion-card__name">{champion.name}</h3>
            <p className="champion-card__label">Your 2026 World Cup Champion</p>
            <div className="champion-card__actions">
              <button
                className="btn btn--gold"
                onClick={() => setShowPicker(true)}
              >
                Change pick
              </button>
              <button
                className="btn btn--danger"
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="champion-empty">
            <span className="champion-empty__icon" aria-hidden="true">🏆</span>
            <p className="champion-empty__prompt">No champion selected yet</p>
            <button
              className="btn btn--gold btn--lg"
              onClick={() => setShowPicker(true)}
            >
              Pick your champion
            </button>
          </div>
        )}
      </div>

      {showPicker && (
        <TeamPicker
          takenIds={[]}
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </section>
  );
}
