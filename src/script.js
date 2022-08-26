import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";
import crownFragmentShader from "./shaders/crown/fragment.glsl";
import crownVertexShader from "./shaders/crown/vertex.glsl";

/**
 * Base
 */
//Mouse
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const updateMouse = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
};

window.addEventListener("mousemove", updateMouse);
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#FDF6EC");
/**
 * Test mesh
 */

const light = new THREE.AmbientLight(new THREE.Color("white"), 1);
light.position.set(0, 2, 2);
scene.add(light);
//particle array
let particles = [];

//particle geometry
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute("position", new THREE.Float32BufferAttribute([], 3));

const particleMaterial = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    pointMultiplier: {
      value:
        window.innerHeight / (2.0 * Math.tan((0.5 * 60.0 * Math.PI) / 180.0)),
    },
    u_time: { value: 0 },
  },
  // blending: THREE.AdditiveBlending,
  vertexColors: true,
  // depthWrite: false,
});
let crownParticles = [];

const crownGeo = new THREE.BufferGeometry();
const crownMaterial = new THREE.ShaderMaterial({
  vertexShader: crownVertexShader,
  fragmentShader: crownFragmentShader,
  uniforms: {
    pointMultiplier: {
      value:
        window.innerHeight / (2.0 * Math.tan((0.5 * 60.0 * Math.PI) / 180.0)),
    },
    u_time: { value: 0 },
  },
  // blending: THREE.SubtractiveBlending,
  // vertexColors: true,
  // depthWrite: false,
});
const particleTree = new THREE.Group();
const particleTree2 = new THREE.Group();

const points = new THREE.Points(particleGeo, particleMaterial);
const crownPoints = new THREE.Points(crownGeo, crownMaterial);
particleTree.add(points, crownPoints);

scene.add(particleTree);

const createParticle = () => {
  const particle = {
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 0.05
    ),
    size: Math.random() * 0.15,
    life: Math.random() * 400.15 + 200,
  };

  particles.push(particle);
};

const createCrownParticle = () => {
  const randomness =
    Math.random() < 0.5 ? Math.random() * 0.75 : Math.random() * 0.95;
  const particle = {
    position: new THREE.Vector3(
      (Math.random() < 0.5 ? Math.random() * 0.05 : Math.random()) * 1 - 1,
      Math.random() * Math.sin(Math.random() * 1.5 * randomness) +
        Math.random() * randomness +
        Math.random() * 1.05,
      (Math.random() - 0.5) * 1.5
    ),
    size: Math.random() * 0.15,
    life: Math.random() * 600.15 + 100,
  };

  crownParticles.push(particle);
};

const updateCrownGeometry = () => {
  let positions = [];
  let sizes = [];
  let lives = [];

  for (let i = 0; i < crownParticles.length; i++) {
    const particleX = crownParticles[i].position.x;
    let particleY = crownParticles[i].position.y;
    const particleZ = crownParticles[i].position.z;
    const size = crownParticles[i].size;
    let life = crownParticles[i].life;
    // particleY = particleY + ((timeElapsed / size) * 0.01 )

    // particleY > 2  && particles.length > 100 ? createParticle() : particleY

    sizes.push(size);
    lives.push(life);
    positions.push(particleX, particleY, particleZ);
  }

  crownGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  crownGeo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  crownGeo.setAttribute("life", new THREE.Float32BufferAttribute(lives, 1));

  crownGeo.attributes.position.needsUpdate = true;
};

const updateGeometry = (timeElapsed) => {
  let positions = [];
  let sizes = [];
  let lives = [];

  for (let i = 0; i < particles.length; i++) {
    const particleX = particles[i].position.x;
    let particleY = particles[i].position.y;
    const particleZ = particles[i].position.z;
    const size = particles[i].size;
    let life = particles[i].life;
    // particleY = particleY + ((timeElapsed / size) * 0.01 )

    // particleY > 2  && particles.length > 100 ? createParticle() : particleY

    sizes.push(size);
    lives.push(life);
    positions.push(particleX, particleY, particleZ);
  }

  particleGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  particleGeo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  particleGeo.setAttribute("life", new THREE.Float32BufferAttribute(lives, 1));

  particleGeo.attributes.position.needsUpdate = true;

  for (let p of particles) {
    p.life -= 3;
    p.life < 0 ? createParticle() : "";
  }

  particles = particles.filter((p) => p.life > 0);
};

for (let i = 0; i < 400; i++) {
  createParticle();
}
for (let i = 0; i < 4000; i++) {
  createCrownParticle();
}
updateCrownGeometry();
updateGeometry();

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
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Reusable Particles tree

class ParticleTree {
  constructor(params) {
    (this._crown = []),
      (this._stem = []),
      (this._stemGeometry = new THREE.BufferGeometry()),

      (this._crownGeometry = new THREE.BufferGeometry()),

    this._stemMaterial = new THREE.ShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      uniforms: {
        pointMultiplier: {
          value:
            window.innerHeight /
            (2.0 * Math.tan((0.5 * 60.0 * Math.PI) / 180.0)),
        },
        u_time: { value: 0 },
      },
      // blending: THREE.AdditiveBlending,
      vertexColors: true,
      // depthWrite: false,
    }),

    this._crownMaterial = new THREE.ShaderMaterial({
      vertexShader: crownVertexShader,
      fragmentShader: crownFragmentShader,
      uniforms: {
        pointMultiplier: {
          value:
            window.innerHeight /
            (2.0 * Math.tan((0.5 * 60.0 * Math.PI) / 180.0)),
        },
        u_time: { value: 0 },
      },
      // blending: THREE.SubtractiveBlending,
      // vertexColors: true,
      depthWrite: false,
    });

    this._stemPoints = new THREE.Points(this._stemGeometry, this._stemMaterial)
    this._crownPoints = new THREE.Points(this._crownGeometry, this._crownMaterial),
    this._CreateStemParticles(400),
    this._CreateCrownParticles(4000)
    this._group = new THREE.Group()
    this._group.add(this._stemPoints, this._crownPoints)
    scene.add(this._group)
  }
  _CreateStemParticles(number) {
    for( let i = 0; i <= number ?? 1 ; i++){
      const randomness =
      Math.random() < 0.5 ? Math.random() * 0.75 : Math.random() * 0.95;
      const particle = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 0.05
        ),
        size: Math.random() * 0.15,
        life: Math.random() * 400.15 + 200,
      };
      this._stem.push(particle);
    }
  };
  _CreateCrownParticles(number) {
    for( let i = 0; i <= number ?? 1 ; i++){
      const randomness =
      Math.random() < 0.5 ? Math.random() * 0.75 : Math.random() * 0.95;
      const particle = {
        position: new THREE.Vector3(
          (Math.random() < 0.5 ? Math.random() * 0.05 : Math.random()) * 1 - 1,
          Math.random() * Math.sin(Math.random() * 1.5 * randomness) +
            Math.random() * randomness +
            Math.random() * 1.05,
          (Math.random() - 0.5) * 1.5
        ),
        size: Math.random() * 0.15,
        life: Math.random() * 600.15 + 100
      };
      this._crown.push(particle);
    }
  };
  _UpdateStemGeometry(){
    const positions = [];
    const sizes = [];
    const lives = [];

    for(let i = 0 ; i < this._stem.length; i++){
        const particle = this._stem[i]
        positions.push(particle.position.x, particle.position.y, particle.position.z)
        sizes.push(particle.size)
        lives.push(particle.life)
      }

    this._stemGeometry.setAttribute(
      'position', new THREE.Float32BufferAttribute(positions, 3)
    )
    this._stemGeometry.setAttribute(
      'size', new THREE.Float32BufferAttribute(sizes, 1)
    )
    this._stemGeometry.setAttribute(
      'life', new THREE.Float32BufferAttribute(lives, 1)
    )
    this._stemGeometry.attributes.position.needsUpdate = true
    this._stemGeometry.attributes.size.needsUpdate = true
    this._stemGeometry.attributes.life.needsUpdate = true


    for (let p of this._stem) {
      p.life -= 3;
      p.life < 0 ? this._CreateStemParticles(null) : ""
    }
  
    this._stem = this._stem.filter((p) => p.life > 0);
  }
  _UpdateCrownGeometry(){
    const positions = [];
    const sizes = [];
    const lives = [];

    for(let i = 0 ; i < this._crown.length; i++){
      const particle = this._crown[i]
      positions.push(particle.position.x, particle.position.y, particle.position.z)
      sizes.push(particle.size)
      lives.push(particle.life)
    }

    this._crownGeometry.setAttribute(
      'position', new THREE.Float32BufferAttribute(positions, 3)
    )
    this._crownGeometry.setAttribute(
      'size', new THREE.Float32BufferAttribute(sizes, 1)
    )
    this._crownGeometry.setAttribute(
      'life', new THREE.Float32BufferAttribute(lives, 1)
    )
    this._crownGeometry.attributes.position.needsUpdate = true
    this._crownGeometry.attributes.size.needsUpdate = true
    this._crownGeometry.attributes.life.needsUpdate = true

    for (let p of this._crown) {
      p.life -= Math.random();
      p.life < 0 ? this._CreateCrownParticles(null) : ""
    }
  
    this._crown = this._crown.filter((p) => p.life > 0);
  }

}

const particleTree3 = new ParticleTree();
particleTree3._group.position.z = -2.5

const particleTree4 = new ParticleTree()
particleTree4._group.position.z = -5

const particleTree5 = new ParticleTree()
particleTree5._group.position.z = -7.5

const particleTree6 = new ParticleTree()
particleTree6._group.position.z = -10

const row = []



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
console.log(scene)
/**
 * Animate
 */

const clock = new THREE.Clock();
const tick = () => {
  const timeElapsed = clock.getElapsedTime();

  particleMaterial.uniforms.u_time.value = timeElapsed;

  //update geometry
  updateGeometry(timeElapsed);
  updateCrownGeometry();
  particleTree3._UpdateStemGeometry()
  particleTree3._UpdateCrownGeometry()
  particleTree4._UpdateStemGeometry()
  particleTree4._UpdateCrownGeometry()
  particleTree5._UpdateStemGeometry()
  particleTree5._UpdateCrownGeometry()
  particleTree6._UpdateStemGeometry()
  particleTree6._UpdateCrownGeometry()
  row.forEach(el => {
    el._UpdateCrownGeometry();
    el._UpdateStemGeometry();
  })
  // updateMouse()

  for (let p of crownParticles) {
    p.life -= Math.random();
    p.life < 0 ? createCrownParticle() : "";
  }

  crownParticles = crownParticles.filter((p) => p.life > 0);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
