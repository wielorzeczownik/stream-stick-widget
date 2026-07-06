export type Skin = 'wood' | 'minecraft' | 'minecraft_pickaxe' | 'custom';

export type CensorStyle = 'none' | 'pixel';

export type Config = {
  commandName: string;
  enableCommand: boolean;
  enableReward: boolean;
  rewardName: string;
  soundUrl: string;
  soundVolume: number;
  pullDuration: number;
  holdDuration: number;
  stickLength: number;
  stickColor: string;
  stickAngle: number;
  stickSkin: Skin;
  customSkinUrl: string;
  censorStyle: CensorStyle;
};
