import React, { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { INTRO_LINES, INTRO_TITLE, INTRO_SUBTITLE } from '../data/intro';

const LINE_DELAY_MS = 700;
const CHAR_MS = 18;

export default function IntroBoot() {
  const completeIntro = useGameStore((s) => s.completeIntro);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const skipAll = useCallback(() => {
    setLineIndex(INTRO_LINES.length);
    setFinishedTyping(true);
  }, []);

  useEffect(() => {
    if (finishedTyping) return undefined;
    if (lineIndex >= INTRO_LINES.length) {
      setFinishedTyping(true);
      return undefined;
    }

    const full = INTRO_LINES[lineIndex];
    if (charIndex < full.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), CHAR_MS);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, LINE_DELAY_MS);
    return () => clearTimeout(t);
  }, [lineIndex, charIndex, finishedTyping]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (finishedTyping) completeIntro();
        else skipAll();
      }
      if (e.key === 'Escape') skipAll();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finishedTyping, completeIntro, skipAll]);

  const visibleLines = finishedTyping
    ? INTRO_LINES
    : INTRO_LINES.slice(0, lineIndex).concat(
        lineIndex < INTRO_LINES.length
          ? [INTRO_LINES[lineIndex].slice(0, charIndex)]
          : []
      );

  return (
    <div className="intro-boot">
      <div className="intro-boot-header">
        <div className="intro-boot-title">{INTRO_TITLE}</div>
        <div className="intro-boot-sub">{INTRO_SUBTITLE}</div>
      </div>

      <div className="intro-boot-log" aria-live="polite">
        {visibleLines.map((line, i) => (
          <div key={i} className="intro-boot-line">
            {line}
            {!finishedTyping && i === visibleLines.length - 1 && (
              <span className="intro-cursor">█</span>
            )}
          </div>
        ))}
      </div>

      <div className="intro-boot-actions">
        {!finishedTyping ? (
          <button type="button" className="intro-boot-btn" onClick={skipAll}>
            Pular intro [Esc]
          </button>
        ) : (
          <button
            type="button"
            className="intro-boot-btn intro-boot-btn--primary"
            onClick={completeIntro}
          >
            Iniciar transmissão [Enter]
          </button>
        )}
      </div>
    </div>
  );
}
