"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useEffect, useRef } from "react";

type Marker = {
  location: [number, number]; // [lat, lon]
  size: number;
  label: string;
};

interface GlobeProps {
  markers?: Marker[];
}

export function Globe({ markers = [] }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let width = 0;
    let phi = 2.8; // Southern Africa front

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: 0, // dynamic
      height: 0,
      phi,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      scale: 1.1,
      mapBrightness: 1.9,
      mapSamples: 16000,
      baseColor: [22 / 255, 35 / 255, 56 / 255], // #162338
      markerColor: [0.08, 0.8, 0.6],
      glowColor: [0.08, 0.8, 0.6],
      markers,
      onRender: (state) => {
        state.phi = phi;
        state.width = width * 2;
        state.height = width * 2;
        phi += 0.006;
      },
    });

    function onResize() {
      if (!canvasRef.current) return;
      width = canvasRef.current.offsetWidth;
    }

    window.addEventListener("resize", onResize);
    onResize(); // ✅ fire immediately on first load

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [markers]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* ✅ never breaks responsiveness */}
      <canvas
        ref={canvasRef}
        className="w-full max-w-[800px] scale-110 sm:scale-105 md:scale-100"
        style={{ aspectRatio: "1 / 1" }}
      />
    </div>
  );
}
