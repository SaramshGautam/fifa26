import React from "react";
import "./NavTabs.css";

/**
 * NavTabs — horizontal scrollable tab bar for switching between tournament stages.
 */
export default function NavTabs({ tabs, activeTab, onSelect }) {
  return (
    <nav className="nav-tabs" role="tablist" aria-label="Tournament stages">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`nav-tab${activeTab === tab.id ? " nav-tab--active" : ""}`}
          onClick={() => onSelect(tab.id)}
        >
          <span className="nav-tab__icon" aria-hidden="true">{tab.icon}</span>
          <span className="nav-tab__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
