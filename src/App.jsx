import { useState, useEffect, useRef, useCallback } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Unbounded:wght@300;400;700;900&family=Montserrat:wght@200;300;400;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --gold: #c9a84c;
    --gold-light: #f0d080;
    --gold-dim: #8a6e2f;
    --crimson: #8b0000;
    --crimson-bright: #cc2200;
    --ice: #a8d4f5;
    --midnight: #050810;
    --deep: #08091a;
    --glow-gold: 0 0 40px rgba(201,168,76,0.6), 0 0 80px rgba(201,168,76,0.3);
    --glow-crimson: 0 0 40px rgba(139,0,0,0.8), 0 0 80px rgba(204,34,0,0.4);
    --glow-ice: 0 0 40px rgba(168,212,245,0.5), 0 0 80px rgba(168,212,245,0.2);
  }

  html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #050810; }

  .presentation-root {
    width: 100vw; height: 100vh;
    font-family: 'Cormorant Garamond', serif;
    overflow: hidden;
    position: relative;
    background: var(--midnight);
    cursor: none;
  }

  /* === CURSOR === */
  .cursor-ring {
    position: fixed; width: 40px; height: 40px;
    border: 1px solid rgba(201,168,76,0.6);
    border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s;
    mix-blend-mode: difference;
  }
  .cursor-dot {
    position: fixed; width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px var(--gold);
  }

  /* === GLOBAL BG === */
  .global-bg {
    position: fixed; inset: 0; z-index: 0;
    background: radial-gradient(ellipse at 20% 50%, #0d1a2e 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, #1a0d0d 0%, transparent 60%),
                radial-gradient(ellipse at 50% 80%, #0a0d1a 0%, transparent 60%),
                #050810;
  }

  /* === AURORA === */
  .aurora {
    position: fixed; inset: 0; z-index: 1; pointer-events: none; overflow: hidden;
  }
  .aurora-band {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: auroraFloat 20s ease-in-out infinite;
  }
  .aurora-band:nth-child(1) {
    width: 120%; height: 40%;
    top: -10%; left: -10%;
    background: linear-gradient(90deg, #8b0000, #1a0a4a, #003366);
    animation-delay: 0s;
  }
  .aurora-band:nth-child(2) {
    width: 100%; height: 30%;
    top: 20%; left: 0;
    background: linear-gradient(90deg, #1a0a4a, #8b0000, #003366);
    animation-delay: -7s;
    opacity: 0.1;
  }
  .aurora-band:nth-child(3) {
    width: 80%; height: 50%;
    bottom: -10%; right: -10%;
    background: linear-gradient(90deg, #003366, #1a0a4a, #8b0000);
    animation-delay: -14s;
    opacity: 0.08;
  }
  @keyframes auroraFloat {
    0%, 100% { transform: translateY(0) scaleX(1) skewX(0deg); opacity: 0.15; }
    33% { transform: translateY(-3%) scaleX(1.05) skewX(2deg); opacity: 0.2; }
    66% { transform: translateY(3%) scaleX(0.95) skewX(-2deg); opacity: 0.12; }
  }

  /* === PARTICLES === */
  .particles-canvas {
    position: fixed; inset: 0; z-index: 2; pointer-events: none;
  }

  /* === SLIDE === */
  .slide-container {
    position: relative; z-index: 10;
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }

  .slide {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0s;
  }
  .slide.active { opacity: 1; pointer-events: all; }
  .slide.entering { animation: slideEnter 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
  .slide.leaving { animation: slideLeave 1.2s cubic-bezier(0.7,0,0.84,0) forwards; }

  @keyframes slideEnter {
    from { opacity: 0; transform: scale(1.04) translateY(20px); filter: blur(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
  }
  @keyframes slideLeave {
    from { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
    to { opacity: 0; transform: scale(0.97) translateY(-20px); filter: blur(8px); }
  }

  /* === PROGRESS === */
  .progress-bar {
    position: fixed; bottom: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, var(--crimson), var(--gold), var(--gold-light));
    z-index: 100;
    transition: width 0.1s linear;
    box-shadow: 0 0 12px rgba(201,168,76,0.8);
  }

  /* === SLIDE DOTS === */
  .slide-dots {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 10px; z-index: 100;
  }
  .slide-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(201,168,76,0.3);
    border: 1px solid rgba(201,168,76,0.4);
    cursor: pointer;
    transition: all 0.4s ease;
  }
  .slide-dot.active {
    background: var(--gold);
    box-shadow: 0 0 10px var(--gold);
    transform: scale(1.4);
  }

  /* === FULLSCREEN BTN === */
  .fs-btn {
    position: fixed; top: 28px; right: 28px;
    width: 52px; height: 52px;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 14px;
    color: var(--gold);
    font-size: 20px;
    cursor: pointer;
    z-index: 100;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .fs-btn:hover {
    background: rgba(201,168,76,0.15);
    border-color: var(--gold);
    box-shadow: var(--glow-gold), 0 8px 32px rgba(0,0,0,0.4);
    transform: scale(1.05);
  }

  /* === SLIDE COUNTER === */
  .slide-counter {
    position: fixed; top: 28px; left: 28px;
    font-family: 'Unbounded', sans-serif;
    font-size: 11px; font-weight: 300;
    color: rgba(201,168,76,0.5);
    letter-spacing: 4px;
    z-index: 100;
    display: flex; align-items: center; gap: 8px;
  }
  .counter-line {
    width: 40px; height: 1px;
    background: rgba(201,168,76,0.3);
  }

  /* ============================================================
     SLIDE SPECIFIC STYLES
  ============================================================ */

  /* SLIDE 1 — INTRO CINEMATIC */
  .s1-wrap {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .s1-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,0,0,0.25) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 70% 30%, rgba(201,168,76,0.1) 0%, transparent 60%);
  }
  .s1-kremlin {
    position: absolute; bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 100%; height: 50%;
    background:
      linear-gradient(to top, rgba(139,0,0,0.15) 0%, transparent 100%);
    display: flex; align-items: flex-end; justify-content: center;
  }
  .kremlin-silhouette {
    width: 100%;
    height: 300px;
    position: relative;
    opacity: 0.08;
  }
  .s1-main {
    position: relative; z-index: 2;
    text-align: center;
    animation: s1Reveal 2s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes s1Reveal {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .s1-eyebrow {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(9px,1vw,13px);
    font-weight: 300;
    letter-spacing: 10px;
    color: rgba(201,168,76,0.7);
    text-transform: uppercase;
    margin-bottom: 32px;
    animation: fadeUp 1.5s 0.3s both;
  }
  .s1-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px,8vw,130px);
    font-weight: 900;
    line-height: 0.9;
    color: #fff;
    text-shadow: 0 0 80px rgba(201,168,76,0.3);
    animation: fadeUp 1.5s 0.6s both;
    position: relative;
  }
  .s1-title .highlight {
    color: var(--gold);
    display: block;
    text-shadow: var(--glow-gold);
    font-style: italic;
  }
  .s1-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(18px,2.5vw,34px);
    font-weight: 300;
    font-style: italic;
    color: rgba(255,255,255,0.55);
    margin-top: 28px;
    letter-spacing: 2px;
    animation: fadeUp 1.5s 0.9s both;
  }
  .s1-line {
    width: 200px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 40px auto;
    animation: expandLine 2s 1.2s both;
  }
  @keyframes expandLine {
    from { width: 0; opacity: 0; }
    to { width: 200px; opacity: 1; }
  }
  .s1-year {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(80px,15vw,220px);
    font-weight: 900;
    color: rgba(139,0,0,0.08);
    position: absolute;
    bottom: -2%;
    left: 50%; transform: translateX(-50%);
    white-space: nowrap;
    letter-spacing: -5px;
    animation: slowScale 20s linear infinite alternate;
  }
  @keyframes slowScale {
    from { transform: translateX(-50%) scale(1); }
    to { transform: translateX(-50%) scale(1.05); }
  }

  /* SLIDE 2 — ЯЗЫК КУЛЬТУРЫ */
  .s2-wrap {
    width: 100%; height: 100%;
    display: grid; grid-template-columns: 1fr 1fr;
    position: relative; overflow: hidden;
  }
  .s2-left {
    display: flex; flex-direction: column;
    justify-content: center; padding: 8% 6% 8% 10%;
    position: relative; z-index: 2;
  }
  .s2-right {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .s2-big-char {
    font-family: 'Playfair Display', serif;
    font-size: clamp(200px,28vw,420px);
    font-weight: 900;
    font-style: italic;
    color: rgba(139,0,0,0.12);
    line-height: 1;
    animation: floatChar 8s ease-in-out infinite;
    user-select: none;
  }
  @keyframes floatChar {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-3%) rotate(-3deg); }
  }
  .s2-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(139,0,0,0.12) 0%, transparent 50%);
  }
  .slide-tag {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(9px,0.8vw,11px);
    font-weight: 400;
    letter-spacing: 6px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 28px;
    opacity: 0.8;
    animation: fadeUp 1s 0.2s both;
  }
  .slide-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px,4.5vw,72px);
    font-weight: 700;
    line-height: 1.1;
    color: #fff;
    margin-bottom: 32px;
    animation: fadeUp 1s 0.4s both;
  }
  .slide-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px,1.6vw,24px);
    font-weight: 300;
    line-height: 1.8;
    color: rgba(255,255,255,0.6);
    animation: fadeUp 1s 0.6s both;
  }
  .quote-block {
    margin-top: 48px;
    padding: 28px 32px;
    border-left: 2px solid var(--gold);
    background: rgba(201,168,76,0.05);
    backdrop-filter: blur(10px);
    border-radius: 0 12px 12px 0;
    animation: fadeUp 1s 0.8s both;
  }
  .quote-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px,1.8vw,26px);
    font-style: italic;
    color: rgba(255,255,255,0.85);
    line-height: 1.6;
  }
  .quote-author {
    margin-top: 12px;
    font-family: 'Unbounded', sans-serif;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--gold);
    opacity: 0.7;
  }

  /* SLIDE 3 — ПУТЕШЕСТВИЕ */
  .s3-wrap {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 5%;
  }
  .s3-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 20% 20%, rgba(0,30,80,0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(139,0,0,0.3) 0%, transparent 50%);
  }
  .s3-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px,5vw,80px);
    font-weight: 900;
    color: #fff;
    text-align: center;
    margin-bottom: 60px;
    animation: fadeUp 1s 0.2s both;
    text-shadow: 0 0 60px rgba(201,168,76,0.2);
  }
  .cities-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    width: 100%;
    max-width: 1200px;
    animation: fadeUp 1s 0.4s both;
  }
  .city-card {
    padding: 36px 28px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    position: relative; overflow: hidden;
    transition: all 0.4s ease;
    text-align: center;
  }
  .city-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .city-card:hover::before { opacity: 1; }
  .city-card:hover {
    border-color: rgba(201,168,76,0.4);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(201,168,76,0.1);
    transform: translateY(-4px);
  }
  .city-icon {
    font-size: clamp(36px,4vw,60px);
    margin-bottom: 16px;
    display: block;
    filter: drop-shadow(0 0 20px rgba(201,168,76,0.4));
  }
  .city-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px,2vw,30px);
    font-weight: 700;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .city-desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(13px,1.2vw,18px);
    color: rgba(255,255,255,0.5);
    line-height: 1.5;
  }

  /* SLIDE 4 — ПИСАТЕЛИ */
  .s4-wrap {
    width: 100%; height: 100%;
    display: grid; grid-template-columns: 1fr 1.2fr;
    position: relative; overflow: hidden;
  }
  .s4-left {
    display: flex; flex-direction: column;
    justify-content: center; padding: 8% 5% 8% 10%;
    position: relative; z-index: 2;
  }
  .s4-right {
    display: flex; flex-direction: column;
    justify-content: center; gap: 24px;
    padding: 8% 10% 8% 5%;
    position: relative; z-index: 2;
  }
  .s4-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.07) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 70%, rgba(0,20,60,0.5) 0%, transparent 50%);
  }
  .writer-card {
    padding: 22px 26px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 16px;
    backdrop-filter: blur(15px);
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
    animation: fadeUp 1s both;
  }
  .writer-card:nth-child(1) { animation-delay: 0.3s; }
  .writer-card:nth-child(2) { animation-delay: 0.5s; }
  .writer-card:nth-child(3) { animation-delay: 0.7s; }
  .writer-card:hover {
    border-color: rgba(201,168,76,0.35);
    transform: translateX(8px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }
  .writer-card .glow-line {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, var(--crimson), var(--gold));
    border-radius: 2px;
  }
  .writer-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(16px,1.6vw,24px);
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
    padding-left: 14px;
  }
  .writer-dates {
    font-family: 'Unbounded', sans-serif;
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--gold);
    opacity: 0.6;
    padding-left: 14px;
    margin-bottom: 10px;
  }
  .writer-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(13px,1.2vw,18px);
    font-style: italic;
    color: rgba(255,255,255,0.5);
    line-height: 1.5;
    padding-left: 14px;
  }
  .big-ru-letter {
    font-family: 'Playfair Display', serif;
    font-size: clamp(120px,18vw,280px);
    font-weight: 900;
    font-style: italic;
    background: linear-gradient(135deg, rgba(139,0,0,0.3) 0%, rgba(201,168,76,0.15) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    user-select: none;
    animation: fadeUp 1s 0.1s both;
  }

  /* SLIDE 5 — АЛФАВИТ */
  .s5-wrap {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 5%;
  }
  .s5-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(139,0,0,0.2) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(0,20,60,0.4) 0%, transparent 50%);
  }
  .alphabet-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px,4vw,60px);
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-bottom: 48px;
    animation: fadeUp 1s 0.1s both;
  }
  .alphabet-grid {
    display: flex; flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    max-width: 1000px;
    animation: fadeUp 1s 0.3s both;
  }
  .alpha-char {
    width: clamp(44px,5vw,70px);
    height: clamp(44px,5vw,70px);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px,2.5vw,36px);
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 12px;
    cursor: default;
    transition: all 0.3s ease;
    animation: letterPop 0.5s both;
  }
  .alpha-char:hover {
    background: rgba(201,168,76,0.12);
    border-color: var(--gold);
    color: var(--gold);
    box-shadow: 0 0 20px rgba(201,168,76,0.2);
    transform: scale(1.15) translateY(-4px);
  }
  @keyframes letterPop {
    from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
    to { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  .alpha-char.special {
    color: var(--gold);
    border-color: rgba(201,168,76,0.3);
    background: rgba(201,168,76,0.06);
    box-shadow: 0 0 10px rgba(201,168,76,0.1);
  }

  /* SLIDE 6 — ФАКТЫ */
  .s6-wrap {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 5%;
  }
  .s6-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 30%, rgba(0,40,100,0.3) 0%, transparent 60%),
                radial-gradient(ellipse at 30% 70%, rgba(139,0,0,0.2) 0%, transparent 50%);
  }
  .facts-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 24px; max-width: 1100px; width: 100%;
    animation: fadeUp 1s 0.2s both;
  }
  .fact-card {
    padding: 36px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 24px;
    backdrop-filter: blur(20px);
    position: relative; overflow: hidden;
    transition: all 0.4s ease;
  }
  .fact-card::after {
    content: '';
    position: absolute; top: -50%; right: -20%;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    border-radius: 50%;
    transition: all 0.4s;
  }
  .fact-card:hover::after { transform: scale(1.5); }
  .fact-card:hover {
    border-color: rgba(201,168,76,0.25);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }
  .fact-num {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(40px,5vw,72px);
    font-weight: 900;
    color: var(--gold);
    opacity: 0.25;
    line-height: 1;
    margin-bottom: 16px;
  }
  .fact-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(18px,1.8vw,26px);
    font-weight: 700;
    color: #fff;
    margin-bottom: 10px;
  }
  .fact-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(14px,1.3vw,19px);
    color: rgba(255,255,255,0.5);
    line-height: 1.7;
  }

  /* SLIDE 7 — ЛИТЕРАТУРА */
  .s7-wrap {
    width: 100%; height: 100%;
    display: grid; grid-template-columns: 1.2fr 1fr;
    position: relative; overflow: hidden;
  }
  .s7-left {
    display: flex; flex-direction: column;
    justify-content: center; padding: 8% 5% 8% 10%;
    position: relative; z-index: 2;
    gap: 32px;
  }
  .s7-right {
    display: flex; align-items: center; justify-content: center;
    padding: 5%;
    position: relative; z-index: 2;
  }
  .s7-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 40% 50%, rgba(139,0,0,0.15) 0%, transparent 60%);
  }
  .book-stack {
    display: flex; flex-direction: column; gap: 16px; width: 100%;
  }
  .book-item {
    display: flex; align-items: center; gap: 20px;
    padding: 20px 24px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 16px;
    transition: all 0.3s ease;
    animation: fadeUp 1s both;
    cursor: default;
  }
  .book-item:nth-child(1) { animation-delay: 0.2s; }
  .book-item:nth-child(2) { animation-delay: 0.4s; }
  .book-item:nth-child(3) { animation-delay: 0.6s; }
  .book-item:nth-child(4) { animation-delay: 0.8s; }
  .book-item:hover {
    border-color: rgba(201,168,76,0.3);
    background: rgba(201,168,76,0.04);
    transform: translateX(8px);
  }
  .book-spine {
    width: 6px; height: 60px; border-radius: 3px;
    flex-shrink: 0;
  }
  .book-info { flex: 1; }
  .book-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(14px,1.5vw,20px);
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }
  .book-author {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(12px,1.1vw,16px);
    font-style: italic;
    color: rgba(255,255,255,0.45);
  }
  .book-year {
    font-family: 'Unbounded', sans-serif;
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--gold);
    opacity: 0.5;
  }
  .lit-big-text {
    font-family: 'Playfair Display', serif;
    font-size: clamp(80px,12vw,180px);
    font-weight: 900;
    font-style: italic;
    color: rgba(201,168,76,0.07);
    line-height: 0.85;
    user-select: none;
    text-align: center;
    animation: fadeUp 1s 0.1s both;
  }

  /* SLIDE 8 — МУЗЫКА */
  .s8-wrap {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 5%;
  }
  .s8-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 30% 40%, rgba(100,0,150,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, rgba(0,60,120,0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(139,0,0,0.15) 0%, transparent 40%);
  }
  .music-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px,5vw,80px);
    font-weight: 900;
    color: #fff;
    text-align: center;
    margin-bottom: 16px;
    animation: fadeUp 1s 0.1s both;
  }
  .music-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px,1.8vw,26px);
    font-style: italic;
    color: rgba(255,255,255,0.5);
    text-align: center;
    margin-bottom: 56px;
    animation: fadeUp 1s 0.3s both;
  }
  .art-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 20px; max-width: 1100px; width: 100%;
    animation: fadeUp 1s 0.5s both;
  }
  .art-card {
    padding: 28px 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    text-align: center;
    transition: all 0.4s ease;
    position: relative; overflow: hidden;
  }
  .art-card::before {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
    transform: scaleX(0);
    transition: transform 0.4s ease;
    transform-origin: left;
  }
  .art-card:hover::before { transform: scaleX(1); }
  .art-card:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(201,168,76,0.2);
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }
  .art-icon { font-size: clamp(28px,3vw,48px); margin-bottom: 14px; display: block; }
  .art-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(14px,1.4vw,20px);
    font-weight: 700; color: #fff;
    margin-bottom: 8px;
  }
  .art-desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(12px,1.1vw,16px);
    color: rgba(255,255,255,0.4);
    line-height: 1.5;
  }

  /* SLIDE 9 — МОТИВАЦИЯ */
  .s9-wrap {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 8%;
    text-align: center;
  }
  .s9-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 50% 50%, rgba(139,0,0,0.2) 0%, transparent 65%),
      radial-gradient(ellipse at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%);
  }
  .s9-tag {
    font-family: 'Unbounded', sans-serif;
    font-size: 10px; letter-spacing: 8px;
    color: var(--gold); text-transform: uppercase;
    margin-bottom: 40px;
    animation: fadeUp 1s 0.1s both;
    opacity: 0.8;
  }
  .s9-quote {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px,4.5vw,70px);
    font-weight: 700; font-style: italic;
    color: #fff;
    line-height: 1.25;
    max-width: 900px;
    margin-bottom: 48px;
    animation: fadeUp 1s 0.3s both;
    text-shadow: 0 0 60px rgba(201,168,76,0.15);
  }
  .s9-divider {
    width: 120px; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 0 auto 40px;
    animation: expandLine 1.5s 0.5s both;
  }
  .s9-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px,2vw,30px);
    font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.55);
    max-width: 700px;
    line-height: 1.7;
    animation: fadeUp 1s 0.7s both;
  }
  .floating-word {
    position: absolute;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    color: rgba(201,168,76,0.04);
    pointer-events: none; user-select: none;
    animation: floatWord linear infinite;
  }
  @keyframes floatWord {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-20vh) rotate(10deg); opacity: 0; }
  }

  /* SLIDE 10 — ФИНАЛ WOW */
  .s10-wrap {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .s10-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 80%, rgba(139,0,0,0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(0,30,80,0.3) 0%, transparent 50%);
  }
  .s10-ring {
    position: absolute; width: 70vmin; height: 70vmin;
    border: 1px solid rgba(201,168,76,0.08);
    border-radius: 50%;
    animation: ringExpand 6s ease-in-out infinite;
  }
  .s10-ring:nth-child(2) { animation-delay: -2s; width: 85vmin; height: 85vmin; }
  .s10-ring:nth-child(3) { animation-delay: -4s; width: 55vmin; height: 55vmin; }
  @keyframes ringExpand {
    0%, 100% { transform: scale(1); opacity: 0.08; }
    50% { transform: scale(1.05); opacity: 0.15; }
  }
  .s10-main { position: relative; z-index: 2; }
  .s10-eyebrow {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(9px,0.9vw,12px);
    letter-spacing: 10px; color: var(--gold);
    text-transform: uppercase; margin-bottom: 40px;
    animation: fadeUp 1.2s 0.2s both; opacity: 0.7;
  }
  .s10-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(48px,8vw,130px);
    font-weight: 900; line-height: 0.9;
    color: #fff;
    text-shadow: var(--glow-gold);
    animation: fadeUp 1.2s 0.4s both;
  }
  .s10-title .gold { color: var(--gold); font-style: italic; }
  .s10-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(18px,2.5vw,36px);
    font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.5);
    margin-top: 32px;
    animation: fadeUp 1.2s 0.6s both;
  }
  .s10-glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    animation: orbPulse 4s ease-in-out infinite;
  }
  @keyframes orbPulse {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.1); }
  }
  .s10-badge {
    display: inline-flex; align-items: center; gap: 12px;
    margin-top: 56px;
    padding: 16px 32px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 100px;
    backdrop-filter: blur(20px);
    animation: fadeUp 1.2s 0.8s both;
    box-shadow: 0 0 40px rgba(201,168,76,0.1);
  }
  .badge-flag { font-size: 24px; }
  .badge-text {
    font-family: 'Unbounded', sans-serif;
    font-size: clamp(11px,1vw,14px);
    letter-spacing: 4px;
    color: var(--gold);
    font-weight: 300;
  }

  /* SHARED */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .gold-text { color: var(--gold); }
  .italic { font-style: italic; }
  
  /* DECORATIVE LINES */
  .deco-line-h {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent);
    pointer-events: none;
  }
  .deco-line-v {
    position: absolute; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), transparent);
    pointer-events: none;
  }

  /* PAUSE INDICATOR */
  .pause-indicator {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Unbounded', sans-serif;
    font-size: 11px; letter-spacing: 6px;
    color: rgba(201,168,76,0.6);
    text-transform: uppercase;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 200;
  }
  .pause-indicator.visible { opacity: 1; }
`;

const SLIDES_DURATION = 10000;

const russianAlphabet = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я'];
const specialChars = ['Ж','Ш','Щ','Ъ','Ы','Ь','Ё','Ю','Я'];

// === PARTICLE SYSTEM ===
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = [];
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.5 - 0.1,
        opacity: Math.random() * 0.6 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        color: Math.random() > 0.7 ? [201,168,76] : Math.random() > 0.5 ? [168,212,245] : [255,255,255]
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        const a = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        const [r,g,b] = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
        if (p.r > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.1})`;
          ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
}

// === SLIDE COMPONENTS ===

function Slide1() {
  return (
    <div className="s1-wrap">
      <div className="s1-bg" />
      <div className="s1-year">РУССКИЙ</div>
      <div className="s1-main">
        <div className="s1-eyebrow">Добро пожаловать · Welcome · Xush kelibsiz</div>
        <h1 className="s1-title">
          Путешествие
          <span className="highlight">в мир</span>
        </h1>
        <div className="s1-line" />
        <h1 className="s1-title" style={{fontSize:'clamp(36px,5.5vw,90px)', fontWeight:400, fontStyle:'italic', color:'rgba(255,255,255,0.7)', marginTop:'-10px'}}>
          Русского Языка
        </h1>
        <div className="s1-subtitle">Язык, который открывает целый мир</div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="s2-wrap">
      <div className="s2-bg" />
      <div className="deco-line-v" style={{left:'50%'}} />
      <div className="s2-left">
        <div className="slide-tag">Раздел 01 · Язык культуры</div>
        <h2 className="slide-heading">Русский язык —<br /><span className="gold-text italic">язык культуры</span><br />и величия</h2>
        <p className="slide-body">
          Русский язык — один из шести официальных языков ООН.
          На нём говорят более <strong style={{color:'rgba(201,168,76,0.9)'}}>258 миллионов</strong> человек по всему миру.
          Это язык Пушкина, Толстого и Достоевского.
        </p>
        <div className="quote-block">
          <div className="quote-text">«Берегите наш язык, наш прекрасный русский язык — это клад, это достояние.»</div>
          <div className="quote-author">— Иван Тургенев</div>
        </div>
      </div>
      <div className="s2-right">
        <div className="s2-big-char">Я</div>
      </div>
    </div>
  );
}

function Slide3() {
  const cities = [
    { icon: '🏛', name: 'Москва', desc: 'Столица России. Сердце русской культуры и истории' },
    { icon: '🌉', name: 'Санкт-Петербург', desc: 'Город белых ночей. «Окно в Европу» Петра Великого' },
    { icon: '⛪', name: 'Суздаль', desc: 'Жемчужина Золотого кольца. Живая история России' },
    { icon: '🏔', name: 'Байкал', desc: 'Глубочайшее озеро мира. Природное чудо планеты' },
    { icon: '🎭', name: 'Большой театр', desc: 'Символ русского искусства и балета' },
    { icon: '❄️', name: 'Сибирь', desc: 'Бескрайние просторы. Дух свободы и природы' },
  ];
  return (
    <div className="s3-wrap">
      <div className="s3-bg" />
      <h2 className="s3-title">Путешествие <span className="gold-text italic">по русскому миру</span></h2>
      <div className="cities-grid">
        {cities.map((c,i) => (
          <div className="city-card" key={i} style={{animationDelay:`${i*0.1+0.3}s`, animation:'fadeUp 0.8s both'}}>
            <span className="city-icon">{c.icon}</span>
            <div className="city-name">{c.name}</div>
            <div className="city-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide4() {
  const writers = [
    { name: 'Александр Пушкин', dates: '1799 — 1837', quote: '«Я памятник себе воздвиг нерукотворный...»' },
    { name: 'Лев Толстой', dates: '1828 — 1910', quote: '«Все счастливые семьи похожи друг на друга...»' },
    { name: 'Фёдор Достоевский', dates: '1821 — 1881', quote: '«Красота спасёт мир.»' },
  ];
  return (
    <div className="s4-wrap">
      <div className="s4-bg" />
      <div className="deco-line-v" style={{left:'55%'}} />
      <div className="s4-left">
        <div className="slide-tag">Раздел 04 · Великие писатели</div>
        <div className="big-ru-letter">П</div>
        <p className="slide-body" style={{marginTop:24}}>
          Русская литература — <span className="gold-text">величайшее сокровище</span> человечества.
          Произведения русских классиков переведены на сотни языков мира.
        </p>
      </div>
      <div className="s4-right">
        {writers.map((w,i) => (
          <div className="writer-card" key={i}>
            <div className="glow-line" />
            <div className="writer-name">{w.name}</div>
            <div className="writer-dates">{w.dates}</div>
            <div className="writer-quote">{w.quote}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="s5-wrap">
      <div className="s5-bg" />
      <div className="slide-tag" style={{textAlign:'center', animation:'fadeUp 1s 0.1s both'}}>Раздел 05 · Алфавит</div>
      <h2 className="alphabet-title">Красота <span className="gold-text italic">русского алфавита</span></h2>
      <div className="alphabet-grid">
        {russianAlphabet.map((l, i) => (
          <div
            className={`alpha-char${specialChars.includes(l) ? ' special' : ''}`}
            key={l}
            style={{ animationDelay: `${i * 0.04 + 0.3}s` }}
          >
            {l}
          </div>
        ))}
      </div>
      <p className="slide-body" style={{marginTop:40, textAlign:'center', animation:'fadeUp 1s 1.5s both', maxWidth:600}}>
        33 буквы. Каждая — <span className="gold-text">уникальная история</span>.
        Кириллица создана в IX веке святыми Кириллом и Мефодием.
      </p>
    </div>
  );
}

function Slide6() {
  const facts = [
    { num:'258M', title:'Носителей языка', body:'Русский — 8-й по числу носителей в мире и официальный язык ООН' },
    { num:'200K+', title:'Слов в словаре', body:'Словарный запас русского языка — один из богатейших в мире' },
    { num:'11', title:'Часовых поясов', body:'Россия — самая большая страна мира, где говорят по-русски' },
    { num:'1703', title:'Год основания', body:'Год основания Санкт-Петербурга — культурной столицы России' },
  ];
  return (
    <div className="s6-wrap">
      <div className="s6-bg" />
      <div className="slide-tag" style={{textAlign:'center', marginBottom:24, animation:'fadeUp 1s 0.1s both'}}>Раздел 06 · Интересные факты</div>
      <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(28px,4vw,58px)', fontWeight:700, color:'#fff', textAlign:'center', marginBottom:48, animation:'fadeUp 1s 0.2s both'}}>
        Интересные <span className="gold-text italic">факты</span>
      </h2>
      <div className="facts-grid">
        {facts.map((f,i) => (
          <div className="fact-card" key={i} style={{animation:'fadeUp 1s both', animationDelay:`${i*0.15+0.3}s`}}>
            <div className="fact-num">{f.num}</div>
            <div className="fact-title">{f.title}</div>
            <div className="fact-body">{f.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide7() {
  const books = [
    { title:'Война и мир', author:'Лев Толстой', year:'1869', color:'#8b0000' },
    { title:'Преступление и наказание', author:'Ф. Достоевский', year:'1866', color:'#c9a84c' },
    { title:'Евгений Онегин', author:'А. Пушкин', year:'1833', color:'#2d5f8a' },
    { title:'Мастер и Маргарита', author:'М. Булгаков', year:'1967', color:'#4a1a6e' },
  ];
  return (
    <div className="s7-wrap">
      <div className="s7-bg" />
      <div className="deco-line-v" style={{left:'55%'}} />
      <div className="s7-left">
        <div className="slide-tag">Раздел 07 · Литература</div>
        <h2 className="slide-heading">Шедевры <span className="gold-text italic">русской литературы</span></h2>
        <div className="book-stack">
          {books.map((b,i) => (
            <div className="book-item" key={i}>
              <div className="book-spine" style={{background:`linear-gradient(to bottom, ${b.color}, ${b.color}88)`}} />
              <div className="book-info">
                <div className="book-title">{b.title}</div>
                <div className="book-author">{b.author}</div>
              </div>
              <div className="book-year">{b.year}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="s7-right">
        <div className="lit-big-text">Слово</div>
      </div>
    </div>
  );
}

function Slide8() {
  const arts = [
    { icon:'🎭', name:'Балет', desc:'Большой театр — мировая слава русского балета' },
    { icon:'🎼', name:'Чайковский', desc:'«Лебединое озеро» — символ русской музыки' },
    { icon:'🎨', name:'Живопись', desc:'Репин, Суриков — гиганты русского изобразительного искусства' },
    { icon:'🏗', name:'Архитектура', desc:'Собор Василия Блаженного — шедевр русского зодчества' },
  ];
  return (
    <div className="s8-wrap">
      <div className="s8-bg" />
      <h2 className="music-title">Музыка и <span className="gold-text italic">искусство</span></h2>
      <p className="music-subtitle">Россия подарила миру бесценные сокровища культуры</p>
      <div className="art-grid">
        {arts.map((a,i) => (
          <div className="art-card" key={i} style={{animation:'fadeUp 0.8s both', animationDelay:`${i*0.15+0.3}s`}}>
            <span className="art-icon">{a.icon}</span>
            <div className="art-name">{a.name}</div>
            <div className="art-desc">{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide9() {
  const words = ['Любовь','Красота','Мудрость','Свобода','Душа','Мечта','Сила'];
  return (
    <div className="s9-wrap">
      <div className="s9-bg" />
      {words.map((w,i) => (
        <div key={i} className="floating-word" style={{
          fontSize: `${Math.random()*60+40}px`,
          left: `${(i/words.length)*90+5}%`,
          animationDuration: `${Math.random()*10+15}s`,
          animationDelay: `${-Math.random()*15}s`,
        }}>{w}</div>
      ))}
      <div className="s9-tag">Раздел 09 · Вдохновение</div>
      <div className="s9-quote">
        «Язык — это история народа. Язык — это путь цивилизации и культуры.»
      </div>
      <div className="s9-divider" />
      <p className="s9-body">
        Изучая русский язык, вы открываете дверь<br />в один из богатейших миров человеческой культуры.<br />
        <span className="gold-text italic">Каждое слово — это целый мир.</span>
      </p>
    </div>
  );
}

function Slide10() {
  return (
    <div className="s10-wrap">
      <div className="s10-bg" />
      <div className="s10-ring" />
      <div className="s10-ring" />
      <div className="s10-ring" />
      <div className="s10-glow-orb" style={{width:400,height:400,background:'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}} />
      <div className="s10-glow-orb" style={{width:300,height:300,background:'radial-gradient(circle, rgba(139,0,0,0.2) 0%, transparent 70%)',top:'30%',left:'20%',animationDelay:'-2s'}} />
      <div className="s10-main">
        <div className="s10-eyebrow">Финальный экран · The Grand Finale</div>
        <h1 className="s10-title">
          Русский язык —<br /><span className="gold">это красота</span><br />без границ
        </h1>
        <div className="s10-subtitle">
          Благодарим за внимание. Путешествие продолжается…
        </div>
        <div className="s10-badge">
          <span className="badge-flag">🇷🇺</span>
          <span className="badge-text">РУССКИЙ ЯЗЫК · 2025</span>
          <span className="badge-flag">✨</span>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState('active'); // active | leaving | entering
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [cursor, setCursor] = useState({x: -100, y: -100});
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startRef = useRef(null);
  const pausedAtRef = useRef(null);
  const elapsedRef = useRef(0);

  useParticles(canvasRef);

  const goToSlide = useCallback((idx) => {
    setState('leaving');
    setTimeout(() => {
      setCurrent(idx);
      setState('entering');
      setTimeout(() => setState('active'), 1200);
    }, 800);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % SLIDES.length);
  }, [current, goToSlide]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(progressRef.current);
    startRef.current = Date.now() - elapsedRef.current;
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress((elapsed / SLIDES_DURATION) * 100);
      if (elapsed >= SLIDES_DURATION) {
        elapsedRef.current = 0;
        nextSlide();
      }
    }, 50);
  }, [nextSlide]);

  const pauseTimer = useCallback(() => {
    clearInterval(progressRef.current);
    pausedAtRef.current = Date.now();
    elapsedRef.current = pausedAtRef.current - startRef.current;
  }, []);

  useEffect(() => {
    elapsedRef.current = 0;
    startTimer();
    return () => clearInterval(progressRef.current);
  }, [current]);

  useEffect(() => {
    if (paused) pauseTimer();
    else startTimer();
  }, [paused]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { elapsedRef.current=0; nextSlide(); }
      if (e.key === 'ArrowLeft') { elapsedRef.current=0; goToSlide((current-1+SLIDES.length)%SLIDES.length); }
      if (e.key === 'p' || e.key === 'P') setPaused(p => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, nextSlide, goToSlide]);

  useEffect(() => {
    const onFsChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFs = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(()=>{});
    } else {
      document.exitFullscreen();
    }
  };

  const onMouseMove = (e) => setCursor({x: e.clientX, y: e.clientY});

  const SlideComponent = SLIDES[current];

  return (
    <>
      <style>{style}</style>
      <div className="presentation-root" onMouseMove={onMouseMove} onClick={() => setPaused(p => !p)}>
        {/* Custom Cursor */}
        <div className="cursor-ring" style={{left: cursor.x, top: cursor.y}} />
        <div className="cursor-dot" style={{left: cursor.x, top: cursor.y}} />

        {/* Backgrounds */}
        <div className="global-bg" />
        <div className="aurora">
          <div className="aurora-band" />
          <div className="aurora-band" />
          <div className="aurora-band" />
        </div>
        <canvas className="particles-canvas" ref={canvasRef} />

        {/* Slides */}
        <div className="slide-container">
          <div className={`slide active ${state}`}>
            <SlideComponent />
          </div>
        </div>

        {/* UI Chrome */}
        <div className="slide-counter">
          <span>{String(current+1).padStart(2,'0')}</span>
          <div className="counter-line" />
          <span>{String(SLIDES.length).padStart(2,'0')}</span>
        </div>

        <button className="fs-btn" onClick={(e)=>{e.stopPropagation(); toggleFs();}}>
          {isFs ? '⊠' : '⛶'}
        </button>

        <div className="progress-bar" style={{width: `${progress}%`}} />

        <div className="slide-dots">
          {SLIDES.map((_,i) => (
            <div
              key={i}
              className={`slide-dot${i===current?' active':''}`}
              onClick={(e)=>{e.stopPropagation(); elapsedRef.current=0; goToSlide(i);}}
            />
          ))}
        </div>

        <div className={`pause-indicator${paused?' visible':''}`}>
          ПАУЗА · CLICK TO RESUME
        </div>
      </div>
    </>
  );
}