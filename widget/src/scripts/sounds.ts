import pop1Url from '@assets/sounds/pop1.mp3?inline';
import pop2Url from '@assets/sounds/pop2.mp3?inline';
import pop3Url from '@assets/sounds/pop3.mp3?inline';

const builtInSounds = [pop1Url, pop2Url, pop3Url];

export function randomSoundUrl(): string {
  // eslint-disable-next-line sonarjs/pseudo-random
  return builtInSounds[Math.floor(Math.random() * builtInSounds.length)];
}
