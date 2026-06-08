import React from "react";
import "./MatchupStage.css";

/**
 * MatchupStage — generic matchup-picker component used for R16, QF, SF, Final.
 *
 * Props:
 *   stageId       — "r16" | "qf" | "sf" | "final"
 *   icon          — emoji
 *   label         — display name
 *   description   — subtitle text
 *   matchups      — array from buildR16Matchups / buildQFMatchups / buildSFMatchups / buildFinalMatchup
 *                   each: { id, matchNo, home, homeLabel, away, awayLabel }
 *   winners       — array of team|null (user's picks), length === matchups.length
 *   onPickWinner(matchIdx, team) — called when user clicks a team
 *   prevDone      — bool: is the prerequisite stage complete enough to show matchups?
 *   prevStageName — string: name of the stage that must be completed first
 */
export default function MatchupStage({
  icon,
  label,
  description,
  matchups,
  winners = [],
  onPickWinner,
  prevDone,
  prevStageName,
}) {
  const decided = winners.filter(Boolean).length;
  const total = matchups.length;

  if (!prevDone) {
    return (
      <section className="matchup-stage">
        <div className="section-header">
          <h2 className="section-header__title">
            {icon} {label}
          </h2>
        </div>
        <div className="ms__warning">
          <span className="ms__warning-icon">⚠️</span>
          <div>
            <p className="ms__warning-title">Previous stage incomplete</p>
            <p className="ms__warning-body">
              Complete the <strong>{prevStageName}</strong> first — pick winners
              for all matches before advancing here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="matchup-stage">
      <div className="section-header">
        <h2 className="section-header__title">
          {icon} {label}
        </h2>
        <p className="section-header__sub">{description}</p>
      </div>

      <div className="ms__progress-row">
        <div className="progress-bar" style={{ flex: 1 }}>
          <div
            className="progress-bar__fill"
            style={{ width: `${Math.round((decided / total) * 100)}%` }}
          />
        </div>
        <span className="ms__progress-label">
          {decided} / {total} picked
        </span>
      </div>

      <div className="ms__matchups">
        {matchups.map((match, idx) => {
          const winner = winners[idx] || null;
          return (
            <div
              key={match.id}
              className={`ms-match${winner ? " ms-match--decided" : ""}`}
            >
              <div className="ms-match__header">
                <span className="ms-match__no">Match {match.matchNo}</span>
                {winner && (
                  <span className="ms-match__result">
                    {winner.flag} {winner.name} advances
                  </span>
                )}
              </div>

              <div className="ms-match__teams">
                <MatchTeam
                  team={match.home}
                  placeholder={match.homeLabel}
                  isWinner={winner?.id === match.home?.id}
                  hasWinner={!!winner}
                  onClick={() => match.home && onPickWinner(idx, match.home)}
                />
                <div className="ms-match__vs">VS</div>
                <MatchTeam
                  team={match.away}
                  placeholder={match.awayLabel}
                  isWinner={winner?.id === match.away?.id}
                  hasWinner={!!winner}
                  onClick={() => match.away && onPickWinner(idx, match.away)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MatchTeam({ team, placeholder, isWinner, hasWinner, onClick }) {
  if (!team) {
    return (
      <div className="ms-team ms-team--tbd">
        <span className="ms-team__tbd">TBD</span>
        <span className="ms-team__placeholder">{placeholder}</span>
      </div>
    );
  }

  return (
    <button
      className={`ms-team${isWinner ? " ms-team--winner" : ""}${
        hasWinner && !isWinner ? " ms-team--loser" : ""
      }`}
      onClick={onClick}
      aria-pressed={isWinner}
      title={`Pick ${team.name} to advance`}
    >
      <span className="ms-team__flag">{team.flag}</span>
      <div className="ms-team__info">
        <span className="ms-team__name">{team.name}</span>
        {team.groupLetter && (
          <span className="ms-team__meta">
            {team.role} · Group {team.groupLetter}
          </span>
        )}
      </div>
      {isWinner && <span className="ms-team__tick">✓</span>}
    </button>
  );
}
