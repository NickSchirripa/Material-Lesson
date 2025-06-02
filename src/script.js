import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from 'lil-gui'
import { RGBELoader } from "three/examples/jsm/Addons.js";

console.log({RGBELoader})


/**
 * DEBUG
 ** */
const gui = new GUI()

//main folders

const sphereStandardFolder = gui.addFolder('Standard Material Sphere')
const capsulseFolder = gui.addFolder('Capsule')
const boxPhongFolder = gui.addFolder('Box Phong')
const normalMaterialFolder = gui.addFolder('Normal Sphere')


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
const gradientThree = textureLoader.load("./textures/gradients/3.jpg");


//env map


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
const depthMaterial = new THREE.MeshDepthMaterial();

//mesh Lambert Material
const lambertMaterial = new THREE.MeshLambertMaterial();

//mesh Phong Material
const phongMaterial = new THREE.MeshPhongMaterial();
phongMaterial.shininess = 100
phongMaterial.specular = new THREE.Color(0x1188ff)
phongMaterial.roughness = .5
phongMaterial.metalness = 1



//mesh Toon Material
const toonMaterial = new THREE.MeshToonMaterial();
toonMaterial.gradientMap = gradientThree
//this makes it so the gradient texture is not blended by the gpu
gradientThree.magFilter = THREE.NearestFilter
gradientThree.generateMipmaps = false


//Mesh Standard Material
const standardMaterial = new THREE.MeshStandardMaterial();
standardMaterial.roughness = .5
standardMaterial.metalness = 1






/*
Debug Materials
*/

//Folders
const standardMaterialSphere = sphereStandardFolder.addFolder('Standard Material')
const phongMaterialAdjust = boxPhongFolder.addFolder('Phong Material')
const normalMaterialAdjust = normalMaterialFolder.addFolder('Normal Material')


function MetalRough(folder, material)
{
folder
.add(material, 'roughness')
.min(0)
.max(1)
.step(0.001)

folder
.add(material,'metalness')
.min(0) 
.max(1) 
.step(0.001)
}

function wireFrame(folder, material)
{
  folder
  .add(material, 'wireframe')
}

function materialDebugs()
{
  //metalness and roughness
  MetalRough(standardMaterialSphere, standardMaterial)
  MetalRough(phongMaterialAdjust, phongMaterial)
  

  //wireframes
  wireFrame(standardMaterialSphere,standardMaterial)
  wireFrame(phongMaterialAdjust, phongMaterial)
  wireFrame(normalMaterialAdjust, normalMaterial)

}

materialDebugs()

/*
OBJECTS
*/


//spheres
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

const sphereStandard = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16),
 standardMaterial)
 sphereStandard.position.y = -1;



//torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  materialWhite
);
torus.position.set(2, 0, 0);


//plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
plane.position.y = 5;
console.log(plane);


//cone
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 0.7, 32),
  normalMaterial
);
cone.position.setY(-3);


//Torus Knot
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(.2, 1, 100, 8),
  depthMaterial
);

knot.position.setY(3)


//Box 
const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),lambertMaterial);

box.position.y = -2
box.position.x = -3


const boxPhong = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),phongMaterial);


//capsule
const capsule = new THREE.Mesh(new THREE.CapsuleGeometry(.5,.5,4,8,20),toonMaterial);

capsule.position.y = -2
capsule.position.x = 2


/**
 * Debug Objects
 */

//Standard Material Sphere
const standardSphereMove = sphereStandardFolder.addFolder('Move')
const capsuleMove = capsulseFolder.addFolder('Move')
const boxPhongMove = boxPhongFolder.addFolder('Move')

function moveObject(folder, object){

  folder
    .add(object.position, 'y')
    .min(-5)
    .max(5)
    .step(.01)

  folder
    .add(object.position, 'x')
    .min(-5)
    .max(5)
    .step(.01)

   folder
    .add(object.position, 'z')
    .min(-5)
    .max(5)
    .step(.01)
}



function debugMove(){
moveObject(standardSphereMove, sphereStandard)
moveObject(capsuleMove, capsule)
moveObject(boxPhongMove, boxPhong)
}

debugMove()


/* 
Scene
 */
const scene = new THREE.Scene();

//geos
scene.add(torus, plane, sphere, sphereMetcap, cone, knot, box, boxPhong,capsule, sphereStandard);




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
 * RGBE Loader
 */

const rgbeLoader = new RGBELoader()

rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap)=>{

  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap

})

/*
LIGHTS
*/

//Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff,1);


//point light
const pointLight = new THREE.PointLight(0xffffff, 30)

pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

//add lights
scene.add( pointLight)






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
  
  function rotate(geo){
    geo.rotation.y = 0.1 * elapsedTime;
    geo.rotation.x = -0.15 * elapsedTime;
  }

  function rotateGeos(){
    rotate(sphere)
    rotate(sphereMetcap)
    rotate(plane)
    rotate(torus)
    rotate(cone)
    rotate(box)
    rotate(boxPhong)
    rotate(sphereStandard)
    rotate(capsule)
  }

  rotateGeos()


  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
