import React, { useEffect, useRef, useState } from 'react';
import heroVideoUrl from '../assets/jung-ls-touch-3-23.mp4';
import { pageUrl } from '../site';

// JUNG LS TOUCH (EMsypeEXmUY), 00:03–00:23, with the audio track removed.
export const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(
    () => false,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      return;
    }

    const syncPlayback = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.muted = true;
        void video.play().catch(() => {
          // Leave the video without controls if the browser blocks autoplay.
        });
      }
    };

    document.addEventListener('visibilitychange', syncPlayback);
    syncPlayback();
    return () => {
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [reduceMotion]);

  return (
    <div className="hero-video">
      <video
        ref={videoRef}
        className="hero-video__media"
        src={heroVideoUrl}
        autoPlay={!reduceMotion}
        loop
        muted
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="hero-video__copy">
        <p className="hero-video__title font-display">Twój dom</p>
        <p className="hero-video__qualities">
          <span>Prosty w obsłudze</span>
          <span>Inteligentny</span>
          <span>Niezawodny</span>
        </p>
      </div>
      <img className="hero-video__brand" src={`${pageUrl('home')}assets/brand/jung-logo.svg`} alt="" width={96} height={24} />
    </div>
  );
};
