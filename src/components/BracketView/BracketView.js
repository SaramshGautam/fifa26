import React from "react";
import { GROUPS } from "../../data/teams";
import "./BracketView.css";

const STAGE_META = [
  { key: "r32Winners", label: "Round of 32",    icon: "🏟️" },
  { key: "r16Winners", label: "Round of 16",    icon: "🎯" },
  { key: "qfWinners",  label: "Quarter-Finals", icon: "⚔️" },
  { key: "sfWinners",  label: "Semi-Finals",    icon: "🔥" },
];

export default function BracketView({ predictions }) {
  const champion = (predictions.final || [])[0] || null;

  const groupTeams = GROUPS.flatMap((g) =>
    (predictions.group?.[g] || []).filter(Boolean).map((t) => ({ ...t, groupLabel: `Group ${g}` }))
  );

  const thirds    = (predictions.r32Thirds || []).filter(Boolean);

  const hasAnything =
    groupTeams.length > 0 ||
    thirds.length > 0 ||
    STAGE_META.some((s) => (predictions[s.key] || []).some(Boolean)) ||
    champion;

  if (!hasAnything) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">📋</span>
        <h3 className="empty-state__title">No predictions yet</h3>
        <p className="empty-state__body">Head to Group Stage and start building your bracket.</p>
      </div>
    );
  }

  return (
    <section className="bracket-view">
      <div className="section-header">
        <h2 className="section-header__title">My Bracket</h2>
        <p className="section-header__sub">Your full 2026 FIFA World Cup predictions.</p>
      </div>

      {/* Champion */}
      {champion && (
        <div className="bracket-view__champion">
          <span className="bracket-view__champion-trophy">🏆</span>
          <div>
            <p className="bracket-view__champion-label">Your 2026 World Cup Champion</p>
            <p className="bracket-view__champion-name">{champion.flag} {champion.name}</p>
          </div>
        </div>
      )}

      {/* Group stage picks */}
      {groupTeams.length > 0 && (
        <ViewSection icon="⚽" label="Group Stage" count={groupTeams.length}>
          {groupTeams.map((t, i) => (
            <span key={t.id + i} className="view-badge">
              {t.flag} {t.name}
              <span className="view-badge__meta">{t.groupLabel}</span>
            </span>
          ))}
        </ViewSection>
      )}

      {/* Best-8 thirds */}
      {thirds.length > 0 && (
        <ViewSection icon="3️⃣" label="Best 3rd-Place Qualifiers" count={thirds.length}>
          {thirds.map((t, i) => (
            <span key={t.id + i} className="view-badge">
              {t.flag} {t.name}
            </span>
          ))}
        </ViewSection>
      )}

      {/* Knockout rounds */}
      {STAGE_META.map(({ key, label, icon }) => {
        const teams = (predictions[key] || []).filter(Boolean);
        if (!teams.length) return null;
        return (
          <ViewSection key={key} icon={icon} label={label} count={teams.length}>
            {teams.map((t, i) => (
              <span key={t.id + i} className="view-badge">
                {t.flag} {t.name}
              </span>
            ))}
          </ViewSection>
        );
      })}
    </section>
  );
}

function ViewSection({ icon, label, count, children }) {
  return (
    <div className="view-section">
      <h3 className="view-section__title">
        {icon} {label}
        <span className="view-section__count">{count} teams</span>
      </h3>
      <div className="view-badges">{children}</div>
    </div>
  );
}
