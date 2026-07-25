"use client";

import { useEffect, useState } from "react";

export type Photo = {
  src: string;
  caption?: string;
};

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);

  // Đóng lightbox bằng phím Esc
  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className="gallery">
        {photos.map((photo, i) => (
          <figure
            key={i}
            className="photo"
            tabIndex={0}
            role="button"
            aria-label={photo.caption ?? `Ảnh ${i + 1}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActive(i);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.caption ?? `Ảnh ${i + 1}`} />
            {photo.caption && (
              <figcaption className="photo__caption">{photo.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      {active !== null && (
        <div
          className="lightbox"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="lightbox__close"
            aria-label="Đóng"
            onClick={() => setActive(null)}
          >
            ✕
          </button>
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
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
        </div>
      )}
    </>
  );
}
