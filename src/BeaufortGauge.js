import React from 'react';

/**
 * BeaufortGauge — SVG arc gauge showing wind speed on the Beaufort scale (0–12).
 * Props: mph (wind speed in mph), size (SVG width in px, default 100)
 * Also exports toBeaufort(mph) for use elsewhere (e.g. card labels).
 */

// Beaufort scale table: each entry defines the upper mph threshold and the arc segment colour
const BEAUFORT = [
    { max: 1,   label: "Calm",        color: "#baf8ff" },
    { max: 5,   label: "Light air",   color: "#ccffba" },
    { max: 11,  label: "Light breeze",color: "#d4f5a0" },
    { max: 19,  label: "Gentle",      color: "#e8f59e" },
    { max: 28,  label: "Moderate",    color: "#fff5b0" },
    { max: 38,  label: "Fresh",       color: "#ffe49a" },
    { max: 49,  label: "Strong",      color: "#ffce7a" },
    { max: 61,  label: "Near gale",   color: "#ffb060" },
    { max: 74,  label: "Gale",        color: "#ff8c50" },
    { max: 88,  label: "Severe gale", color: "#ff6040" },
    { max: 102, label: "Storm",       color: "#ff3020" },
    { max: 117, label: "Violent",     color: "#cc1010" },
    { max: Infinity, label: "Hurricane", color: "#800000" },
];

// Converts a wind speed in mph to a Beaufort scale integer (0–12)
export const toBeaufort = (mph) => {
    for (let i = 0; i < BEAUFORT.length; i++) {
        if (mph < BEAUFORT[i].max) return i;
    }
    return 12;
};

// Converts a polar angle (degrees clockwise from 12 o'clock) to SVG x/y coordinates
const polarToXY = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

// Builds an SVG arc path string between two angles around centre (cx, cy) at radius r
const arc = (cx, cy, r, startDeg, endDeg) => {
    const s = polarToXY(cx, cy, r, startDeg);
    const e = polarToXY(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

const BeaufortGauge = ({ mph, size = 100 }) => {
    // Arc centre is pushed down so the open gap of the gauge faces the bottom
    const cx = size / 2;
    const cy = size * 0.62;
    const r  = size * 0.40;
    // Gauge spans -140° to +140° (280° total), leaving an 80° gap at the bottom
    const startDeg  = -140;
    const endDeg    =  140;
    const totalSpan =  280;
    const maxMph    =  120; // full-scale value — needle reaches endDeg at this speed
    const bft  = toBeaufort(mph);

    const segSpan  = totalSpan / 13; // each of the 13 Beaufort colour bands gets equal arc
    const sw       = r * 0.24;       // stroke width proportional to gauge radius
    // Angle where the needle sits — maps mph linearly across the arc span
    const fillAngle = startDeg + (Math.min(mph, maxMph) / maxMph) * totalSpan;

    // SVG height scaled so the arc bottom (y≈79.7 at size=86) fits with some breathing room
    const svgH = Math.round(size * 100 / 86);
    return (
        <svg width={size} height={svgH} viewBox={`0 0 ${size} ${svgH}`} style={{overflow:'hidden'}}>
            {/* grey track */}
            <path d={arc(cx, cy, r, startDeg, endDeg)} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={sw} strokeLinecap="butt"/>
            {/* coloured segments */}
            {BEAUFORT.map((seg, i) => {
                const s = startDeg + i * segSpan;
                const e = s + segSpan - 0.8;
                return <path key={i} d={arc(cx, cy, r, s, e)} fill="none" stroke={seg.color} strokeWidth={sw} strokeLinecap="butt"/>;
            })}
            {/* Dim overlay covers the arc from the needle to the end — makes unset portion recede */}
            {fillAngle < endDeg && (
                <path d={arc(cx, cy, r, fillAngle, endDeg)} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={sw + 0.5}/>
            )}
            {/* Needle: line from a short counter-base to the tip, with a hub circle at centre */}
            {(() => {
                const nr = (fillAngle - 90) * (Math.PI / 180);
                const nx = cx + r * 0.72 * Math.cos(nr); // tip point
                const ny = cy + r * 0.72 * Math.sin(nr);
                const bx = cx - r * 0.18 * Math.cos(nr); // short tail past centre
                const by = cy - r * 0.18 * Math.sin(nr);
                return (
                    <>
                        <line x1={bx} y1={by} x2={nx} y2={ny}
                            stroke="rgba(15,15,15,0.88)" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx={cx} cy={cy} r={r * 0.13}
                            fill="white" stroke="rgba(15,15,15,0.55)" strokeWidth="1.5"/>
                    </>
                );
            })()}
        </svg>
    );
};

export default BeaufortGauge;

