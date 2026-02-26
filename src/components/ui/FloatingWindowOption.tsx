"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Unit, Trait } from "@/d";

declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
    };
  }
}

function tierColor(level: number): string {
  if (level >= 5) return "#f97316"; // orange — unique
  if (level >= 4) return "#7e22ce"; // purple — prismatic
  if (level >= 3) return "#eab308"; // yellow — gold
  if (level >= 2) return "#94a3b8"; // slate — silver
  if (level >= 1) return "#92400e"; // amber — bronze
  return "#404040";
}

function computeTraits(currentTeam: (Unit | null)[]) {
  const counts: Record<string, { count: number; trait: Trait }> = {};
  currentTeam.forEach((unit) => {
    if (!unit) return;
    unit.traits.forEach((trait) => {
      if (!counts[trait.name]) counts[trait.name] = { count: 0, trait };
      counts[trait.name].count++;
    });
  });
  return Object.entries(counts)
    .map(([name, { count, trait }]) => {
      const maxBp =
        trait.breakpoints.length > 0
          ? trait.breakpoints[trait.breakpoints.length - 1].count
          : 0;
      const activeBp = [...trait.breakpoints]
        .reverse()
        .find((bp) => count >= bp.count);
      return {
        name,
        count,
        imageUrl: trait.imageUrl,
        level: activeBp?.level ?? 0,
        nextBreakpoint: maxBp,
      };
    })
    .sort((a, b) => b.level - a.level || b.count - a.count);
}

function PipContent({ currentTeam }: { currentTeam: (Unit | null)[] }) {
  const traits = computeTraits(currentTeam);
  const hasUnits = currentTeam.some((u) => u !== null);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        color: "white",
        padding: "10px",
        background: "#0a0a0a",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* Unit grid — 5 columns, 2 rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {currentTeam.map((unit, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#262626",
              borderRadius: "6px",
              overflow: "hidden",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {unit ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={unit.iconUrl}
                  alt={unit.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0,0,0,0.75)",
                    fontSize: "9px",
                    textAlign: "center",
                    padding: "2px 1px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {unit.name}
                </div>
              </>
            ) : (
              <span style={{ color: "#525252", fontSize: "11px" }}>{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Trait badges */}
      {hasUnits && traits.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {traits.map((trait, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: tierColor(trait.level),
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trait.imageUrl}
                  alt={trait.name}
                  style={{
                    width: 13,
                    height: 13,
                    filter: trait.level > 0 ? "brightness(0)" : "opacity(0.5)",
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: "#d4d4d4" }}>
                {trait.count}/{trait.nextBreakpoint || trait.count}
              </span>
            </div>
          ))}
        </div>
      )}

      {!hasUnits && (
        <p
          style={{
            textAlign: "center",
            color: "#525252",
            fontSize: "12px",
            marginTop: "8px",
          }}
        >
          Add units to see your comp here.
        </p>
      )}
    </div>
  );
}

interface Props {
  currentTeam: (Unit | null)[];
}

export default function FloatingWindowOption({ currentTeam }: Props) {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("documentPictureInPicture" in window);
  }, []);

  const togglePip = useCallback(async () => {
    if (pipWindow && !pipWindow.closed) {
      pipWindow.close();
      setPipWindow(null);
      return;
    }

    if (!window.documentPictureInPicture) return;

    const pip = await window.documentPictureInPicture.requestWindow({
      width: 320,
      height: 400,
    });

    // Copy all stylesheets so Tailwind/shared CSS works in the PiP window
    [...document.styleSheets].forEach((sheet) => {
      try {
        if (sheet.href) {
          const link = pip.document.createElement("link");
          link.rel = "stylesheet";
          link.href = sheet.href;
          pip.document.head.appendChild(link);
        } else {
          const style = pip.document.createElement("style");
          style.textContent = [...sheet.cssRules]
            .map((r) => r.cssText)
            .join("\n");
          pip.document.head.appendChild(style);
        }
      } catch {
        // Skip CORS-blocked sheets
      }
    });

    pip.document.body.style.margin = "0";
    pip.document.body.style.padding = "0";
    pip.document.body.style.background = "#0a0a0a";

    pip.addEventListener("pagehide", () => {
      setPipWindow(null);
    });

    setPipWindow(pip);
  }, [pipWindow]);

  if (!isSupported) return null;

  return (
    <>
      <div className="flex flex-col gap-2 p-4 text-center justify-center text-neutral-400">
        <Button
          className={`w-56 mx-auto ${pipWindow ? "bg-blue-800" : "bg-neutral-800"}`}
          radius="full"
          onClick={togglePip}
        >
          <FontAwesomeIcon icon={faUpRightFromSquare} className="h-4 w-4" />
          <span>{pipWindow ? "Close overlay" : "Open in floating window"}</span>
        </Button>
        {!pipWindow && <p className="text-xs">Stays on top of your game</p>}
      </div>

      {pipWindow &&
        !pipWindow.closed &&
        createPortal(<PipContent currentTeam={currentTeam} />, pipWindow.document.body)}
    </>
  );
}
