import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { usePredictions } from "./hooks/usePredictions";
import { TABS } from "./data/stages";
import {
  buildR16Matchups,
  buildQFMatchups,
  buildSFMatchups,
  buildFinalMatchup,
} from "./utils/bracket";

import Header        from "./components/Header/Header";
import NavTabs       from "./components/NavTabs/NavTabs";
import LoginPage     from "./components/LoginPage/LoginPage";
import GroupStage    from "./components/GroupStage/GroupStage";
import RoundOf32     from "./components/RoundOf32/RoundOf32";
import MatchupStage  from "./components/MatchupStage/MatchupStage";
import BracketView   from "./components/BracketView/BracketView";

import "./App.css";

export default function App() {
  const { user, initialPreds, login, signup, logout } = useAuth();
  const { predictions, updateStage } = usePredictions(user?.username, initialPreds);
  const [activeTab, setActiveTab] = useState("group");

  if (!user) {
    return (
      <>
        <Header user={null} onLogout={null} />
        <LoginPage onLogin={login} onSignup={signup} />
      </>
    );
  }

  // ── Derived bracket state ────────────────────────────────────
  const r32Winners = predictions.r32Winners || [];
  const r16Winners = predictions.r16Winners || [];
  const qfWinners  = predictions.qfWinners  || [];
  const sfWinners  = predictions.sfWinners  || [];

  const r32Done = r32Winners.filter(Boolean).length === 16;
  const r16Done = r16Winners.filter(Boolean).length === 8;
  const qfDone  = qfWinners.filter(Boolean).length  === 4;
  const sfDone  = sfWinners.filter(Boolean).length  === 2;

  const r16Matchups   = buildR16Matchups(r32Winners);
  const qfMatchups    = buildQFMatchups(r16Winners);
  const sfMatchups    = buildSFMatchups(qfWinners);
  const finalMatchups = buildFinalMatchup(sfWinners);

  // Generic winner-picker factory — picks from a matchup array and
  // saves to stageKey, then clears all downstream stages.
  const makePickHandler = (stageKey, matchups, downstreamKeys) => (idx, team) => {
    const current = [...(predictions[stageKey] || Array(matchups.length).fill(null))];
    while (current.length < matchups.length) current.push(null);
    // toggle: clicking same winner deselects
    current[idx] = current[idx]?.id === team.id ? null : team;
    updateStage(stageKey, current);
    // clear all downstream stages since bracket has changed
    downstreamKeys.forEach((k) => updateStage(k, []));
  };

  const pickR16 = makePickHandler("r16Winners", r16Matchups, ["qfWinners", "sfWinners", "final"]);
  const pickQF  = makePickHandler("qfWinners",  qfMatchups,  ["sfWinners", "final"]);
  const pickSF  = makePickHandler("sfWinners",  sfMatchups,  ["final"]);
  const pickFinal = (idx, team) => {
    const current = [...(predictions.final || [null])];
    current[0] = current[0]?.id === team.id ? null : team;
    updateStage("final", current);
  };

  // ── Render ────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "group":
        return <GroupStage predictions={predictions} onUpdate={updateStage} />;

      case "r32":
        return <RoundOf32 predictions={predictions} onUpdate={updateStage} />;

      case "r16":
        return (
          <MatchupStage
            icon="🎯"
            label="Round of 16"
            description="Winners from the Round of 32 face off. Click a team to advance them to the Quarter-Finals."
            matchups={r16Matchups}
            winners={r16Winners}
            onPickWinner={pickR16}
            prevDone={r32Done}
            prevStageName="Round of 32"
          />
        );

      case "qf":
        return (
          <MatchupStage
            icon="⚔️"
            label="Quarter-Finals"
            description="The last 8 teams. Pick who survives to the Semi-Finals."
            matchups={qfMatchups}
            winners={qfWinners}
            onPickWinner={pickQF}
            prevDone={r16Done}
            prevStageName="Round of 16"
          />
        );

      case "sf":
        return (
          <MatchupStage
            icon="🔥"
            label="Semi-Finals"
            description="Four teams remain. Who reaches the Final at MetLife Stadium?"
            matchups={sfMatchups}
            winners={sfWinners}
            onPickWinner={pickSF}
            prevDone={qfDone}
            prevStageName="Quarter-Finals"
          />
        );

      case "final":
        return (
          <MatchupStage
            icon="🏆"
            label="The Final — July 19, MetLife Stadium"
            description="The two finalists. Pick your World Cup Champion."
            matchups={finalMatchups}
            winners={predictions.final || []}
            onPickWinner={pickFinal}
            prevDone={sfDone}
            prevStageName="Semi-Finals"
          />
        );

      case "view":
        return <BracketView predictions={predictions} />;

      default:
        return null;
    }
  };

  return (
    <>
      <Header user={user} onLogout={logout} />
      <NavTabs tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />
      <main className="app-content">{renderContent()}</main>
    </>
  );
}
