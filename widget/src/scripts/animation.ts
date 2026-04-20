export const easeOut3 = (progress: number) => 1 - Math.pow(1 - progress, 3);
export const easeIn3 = (progress: number) => progress * progress * progress;
export const easeInOut3 = (progress: number) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
export const linear = (progress: number) => progress;

export function tween(
  from: number,
  end: number,
  duration: number,
  ease: (progress: number) => number,
  onUpdate: (value: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const progress = Math.min(
        (performance.now() - start) / (duration * 1000), // duration in seconds, perf.now in ms
        1
      );
      onUpdate(from + (end - from) * ease(progress));
      if (progress < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

export function tweenFrames(
  keyframes: number[],
  duration: number,
  ease: (progress: number) => number,
  onUpdate: (value: number) => void
): Promise<void> {
  const segDur = duration / (keyframes.length - 1);
  let chain = Promise.resolve();
  for (let index = 0; index < keyframes.length - 1; index++) {
    const from = keyframes[index];
    const next = keyframes[index + 1];
    chain = chain.then(() => tween(from, next, segDur, ease, onUpdate));
  }
  return chain;
}

export const wait = (seconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
