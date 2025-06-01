import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/*
Textures
*/

const textureLoader = new THREE.TextureLoader();

//door textures
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
//the textures used as color maps need to be encoded with sRGB
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorMetalTexture = textureLoader.load("./textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorRoughTexture = textureLoader.load("./textures/door/roughness.jpg");

//matcaps. These need to be encoded in sRGB because they are matcaps
const matcapOne = textureLoader.load("./textures/matcaps/1.png");
matcapOne.colorSpace = THREE.SRGBColorSpace;

//gradients
const gradientThree = textureLoader.load("./gradients/3.jpg");

/*
Materials
*/

//Basic Mesh Material
const material = new THREE.MeshBasicMaterial();
material.map = doorColorTexture;
//material.color = new THREE.Color("red");
//material.wireframe = true;
material.transparent = true;
//material.opacity = .2;
material.alphaMap = doorAlphaTexture;
material.side = THREE.DoubleSide;

//Basic Materials
const materialWhite = new THREE.MeshBasicMaterial();
materialWhite.color = new THREE.Color("white");

//Normal Materials
const normalMaterial = new THREE.MeshNormalMaterial();
normalMaterial.flatShading = true;

//Mesh Matcap Material

const materialMatCap = new THREE.MeshMatcapMaterial();
materialMatCap.matcap = matcapOne;

//Mesh Depth Materials

/*
OBJECTS
*/

//sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  normalMaterial
);
sphere.position.set(-2, 0, 0);

const sphereMetcap = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  materialMatCap
);
sphereMetcap.position.setY(1);

//torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  materialWhite
);
torus.position.set(2, 0, 0);

//plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
console.log(plane);

//cone
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 0.7, 32),
  normalMaterial
);
cone.position.setY(-1);

//Torus Knot
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(10, 3, 100, 16),
  materialMatCap
);

/* 
Scene
 */
const scene = new THREE.Scene();
scene.add(torus, plane, sphere, sphereMetcap, cone, knot);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  sphereMetcap.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;
  cone.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  sphereMetcap.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;
  cone.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
