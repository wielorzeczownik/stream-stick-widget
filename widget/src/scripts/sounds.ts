import pop1Url from '@assets/sounds/pop1.mp3?inline';
import pop2Url from '@assets/sounds/pop2.mp3?inline';
import pop3Url from '@assets/sounds/pop3.mp3?inline';

const builtInSounds = [pop1Url, pop2Url, pop3Url];

export function randomSoundUrl(): string {
  const [rand] = crypto.getRandomValues(new Uint32Array(1));
  return builtInSounds[rand % builtInSounds.length];
}
