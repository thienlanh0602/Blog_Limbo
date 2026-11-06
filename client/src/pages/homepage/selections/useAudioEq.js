import { useRef, useCallback } from "react";

// 6 băng tần giống bộ chỉnh âm của Spotify: 60Hz, 150Hz, 400Hz, 1kHz, 2.4kHz, 15kHz
const BANDS = [
  { freq: 60, type: "lowshelf" },
  { freq: 150, type: "peaking" },
  { freq: 400, type: "peaking" },
  { freq: 1000, type: "peaking" },
  { freq: 2400, type: "peaking" },
  { freq: 15000, type: "highshelf" },
];

// 2 băng đầu (60Hz, 150Hz) đi đường bass, 4 băng còn lại đi đường giọng/treble
const LOW_BAND_COUNT = 2;
const CROSSOVER_HZ = 200;

export const EQ_PRESETS = {
  flat: [0, 0, 0, 0, 0, 0],
  bassBooster: [6, 5, 3, 0, 0, 0],
  trebleBooster: [0, 0, 0, 1, 4, 6],
  vocal: [-2, -1, 2, 4, 3, 0],
  pop: [-1, 2, 4, 3, 1, -1],
  rock: [4, 3, -1, -1, 3, 4],
  acoustic: [4, 3, 2, 1, 2, 3],

  spotifyBass: [12, 12, 2, -1, -2, -3.5],
};

export function useAudioEQ(audioRef) {
  const ctxRef = useRef(null);
  const filtersRef = useRef([]);
  const gainRef = useRef(null);

  const init = useCallback(() => {
    if (ctxRef.current || !audioRef.current) return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const source = ctx.createMediaElementSource(audioRef.current);

    // Chừa headroom trước EQ để bass tăng mạnh không bị vỡ tiếng
    // (thay cho việc nén cả bài như trước)
    const preGain = ctx.createGain();
    preGain.gain.value = 0.7;

    // 6 filter EQ (giữ nguyên thứ tự để setPreset hoạt động như cũ)
    const filters = BANDS.map(({ freq, type }) => {
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = type === "peaking" ? 1 : 0.7;
      f.gain.value = 0;
      return f;
    });
    const lowFilters = filters.slice(0, LOW_BAND_COUNT);
    const highFilters = filters.slice(LOW_BAND_COUNT);

    // Bộ chia tần Linkwitz-Riley 4th order (2 filter Butterworth nối tiếp)
    const makeXover = (type) => {
      const a = ctx.createBiquadFilter();
      const b = ctx.createBiquadFilter();
      [a, b].forEach((f) => {
        f.type = type;
        f.frequency.value = CROSSOVER_HZ;
        f.Q.value = 0.7071;
      });
      a.connect(b);
      return { input: a, output: b };
    };
    const lowX = makeXover("lowpass");
    const highX = makeXover("highpass");

    // Compressor CHỈ cho đường bass
    const bassComp = ctx.createDynamicsCompressor();
    bassComp.threshold.value = -20;
    bassComp.knee.value = 10;
    bassComp.ratio.value = 4;
    bassComp.attack.value = 0.01;
    bassComp.release.value = 0.15;

    // Limiter an toàn ở đầu ra: chỉ cắt đỉnh quá lớn, gần như không ảnh hưởng giọng
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -2;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.1;

    // Âm lượng (iPhone không dùng được audio.volume nên dùng GainNode)
    const gain = ctx.createGain();
    gain.gain.value = 1;

    // source -> preGain -> chia 2 đường
    source.connect(preGain);

    // Đường bass: lowpass -> EQ 60Hz -> EQ 150Hz -> compressor -> limiter
    preGain.connect(lowX.input);
    let node = lowX.output;
    lowFilters.forEach((f) => {
      node.connect(f);
      node = f;
    });
    node.connect(bassComp);
    bassComp.connect(limiter);

    // Đường giọng/treble: highpass -> EQ 400/1k/2.4k/15k -> limiter (không nén)
    preGain.connect(highX.input);
    node = highX.output;
    highFilters.forEach((f) => {
      node.connect(f);
      node = f;
    });
    node.connect(limiter);

    limiter.connect(gain);
    gain.connect(ctx.destination);

    ctxRef.current = ctx;
    filtersRef.current = filters;
    gainRef.current = gain;
  }, [audioRef]);

  // PHẢI gọi trong sự kiện bấm của người dùng (iOS Safari bắt buộc)
  const resume = useCallback(async () => {
    init();
    const ctx = ctxRef.current;
    if (ctx && ctx.state === "suspended") await ctx.resume();
  }, [init]);

  const setPreset = useCallback((name) => {
    const ctx = ctxRef.current;
    const gains = EQ_PRESETS[name] || EQ_PRESETS.flat;
    if (!ctx) return;
    filtersRef.current.forEach((f, i) => {
      f.gain.setTargetAtTime(gains[i], ctx.currentTime, 0.05);
    });
  }, []);

  const setVolume = useCallback((v) => {
    if (gainRef.current) gainRef.current.gain.value = v; // 0 -> 1
  }, []);

  return { resume, setPreset, setVolume };
}