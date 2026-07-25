"use client";

import { useEffect, useRef, useState } from "react";
import type { Photo } from "./Gallery";

// Rải N điểm đều trên mặt cầu bằng thuật toán Fibonacci
function fibonacciSphere(n: number) {
  const points: { x: number; y: number; z: number }[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // góc vàng
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2; // từ 1 xuống -1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return points;
}

export default function PhotoGlobe({ photos }: { photos: Photo[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null); // ảnh đang phóng to (lightbox)
  const swipeX = useRef<number | null>(null); // vị trí bắt đầu vuốt trong lightbox

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const base = fibonacciSphere(photos.length);

    // Trạng thái xoay và vận tốc (dùng biến cục bộ để không re-render mỗi frame)
    let rotX = 0.3;
    let rotY = 0;
    let velX = 0;
    let velY = 0.0016; // tốc độ tự xoay mặc định
    const autoSpeed = 0.0016;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0; // tổng quãng di chuyển để phân biệt kéo và bấm
    let pressedIndex = -1; // ảnh được nhấn xuống

    let raf = 0;

    function render() {
      const stageEl = stageRef.current;
      if (!stageEl) return;
      const size = stageEl.clientWidth;
      const R = size * 0.34; // bán kính cầu
      const PERSP = R * 2.4; // độ sâu phối cảnh (> R)

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      for (let i = 0; i < base.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const p = base[i];

        // Xoay quanh trục Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        // Xoay quanh trục X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const persScale = PERSP / (PERSP - z2 * R);
        const tx = x1 * R * persScale;
        const ty = y2 * R * persScale;
        const opacity = 0.35 + ((z2 + 1) / 2) * 0.65;

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${persScale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round((z2 + 1) * 500));
      }

      // Cập nhật góc xoay
      rotY += velY;
      rotX += velX;
      // Giới hạn nghiêng trên/dưới để không bị lộn ngược
      const limit = Math.PI / 2 - 0.15;
      if (rotX > limit) {
        rotX = limit;
        velX = 0;
      }
      if (rotX < -limit) {
        rotX = -limit;
        velX = 0;
      }

      if (dragging) {
        velX *= 0.85;
        velY *= 0.85;
      } else {
        // Quán tính giảm dần rồi trở về tốc độ tự xoay
        velX *= 0.94;
        velY += (autoSpeed - velY) * 0.03;
      }

      raf = requestAnimationFrame(render);
    }

    function indexFromEvent(e: PointerEvent) {
      const item = (e.target as Element | null)?.closest(".globe-item");
      return item ? itemRefs.current.indexOf(item as HTMLDivElement) : -1;
    }

    function onDown(e: PointerEvent) {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      pressedIndex = indexFromEvent(e);
      stage!.setPointerCapture(e.pointerId);
    }
    function onMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      velY = dx * 0.005;
      velX = -dy * 0.005;
    }
    function onUp(e: PointerEvent) {
      dragging = false;
      try {
        stage!.releasePointerCapture(e.pointerId);
      } catch {
        /* bỏ qua */
      }
      // Bấm (không kéo) vào một ảnh → phóng to
      if (moved < 6 && pressedIndex >= 0) {
        setActive(pressedIndex);
      }
      pressedIndex = -1;
    }

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, [photos.length]);

  // Chuyển sang ảnh trước / sau (quay vòng)
  const total = photos.length;
  const go = (dir: number) =>
    setActive((a) => (a === null ? a : (a + dir + total) % total));

  // Phím tắt trong lightbox: Esc đóng, ←/→ chuyển ảnh
  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <>
      <div className="globe-stage" ref={stageRef} aria-label="Quả cầu ảnh xoay tròn">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="globe-item"
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.caption ?? `Ảnh ${i + 1}`} />
          </div>
        ))}
      </div>

      {active !== null && (
        <div className="lightbox" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <button className="lightbox__close" aria-label="Đóng" onClick={() => setActive(null)}>
            ✕
          </button>

          {total > 1 && (
            <button
              className="lightbox__nav lightbox__nav--prev"
              aria-label="Ảnh trước"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              ‹
            </button>
          )}

          <figure
            className="lightbox__figure"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              swipeX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (swipeX.current === null) return;
              const dx = e.clientX - swipeX.current;
              swipeX.current = null;
              if (dx > 45) go(-1);
              else if (dx < -45) go(1);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[active].src}
              alt={photos[active].caption ?? `Ảnh ${active + 1}`}
            />
            {photos[active].caption && (
              <figcaption className="lightbox__caption">
                {photos[active].caption}
              </figcaption>
            )}
          </figure>

          {total > 1 && (
            <button
              className="lightbox__nav lightbox__nav--next"
              aria-label="Ảnh sau"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
