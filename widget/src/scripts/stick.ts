import Tixyel from '@tixyel/streamelements';
import * as THREE from 'three';

import {
  easeIn3,
  easeInOut3,
  easeOut3,
  linear,
  tween,
  tweenFrames,
  wait,
} from '@/animation';
import {
  CLEANUP_DELAY,
  FADE_IN,
  FADE_OUT,
  POP_DURATION,
  PULL_RATIO,
  WOBBLE_DURATION,
} from '@/constants';
import { buildSkin, disposeSkinObjects } from '@/skins';
import { randomSoundUrl } from '@/sounds';
import type { CensorStyle, Config, Skin } from '@/types';

type QueueItem = Record<string, never>;

const PIXEL_BLOCK = 16;

export class Stick {
  private readonly canvas: HTMLCanvasElement | null;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene3d: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private readonly pivot: THREE.Group;
  private readonly stickGroup: THREE.Group;
  private baseAngleZ: number;
  private spriteAngleZ: number = 0;

  private readonly pixelTarget: THREE.WebGLRenderTarget;
  private readonly pixelScene: THREE.Scene;
  private readonly pixelCamera: THREE.OrthographicCamera;

  private rafId: number | undefined = undefined;
  private contentHeight: number;

  private readonly queue: InstanceType<
    typeof Tixyel.modules.useQueue<QueueItem>
  >;

  constructor(private readonly config: Config) {
    this.canvas = document.getElementById('scene') as HTMLCanvasElement | null;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas ?? undefined,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x00_00_00, 0);

    // render at 1/16 resolution, NearestFilter upscales blocky that's the pixel censor
    const pixelW = Math.ceil(width / PIXEL_BLOCK);
    const pixelH = Math.ceil(height / PIXEL_BLOCK);
    this.pixelTarget = new THREE.WebGLRenderTarget(pixelW, pixelH);
    this.pixelTarget.texture.magFilter = THREE.NearestFilter;
    this.pixelTarget.texture.minFilter = THREE.NearestFilter;
    this.pixelCamera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0,
      2
    );
    this.pixelCamera.position.z = 1;
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: this.pixelTarget.texture,
        transparent: true,
      })
    );
    this.pixelScene = new THREE.Scene();
    this.pixelScene.add(quad);

    this.scene3d = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      1,
      10_000
    );
    this.camera.position.z = 1000;

    const ambient = new THREE.AmbientLight(0xff_ff_ff, 0.45);
    const sun = new THREE.DirectionalLight(0xff_ff_ff, 1.6);
    sun.position.set(-2, 3, 4);
    const fill = new THREE.DirectionalLight(0xff_ff_ff, 0.35);
    fill.position.set(3, 1, 2);
    const rim = new THREE.DirectionalLight(0x88_44_22, 0.25);
    rim.position.set(0, -2, -3);
    this.scene3d.add(ambient, sun, fill, rim);

    const { stickLength, stickColor } = config;
    this.contentHeight = stickLength;
    const skin = buildSkin(
      config.stickSkin,
      stickLength,
      stickColor,
      config.customSkinUrl,
      (skinHeight: number, angle?: number) => {
        this.contentHeight = skinHeight;
        this.spriteAngleZ = angle ?? 0;
        // stickGroup carries the sprite's baked-in tilt, pivot subtracts it back
        // so the total visual lean always equals baseAngleZ
        this.stickGroup.rotation.z = this.spriteAngleZ;
        this.pivot.rotation.z = this.baseAngleZ - this.spriteAngleZ;
        this.doRender();
      }
    );

    // stickGroup slides along local Y
    this.stickGroup = new THREE.Group();
    for (const object of skin.objects) this.stickGroup.add(object);
    this.stickGroup.position.y = -stickLength;

    // pivot anchors the base of the stick at the bottom of the screen
    this.pivot = new THREE.Group();
    this.pivot.add(this.stickGroup);
    this.pivot.position.y = -height / 2;
    this.scene3d.add(this.pivot);

    this.baseAngleZ = (config.stickAngle * Math.PI) / 180;
    this.pivot.rotation.order = 'ZXY'; // keeps depth tilt (X) independent of lean (Z)
    this.pivot.rotation.z = this.baseAngleZ;
    this.pivot.rotation.x = skin.depthTilt;

    this.queue = new Tixyel.modules.useQueue<QueueItem>({
      processor: async () => await this.play(),
    });
  }

  private doRender(): void {
    if (this.config.censorStyle === 'pixel') {
      this.renderer.setRenderTarget(this.pixelTarget);
      this.renderer.clear();
      this.renderer.render(this.scene3d, this.camera);
      // eslint-disable-next-line unicorn/no-null
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.pixelScene, this.pixelCamera);
    } else {
      this.renderer.render(this.scene3d, this.camera);
    }
  }

  private startRender(): void {
    const tick = () => {
      this.doRender();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopRender(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
    this.doRender();
  }

  private playSound(): void {
    const { soundUrl, soundVolume } = this.config;
    const url = soundUrl || randomSoundUrl();
    const audio = new Audio(url);
    audio.volume = soundVolume / 100;
    audio.play().catch((error: unknown) => {
      Tixyel.logger.warn(`[Kij] Sound failed: ${String(error)}`);
    });
  }

  private setOpacity(value: number): void {
    if (this.canvas) {
      this.canvas.style.opacity = String(value);
    }
  }

  private async play(): Promise<void> {
    const { pullDuration } = this.config;
    const skinHeight = this.contentHeight;
    const setY = (value: number) => {
      this.stickGroup.position.y = value;
    };

    this.stickGroup.position.y = -skinHeight;
    this.stickGroup.scale.set(1, 1, 1);
    this.stickGroup.rotation.z = this.spriteAngleZ;
    this.pivot.rotation.z = this.baseAngleZ - this.spriteAngleZ;
    this.startRender();

    await tween(0, 1, FADE_IN, easeOut3, (value) => this.setOpacity(value));

    // Pull
    await tween(-skinHeight, -18, pullDuration * PULL_RATIO, easeInOut3, setY);

    // Fast snap out with sound
    this.playSound();
    // -18 = just below surface, 22 = overshoot, -8 = undershoot, 0 = settled
    await tweenFrames([-18, 22, -8, 0], POP_DURATION * 0.6, easeOut3, setY);

    // Wobble
    await tweenFrames(
      [-4, 4, -2.5, 2.5, -1, 1, 0].map(
        (deg) => this.baseAngleZ - this.spriteAngleZ + (deg * Math.PI) / 180
      ),
      WOBBLE_DURATION,
      linear,
      (value) => (this.pivot.rotation.z = value)
    );

    await wait(this.config.holdDuration);

    await tween(1, 0, FADE_OUT, easeIn3, (value) => this.setOpacity(value));

    await wait(CLEANUP_DELAY);
    this.stickGroup.position.y = -skinHeight;
    this.stickGroup.scale.set(1, 1, 1);
    this.stickGroup.rotation.z = this.spriteAngleZ;
    this.pivot.rotation.z = this.baseAngleZ - this.spriteAngleZ;
    this.stopRender();
  }

  setSkin(skin: Skin): void {
    disposeSkinObjects([...this.stickGroup.children]);
    this.stickGroup.clear();
    this.spriteAngleZ = 0;
    this.stickGroup.rotation.z = 0;
    this.pivot.rotation.z = this.baseAngleZ;

    this.contentHeight = this.config.stickLength;
    const newSkin = buildSkin(
      skin,
      this.config.stickLength,
      this.config.stickColor,
      this.config.customSkinUrl,
      (skinHeight: number, angle?: number) => {
        this.contentHeight = skinHeight;
        this.spriteAngleZ = angle ?? 0;
        this.stickGroup.rotation.z = this.spriteAngleZ;
        this.pivot.rotation.z = this.baseAngleZ - this.spriteAngleZ;
        this.doRender();
      }
    );
    for (const object of newSkin.objects) this.stickGroup.add(object);
    this.pivot.rotation.x = newSkin.depthTilt;

    this.doRender();
  }

  setAngle(degrees: number): void {
    this.baseAngleZ = (degrees * Math.PI) / 180;
    this.pivot.rotation.z = this.baseAngleZ - this.spriteAngleZ;
    this.doRender();
  }

  setCustomSkinUrl(url: string): void {
    this.config.customSkinUrl = url;
  }

  setHoldDuration(seconds: number): void {
    this.config.holdDuration = seconds;
  }

  setCensorStyle(style: CensorStyle): void {
    this.config.censorStyle = style;
    this.setSkin(this.config.stickSkin);
  }

  trigger(): void {
    this.queue.enqueue({} as QueueItem);
  }
}

let instance: Stick;

export function init(config: Config): void {
  instance = new Stick(config);
}

export function trigger(): void {
  instance.trigger();
}

export function setSkin(skin: Skin): void {
  instance.setSkin(skin);
}

export function setAngle(degrees: number): void {
  instance.setAngle(degrees);
}

export function setCustomSkinUrl(url: string): void {
  instance.setCustomSkinUrl(url);
}

export function setHoldDuration(seconds: number): void {
  instance.setHoldDuration(seconds);
}

export function setCensorStyle(style: CensorStyle): void {
  instance.setCensorStyle(style);
}
