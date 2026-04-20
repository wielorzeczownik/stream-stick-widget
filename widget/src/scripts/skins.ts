import pickaxeMinecraftUrl from '@assets/textures/minecraft_pickaxe.png?inline';
import stickMinecraftUrl from '@assets/textures/minecraft_stick.png?inline';
import * as THREE from 'three';

import { DEPTH_TILT, SPRITE_MAX_RES } from '@/constants';
import type { Skin, SkinResult } from '@/types';

export function disposeSkinObjects(objects: THREE.Object3D[]): void {
  for (const object of objects) {
    if (object instanceof THREE.Group) {
      disposeSkinObjects([...object.children]);
    } else {
      const mesh = object as THREE.Mesh;
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        for (const mat of mesh.material) {
          (mat as THREE.MeshStandardMaterial).map?.dispose();
          mat.dispose();
        }
      } else {
        (mesh.material as THREE.MeshStandardMaterial).map?.dispose();
        mesh.material.dispose();
      }
    }
  }
}

export function buildVoxelSprite(
  url: string,
  stickLength: number,
  onLoaded: (contentHeight: number, angle: number) => void
): THREE.Group {
  const group = new THREE.Group();
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.addEventListener('load', () => {
    try {
      const scale = Math.min(
        1,
        SPRITE_MAX_RES / Math.max(img.width, img.height)
      );
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);
      const pixelSize = stickLength / Math.max(width, height);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(img, 0, 0, width, height);
      const { data } = context.getImageData(0, 0, width, height);

      type Pixel = {
        pixelX: number;
        pixelY: number;
        red: number;
        green: number;
        blue: number;
      };
      const pixels: Pixel[] = [];
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const index = (row * width + col) * 4;
          if (data[index + 3] > 10) {
            pixels.push({
              pixelX: col,
              pixelY: row,
              red: data[index] / 255,
              green: data[index + 1] / 255,
              blue: data[index + 2] / 255,
            });
          }
        }
      }
      if (pixels.length === 0) return;

      // eliminating gaps between voxels regardless of sprite orientation.
      const boxSize = pixelSize * 1.5;
      const geo = new THREE.BoxGeometry(boxSize, boxSize, pixelSize * 0.5);
      const mat = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        metalness: 0,
      });
      const mesh = new THREE.InstancedMesh(geo, mat, pixels.length);

      const maxRow = Math.max(...pixels.map((pix) => pix.pixelY));
      const minRow = Math.min(...pixels.map((pix) => pix.pixelY));

      // center-of-mass of a pixel row; comparing base vs tip reveals the sprite's
      const rowCenterX = (targetRow: number) => {
        const row = pixels.filter((pix) => pix.pixelY === targetRow);
        return row.reduce((sum, pix) => sum + pix.pixelX + 0.5, 0) / row.length;
      };
      const baseCenterX = rowCenterX(maxRow);
      const tipCenterX = rowCenterX(minRow);

      const axisDx = tipCenterX - baseCenterX;
      const axisDy = maxRow - minRow;
      const contentHeight = Math.hypot(axisDx, axisDy) * pixelSize;
      const detectedAngle = Math.atan2(axisDx, axisDy); // args swapped from Y axis since sticks point up, not right

      const zStep = pixelSize * 0.02;
      const matrix = new THREE.Matrix4();
      const color = new THREE.Color();
      for (const [
        pixIndex,
        { pixelX, pixelY, red, green, blue },
      ] of pixels.entries()) {
        const localX = (pixelX + 0.5 - baseCenterX) * pixelSize;
        const localY = (maxRow - pixelY + 0.5) * pixelSize;
        matrix.setPosition(localX, localY, pixIndex * zStep);
        mesh.setMatrixAt(pixIndex, matrix);
        color.setRGB(red, green, blue);
        mesh.setColorAt(pixIndex, color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      group.add(mesh);
      onLoaded(contentHeight, detectedAngle);
    } catch {
      // CORS or decode failure
    }
  });
  img.src = url;
  return group;
}

export function buildSkin(
  skin: Skin,
  stickLength: number,
  stickColor: string,
  customSkinUrl: string,
  onLoaded: (contentHeight: number, angle?: number) => void
): SkinResult {
  const spriteUrls: Record<string, string | undefined> = {
    minecraft: stickMinecraftUrl,
    minecraft_pickaxe: pickaxeMinecraftUrl,
    custom: customSkinUrl || undefined,
  };
  const spriteUrl = spriteUrls[skin];

  if (spriteUrl !== undefined) {
    const group = buildVoxelSprite(
      spriteUrl,
      stickLength,
      (skinHeight: number, angle: number) => onLoaded(skinHeight, angle)
    );
    return { objects: [group], depthTilt: DEPTH_TILT };
  }

  // wood (default)
  const bodyGeo = new THREE.CylinderGeometry(9, 13, stickLength, 28, 1);
  bodyGeo.translate(0, stickLength / 2, 0);

  const capGeo = new THREE.SphereGeometry(
    9,
    20,
    14,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  capGeo.translate(0, stickLength, 0);

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(stickColor),
    roughness: 0.82,
    metalness: 0.04,
  });
  return {
    objects: [new THREE.Mesh(bodyGeo, mat), new THREE.Mesh(capGeo, mat)],
    depthTilt: DEPTH_TILT,
  };
}
