import * as THREE from 'three';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@latest/dist/cannon-es.min.js';

export const cannonBoxMaterial = new CANNON.Material({ friction: 0.5, restitution: 0.7 });
