// src/components/PriceRange.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Professional PriceRange Component
 * - Clean dual-slider with custom thumbs
 * - Continuous values (no stepping)
 * - Text inputs commit on blur/Enter
 * - Proper synchronization between sliders and inputs
 * - Premium design with smooth interactions
 * - Fully responsive (no overflow on small screens)
 */
const PriceRange = ({ 
  min = 0, 
  max = 1000000, 
  step = 1, 
  value = [0, 1000000], 
  onChange 
}) => {
  const [minValue, maxValue] = value;
  const trackRef = useRef(null);

  // Local editable strings for text inputs
  const [minText, setMinText] = useState(String(minValue));
  const [maxText, setMaxText] = useState(String(maxValue));

  // Track which input is being edited
  const editingRef = useRef({ min: false, max: false });

  // Dragging state
  const draggingRef = useRef({ active: null, pointerId: null });
  const [, forceUpdate] = useState(0);

  // Sync local text when external values change (unless editing)
  useEffect(() => {
    if (!editingRef.current.min) {
      setMinText(String(Math.round(minValue)));
    }
    if (!editingRef.current.max) {
      setMaxText(String(Math.round(maxValue)));
    }
  }, [minValue, maxValue]);

  // Utilities
  const clamp = (v) => Math.min(Math.max(v, min), max);

  const parseNumber = (str) => {
    const cleaned = String(str).replace(/[^\d]/g, "");
    if (cleaned === "") return NaN;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  };

  // Coercion to prevent crossing (no rounding, continuous values)
  const coerceMin = (raw) => {
    const num = clamp(Number(raw));
    return Math.min(num, maxValue - 1);
  };

  const coerceMax = (raw) => {
    const num = clamp(Number(raw));
    return Math.max(num, minValue + 1);
  };

  // Convert mouse position to value
  const clientXToValue = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return min;
    const rel = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const pct = rel / rect.width;
    return min + pct * (max - min);
  };

  // Dragging logic
  useEffect(() => {
    const onPointerMove = (ev) => {
      if (draggingRef.current.pointerId !== ev.pointerId) return;
      const active = draggingRef.current.active;
      if (!active) return;

      const rawValue = clientXToValue(ev.clientX);
      
      if (active === "min") {
        const newMin = Math.min(rawValue, maxValue - 1);
        onChange?.([Math.round(Math.max(newMin, min)), maxValue]);
      } else {
        const newMax = Math.max(rawValue, minValue + 1);
        onChange?.([minValue, Math.round(Math.min(newMax, max))]);
      }
      forceUpdate(t => t + 1);
    };

    const onPointerUp = (ev) => {
      if (draggingRef.current.pointerId !== ev.pointerId) return;
      draggingRef.current = { active: null, pointerId: null };
      forceUpdate(t => t + 1);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [minValue, maxValue, min, max, onChange]);

  // Start dragging
  const onThumbPointerDown = (ev, which) => {
    ev.preventDefault();
    ev.stopPropagation();
    try {
      ev.target.setPointerCapture(ev.pointerId);
    } catch {}
    draggingRef.current = { active: which, pointerId: ev.pointerId };
    forceUpdate(t => t + 1);
  };

  // Input handlers
  const commitMinFromText = () => {
    editingRef.current.min = false;
    const parsed = parseNumber(minText);
    if (Number.isNaN(parsed)) {
      setMinText(String(Math.round(minValue)));
      return;
    }
    const final = coerceMin(parsed);
    onChange?.([Math.round(final), maxValue]);
  };

  const commitMaxFromText = () => {
    editingRef.current.max = false;
    const parsed = parseNumber(maxText);
    if (Number.isNaN(parsed)) {
      setMaxText(String(Math.round(maxValue)));
      return;
    }
    const final = coerceMax(parsed);
    onChange?.([minValue, Math.round(final)]);
  };

  const onMinKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      editingRef.current.min = false;
      setMinText(String(Math.round(minValue)));
      e.currentTarget.blur();
    }
  };

  const onMaxKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      editingRef.current.max = false;
      setMaxText(String(Math.round(maxValue)));
      e.currentTarget.blur();
    }
  };

  // Visual calculations
  const total = Math.max(max - min, 1);
  const leftPct = ((minValue - min) / total) * 100;
  const rightPct = ((maxValue - min) / total) * 100;

  return (
    <div className="w-full">
      {/* Slider Track */}
      <div 
        ref={trackRef} 
        className="relative w-full h-7 mb-3" 
        style={{ userSelect: "none" }}
      >
        {/* Base track */}
        <div className="absolute left-0 right-0 top-2.5 h-1.5 rounded-full bg-slate-200 dark:bg-gray-700" />

        {/* Active range */}
        <div
          className="absolute top-2.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
          style={{
            left: `${leftPct}%`,
            width: `${Math.max(rightPct - leftPct, 0)}%`,
          }}
        />

        {/* Min Thumb */}
        <button
          type="button"
          onPointerDown={(e) => onThumbPointerDown(e, "min")}
          className="absolute top-0 w-5 h-5 rounded-full bg-white dark:bg-gray-800 shadow-md border-2 border-purple-500 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400"
          style={{ 
            left: `calc(${leftPct}% - 10px)`, 
            zIndex: draggingRef.current.active === "min" ? 50 : 40,
            touchAction: "none"
          }}
          aria-label="Minimum price slider"
        />

        {/* Max Thumb */}
        <button
          type="button"
          onPointerDown={(e) => onThumbPointerDown(e, "max")}
          className="absolute top-0 w-5 h-5 rounded-full bg-white dark:bg-gray-800 shadow-md border-2 border-purple-500 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400"
          style={{ 
            left: `calc(${rightPct}% - 10px)`, 
            zIndex: draggingRef.current.active === "max" ? 50 : 40,
            touchAction: "none"
          }}
          aria-label="Maximum price slider"
        />
      </div>

      {/* Input Fields - Responsive with min-w-0 to prevent overflow */}
      <div className="flex gap-2 items-center w-full">
        <input
          type="text"
          inputMode="numeric"
          value={minText}
          onChange={(e) => setMinText(e.target.value)}
          onFocus={() => { editingRef.current.min = true; }}
          onBlur={commitMinFromText}
          onKeyDown={onMinKeyDown}
          placeholder="Min"
          className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
          aria-label="Minimum price input"
        />
        
        <span className="text-slate-400 dark:text-gray-500 text-xs flex-shrink-0">—</span>
        
        <input
          type="text"
          inputMode="numeric"
          value={maxText}
          onChange={(e) => setMaxText(e.target.value)}
          onFocus={() => { editingRef.current.max = true; }}
          onBlur={commitMaxFromText}
          onKeyDown={onMaxKeyDown}
          placeholder="Max"
          className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all"
          aria-label="Maximum price input"
        />
      </div>
    </div>
  );
};

export default PriceRange;
