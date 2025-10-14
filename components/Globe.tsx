"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

type Marker = {
  location: [number, number];
  size: number;
  label: string;
};

interface GlobeProps {
  markers?: Marker[];
}

export function Globe({ markers = [] }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = canvas.offsetWidth;
    let phi = 2.8;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.75);

    // 🔹 Dynamic scaling — larger values now to fill the circle fully
    const getScale = () => {
      if (window.innerWidth < 640) return 1.05; // mobile
      if (window.innerWidth < 1024) return 1.1; // tablet
      return 1.18; // desktop — full frame
    };

    const initGlobe = () => {
      canvas.width = width * pixelRatio;
      canvas.height = width * pixelRatio;

      return createGlobe(canvas, {
        devicePixelRatio: pixelRatio,
        width: canvas.width,
        height: canvas.height,
        phi,
        theta: 0.3,
        dark: 1,
        diffuse: 1.25,
        scale: getScale(),
        mapBrightness: 1.85,
        mapSamples: 16000,
        baseColor: [22 / 255, 35 / 255, 56 / 255],
        markerColor: [0.08, 0.8, 0.6],
        glowColor: [0.08, 0.8, 0.6],
        markers,
        onRender: (state) => {
          if (!isVisible) return;
          state.phi = phi;
          state.theta = 0.32;
          phi += 0.004;
        },
      });
    };

    let globe = initGlobe();

    const onResize = () => {
      width = canvas.offsetWidth;
      canvas.width = width * pixelRatio;
      canvas.height = width * pixelRatio;
      globe.destroy?.();
      globe = initGlobe();
    };

    window.addEventListener("resize", onResize);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    return () => {
      globe.destroy?.();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [markers]);

  return (
    <div
      className="
        relative w-full h-full 
        flex items-center justify-center 
        overflow-visible
      "
    >
      <canvas
        ref={canvasRef}
        className="
          w-full h-full 
          object-contain 
          translate-y-[1%]
          scale-[1.04] sm:scale-[1.06] lg:scale-[1.08]
        "
        style={{
          aspectRatio: "1 / 1",
          display: "block",
          background: "transparent", // 🧼 remove navy fill
        }}
      />
    </div>
  );
}
