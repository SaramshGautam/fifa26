import React, { useState } from "react";
import { extractGroupResults, buildR32Matchups, groupCompletionRatio } from "../../utils/bracket";
import "./RoundOf32.css";

/**
 * RoundOf32 — smart R32 component.
 *
 * Left panel: user picks the 8 best 3rd-place teams from the 12 thirds
 *             that came out of the group stage predictions.
 * Right panel: 16 auto-generated matchups, user clicks to pick a winner
 *              for each match (those winners flow into R16).
 *
 * predictions.r32Thirds  — array of up to 8 team objects (user's best-8 pick)
 * predictions.r32Winners — array of 16 team|null (user's match winners)
 */
export default function RoundOf32({ predictions, onUpdate }) {
  const [thirdsOpen, setThirdsOpen] = useState(true);

  const groupPreds   = predictions.group || {};
  const chosenThirds = predictions.r32Thirds  || [];
  const matchWinners = predictions.r32Winners  || Array(16).fill(null);

  const completion = groupCompletionRatio(groupPreds);
  const groupsDone = completion === 1;

  const { thirds: allThirds, winners: allWinners, runnersUp: allRunnersUp } =
    extractGroupResults(groupPreds);

  const matchups = buildR32Matchups(groupPreds, chosenThirds);

  /* ── handlers ── */
  const toggleThird = (team) => {
    const already = chosenThirds.findIndex((t) => t.id === team.id);
    let next;
    if (already !== -1) {
      next = chosenThirds.filter((t) => t.id !== team.id);
    } else {
      if (chosenThirds.length >= 8) return; // cap at 8
      next = [...chosenThirds, team];
    }
    onUpdate("r32Thirds", next);
    // clear r32 winners when thirds change — matchups shift
    onUpdate("r32Winners", Array(16).fill(null));
  };

  const pickMatchWinner = (matchIdx, team) => {
    if (!team) return;
    const next = [...matchWinners];
    while (next.length < 16) next.push(null);
    // toggle: clicking same winner deselects
    next[matchIdx] = next[matchIdx]?.id === team.id ? null : team;
    onUpdate("r32Winners", next);
    // propagate winners into r16 pool
    const r16pool = next.filter(Boolean);
    onUpdate("r16", r16pool.length ? r16pool : []);
  };

  const winnersChosen = matchWinners.filter(Boolean).length;

  /* ── incomplete group stage warning ── */
  if (!groupsDone) {
    const missing = 24 - Math.round(completion * 24);
    return (
      <section className="r32">
        <div className="section-header">
          <h2 className="section-header__title">🏟️ Round of 32</h2>
        </div>
        <div className="r32__warning">
          <span className="r32__warning-icon">⚠️</span>
          <div>
            <p className="r32__warning-title">Group stage incomplete</p>
            <p className="r32__warning-body">
              Pick 1st and 2nd place in all 12 groups first.{" "}
              <strong>{missing}</strong> qualifier{missing !== 1 ? "s" : ""} still missing.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="r32">
      <div className="section-header">
        <h2 className="section-header__title">🏟️ Round of 32</h2>
        <p className="section-header__sub">
          Step 1 — pick the 8 best 3rd-place teams. Step 2 — click a team in
          each match to advance them to the Round of 16.
        </p>
      </div>

      {/* ── Step 1: Best-8 thirds picker ── */}
      <div className={`r32__thirds-panel${thirdsOpen ? "" : " r32__thirds-panel--collapsed"}`}>
        <button
          className="r32__thirds-toggle"
          onClick={() => setThirdsOpen((o) => !o)}
          aria-expanded={thirdsOpen}
        >
          <span>
            Step 1 — Best 3rd-place teams
            <span className="r32__thirds-badge">{chosenThirds.length} / 8 selected</span>
          </span>
          <span className="r32__thirds-chevron">{thirdsOpen ? "▲" : "▼"}</span>
        </button>

        {thirdsOpen && (
          <div className="r32__thirds-body">
            <p className="r32__thirds-hint">
              Select exactly 8 of the 12 third-place teams to advance.
              The remaining 4 are eliminated.
            </p>
            <div className="r32__thirds-grid">
              {allThirds.map((team) => {
                const chosen = chosenThirds.some((t) => t.id === team.id);
                const full   = !chosen && chosenThirds.length >= 8;
                return (
                  <button
                    key={team.id}
                    className={`r32__third-btn${chosen ? " r32__third-btn--chosen" : ""}${full ? " r32__third-btn--disabled" : ""}`}
                    onClick={() => toggleThird(team)}
                    disabled={full}
                    aria-pressed={chosen}
                  >
                    <span className="r32__third-flag">{team.flag}</span>
                    <div className="r32__third-info">
                      <span className="r32__third-name">{team.name}</span>
                      <span className="r32__third-group">3rd · Group {team.groupLetter}</span>
                    </div>
                    {chosen && <span className="r32__third-check">✓</span>}
                    {full  && <span className="r32__third-x">✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Step 2: 16 Matchups ── */}
      <div className="r32__matches-header">
        <span className="r32__matches-title">Step 2 — Pick match winners</span>
        <span className="r32__matches-count">{winnersChosen} / 16 picked</span>
      </div>

      <div className="r32__matchups">
        {matchups.map((match, idx) => {
          const winner = matchWinners[idx] || null;
          return (
            <div key={match.id} className={`r32-match${winner ? " r32-match--decided" : ""}`}>
              <div className="r32-match__label">{match.label}</div>

              <MatchTeam
                team={match.home}
                role={match.homeRole}
                isWinner={winner?.id === match.home?.id}
                hasWinner={!!winner}
                onClick={() => pickMatchWinner(idx, match.home)}
              />

              <div className="r32-match__vs">VS</div>

              <MatchTeam
                team={match.away}
                role={match.awayRole}
                isWinner={winner?.id === match.away?.id}
                hasWinner={!!winner}
                onClick={() => pickMatchWinner(idx, match.away)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MatchTeam({ team, role, isWinner, hasWinner, onClick }) {
  if (!team) {
    return (
      <div className="r32-team r32-team--empty">
        <span className="r32-team__placeholder">TBD</span>
        <span className="r32-team__role">{role}</span>
      </div>
    );
  }

  return (
    <button
      className={`r32-team${isWinner ? " r32-team--winner" : ""}${hasWinner && !isWinner ? " r32-team--loser" : ""}`}
      onClick={onClick}
      aria-pressed={isWinner}
      title={`Pick ${team.name} to advance`}
    >
      <span className="r32-team__flag">{team.flag}</span>
      <div className="r32-team__info">
        <span className="r32-team__name">{team.name}</span>
        <span className="r32-team__role">{role} · Grp {team.groupLetter}</span>
      </div>
      {isWinner && <span className="r32-team__tick">✓</span>}
    </button>
  );
}
