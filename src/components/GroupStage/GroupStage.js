import React, { useState } from "react";
import { GROUP_SLOT_LABELS } from "../../data/stages";
import { GROUPS, getTeamsByGroup } from "../../data/teams";
import TeamPicker from "../TeamPicker/TeamPicker";
import "./GroupStage.css";

/**
 * GroupStage — lets user pick 3 advancing teams per group (A–L).
 * Slots: 1st Place, 2nd Place, Best 3rd.
 *
 * predictions.group shape:
 *   { A: [teamOrNull, teamOrNull, teamOrNull], B: [...], ... }
 */
export default function GroupStage({ predictions, onUpdate }) {
  const [picker, setPicker] = useState(null); // { group, slot } | null

  const groupData = predictions.group || {};
  const allSelectedIds = Object.values(groupData)
    .flat()
    .filter(Boolean)
    .map((t) => t.id);

  const handleTeamClick = (groupLetter, team) => {
    const current = (groupData[groupLetter] || [null, null, null]).slice();
    const existingIdx = current.findIndex((t) => t?.id === team.id);
    if (existingIdx !== -1) {
      current.splice(existingIdx, 1);
      while (current.length < 3) current.push(null);
    } else {
      const emptyIdx = current.findIndex((t) => t === null);
      if (emptyIdx === -1) return;
      current[emptyIdx] = team;
    }
    onUpdate("group", { ...groupData, [groupLetter]: current });
  };

  const totalSlots = GROUPS.length * GROUP_SLOT_LABELS.length;
  const filled = Object.values(groupData).flat().filter(Boolean).length;
  const pct = Math.round((filled / totalSlots) * 100);
  const groupsDone = GROUPS.filter(
    (g) =>
      (groupData[g] || []).filter(Boolean).length === GROUP_SLOT_LABELS.length
  ).length;

  const openPicker = (group, slot) => setPicker({ group, slot });
  const closePicker = () => setPicker(null);

  const handleSelect = (team) => {
    if (!picker) return;
    const { group, slot } = picker;
    const current = [...(groupData[group] || [null, null, null])];
    current[slot] = team;
    onUpdate("group", { ...groupData, [group]: current });
    setPicker(null);
  };

  const handleRemove = (group, slot) => {
    const current = [...(groupData[group] || [null, null, null])];
    current[slot] = null;
    onUpdate("group", { ...groupData, [group]: current });
  };

  return (
    <section className="group-stage">
      <div className="section-header">
        <h2 className="section-header__title">Group Stage</h2>
        <p className="section-header__sub">
          Click teams in finishing order (1st → 2nd → Best 3rd). Click a
          selected team to deselect it. Only teams in that group are shown.
        </p>
      </div>

      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__value">{filled}</div>
          <div className="stat-card__label">Teams picked</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{totalSlots - filled}</div>
          <div className="stat-card__label">Slots left</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">
            {groupsDone} / {GROUPS.length}
          </div>
          <div className="stat-card__label">Groups done</div>
        </div>
      </div>

      <div className="group-stage__grid">
        {GROUPS.map((g) => {
          const groupTeams = getTeamsByGroup(g);
          const slots = groupData[g] || [null, null, null];
          const complete =
            slots.filter(Boolean).length === GROUP_SLOT_LABELS.length;

          return (
            <div
              key={g}
              className={`group-card${complete ? " group-card--complete" : ""}`}
            >
              <div className="group-card__header">
                <span className="group-card__label">Group {g}</span>
                {complete && <span className="group-card__done">✓</span>}
              </div>

              {/* Rank summary */}
              <div className="group-card__ranks">
                {GROUP_SLOT_LABELS.map((label, i) => {
                  const team = slots[i];
                  return (
                    <div
                      key={i}
                      className={`rank-slot${team ? " rank-slot--filled" : ""}`}
                    >
                      <span className="rank-slot__number">{i + 1}</span>
                      {team ? (
                        <>
                          <span className="rank-slot__flag">{team.flag}</span>
                          <span className="rank-slot__name">{team.name}</span>
                        </>
                      ) : (
                        <span className="rank-slot__label">{label}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="group-card__divider" />

              {/* Clickable team list — only this group's 4 teams */}
              <div className="group-card__teams">
                {groupTeams.map((team) => {
                  const rank = slots.findIndex((t) => t?.id === team.id);
                  const isSelected = rank !== -1;
                  const allFull =
                    slots.filter(Boolean).length >= GROUP_SLOT_LABELS.length;

                  return (
                    <button
                      key={team.id}
                      className={`team-btn${
                        isSelected ? " team-btn--selected" : ""
                      }${!isSelected && allFull ? " team-btn--disabled" : ""}`}
                      onClick={() => handleTeamClick(g, team)}
                      aria-pressed={isSelected}
                      disabled={!isSelected && allFull}
                    >
                      <span className="team-btn__flag">{team.flag}</span>
                      <span className="team-btn__name">{team.name}</span>
                      <span className="team-btn__conf">
                        {team.confederation}
                      </span>
                      {isSelected && (
                        <span className="team-btn__rank">{rank + 1}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
