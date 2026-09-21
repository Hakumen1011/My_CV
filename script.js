import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { loadDecorations } from "./Three.js";


// =============================
// SCENE
// =============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 8, 25);

const lampGlowLight = loadDecorations(scene, THREE);
const clock = new THREE.Clock();


// =============================
// CAMERA
// =============================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 3.65, 7.3);
const cameraLookAt = new THREE.Vector3(0, 3.1, 0.5);
camera.lookAt(cameraLookAt);


// =============================
// RENDERER
// =============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document
    .getElementById("scene-container")
    .appendChild(renderer.domElement);


// =============================
// LIGHTING
// =============================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.38
);

scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    0.6
);

directionalLight.position.set(
    5,
    10,
    5
);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.bias = -0.0005;

scene.add(directionalLight);

const monitorLight = new THREE.PointLight(
    0x287dff,
    5,
    9,
    2
);

monitorLight.position.set(0, 4.0, 0.65);
monitorLight.castShadow = true;
monitorLight.shadow.mapSize.set(1024, 1024);
monitorLight.shadow.bias = -0.001;

scene.add(monitorLight);


// =============================
// ROOM
// =============================

const roomMaterial = new THREE.MeshStandardMaterial({
    color: 0x111923,
    roughness: 0.9,
    metalness: 0
});

function createRoomSurface(geometry, position) {
    const surface = new THREE.Mesh(geometry, roomMaterial);
    surface.position.set(...position);
    surface.receiveShadow = true;
    scene.add(surface);
    return surface;
}

createRoomSurface(
    new THREE.BoxGeometry(20, 10, 0.2),
    [0, 5, -5]
);

createRoomSurface(
    new THREE.BoxGeometry(0.2, 10, 10),
    [-10, 5, 0]
);

createRoomSurface(
    new THREE.BoxGeometry(0.2, 10, 10),
    [10, 5, 0]
);

createRoomSurface(
    new THREE.BoxGeometry(20, 0.2, 10),
    [0, 10, 0]
);

const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0x79513b,
    emissive: 0x120906,
    emissiveIntensity: 0.25,
    roughness: 0.8
});

const shelfParts = [];

function createShelfPart(geometry, position) {
    const part = new THREE.Mesh(geometry, shelfMaterial);
    part.position.set(...position);
    part.castShadow = true;
    part.receiveShadow = true;
    scene.add(part);
    shelfParts.push(part);
}

createShelfPart(
    new THREE.BoxGeometry(4.2, 0.18, 0.55),
    [0, 7.9, -4.55]
);

createShelfPart(
    new THREE.BoxGeometry(0.16, 0.75, 0.42),
    [-1.45, 7.5, -4.7]
);

createShelfPart(
    new THREE.BoxGeometry(0.16, 0.75, 0.42),
    [1.45, 7.5, -4.7]
);

const shelfLight = new THREE.PointLight(0xffc45c, 2.5, 5, 2);
shelfLight.position.set(0, 9.65, -4.2);
scene.add(shelfLight);

const shelfCeilingBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd27a })
);
shelfCeilingBulb.position.set(0, 9.82, -4.2);
scene.add(shelfCeilingBulb);

const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x31547e,
    emissive: 0x18345d,
    emissiveIntensity: 0.8,
    roughness: 0.6
});

const moonWindow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.3),
    windowMaterial
);

moonWindow.position.set(9.88, 6.1, -1.2);
moonWindow.rotation.y = Math.PI / 2;
scene.add(moonWindow);

const curtainMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a2938,
    roughness: 0.95
});

const curtains = [];

function createCurtain(position) {
    const curtain = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 3.5, 0.95),
        curtainMaterial
    );

    curtain.position.set(...position);
    curtain.castShadow = true;
    curtain.receiveShadow = true;
    curtains.push(curtain);
    scene.add(curtain);
}

createCurtain([9.78, 6.1, -2.25]);
createCurtain([9.78, 6.1, -0.15]);

const windowFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x202b3a,
    roughness: 0.8
});

function createWindowFrame(geometry, position) {
    const frame = new THREE.Mesh(geometry, windowFrameMaterial);
    frame.position.set(...position);
    frame.castShadow = true;
    frame.receiveShadow = true;
    scene.add(frame);
}

createWindowFrame(
    new THREE.BoxGeometry(0.18, 0.16, 3.7),
    [9.8, 7.77, -1.2]
);
createWindowFrame(
    new THREE.BoxGeometry(0.18, 0.16, 3.7),
    [9.8, 4.43, -1.2]
);
createWindowFrame(
    new THREE.BoxGeometry(0.18, 3.5, 0.16),
    [9.8, 6.1, -3.0]
);
createWindowFrame(
    new THREE.BoxGeometry(0.18, 3.5, 0.16),
    [9.8, 6.1, 0.6]
);

const moonlight = new THREE.PointLight(
    0x88aef0,
    7,
    14,
    2
);

moonlight.position.set(9.0, 6.1, -1.2);
moonlight.castShadow = true;
moonlight.shadow.mapSize.set(1024, 1024);
moonlight.shadow.bias = -0.001;
scene.add(moonlight);

const warmWindowLight = new THREE.PointLight(
    0xffc45c,
    0,
    94,
    2
);

warmWindowLight.position.set(8.8, 6.1, -1.2);
scene.add(warmWindowLight);


// =============================
// FLOOR
// =============================

const floorGeometry = new THREE.PlaneGeometry(
    20,
    20
);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111
});

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

scene.add(floor);


// =============================
// DESK
// =============================

const deskGeometry = new THREE.BoxGeometry(
    7,
    0.4,
    3.1
);

const deskMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222
});

const desk = new THREE.Mesh(
    deskGeometry,
    deskMaterial
);

desk.position.y = 2.5;
desk.castShadow = true;
desk.receiveShadow = true;

scene.add(desk);

// =============================
// CV DOCUMENT
// =============================

const cvCanvas = document.createElement("canvas");
cvCanvas.width = 1800;
cvCanvas.height = 2400;

const cvContext = cvCanvas.getContext("2d");
cvContext.scale(2, 2);

cvContext.fillStyle = "#f5f2ea";
cvContext.fillRect(0, 0, cvCanvas.width, cvCanvas.height);

cvContext.strokeStyle = "#d9d3c9";
cvContext.lineWidth = 2;

for (let y = 120; y < cvCanvas.height; y += 90) {
    cvContext.beginPath();
    cvContext.moveTo(60, y);
    cvContext.lineTo(cvCanvas.width - 60, y);
    cvContext.stroke();
}

cvContext.fillStyle = "#121212";
cvContext.font = "bold 54px Arial";
cvContext.fillText("HERMAN BANTJES", 60, 120);

cvContext.font = "28px Arial";
cvContext.fillText("Computing Student", 60, 190);
cvContext.fillText("Software Developer", 60, 235);

cvContext.font = "22px Arial";
cvContext.fillText("Skills: JavaScript • HTML • CSS • Three.js", 60, 380);
cvContext.fillText("Projects: Portfolio • Web Apps • Visual Design", 60, 430);
cvContext.fillText("Experience: Computing Student / Aspiring Developer", 60, 480);

const cvTexture = new THREE.CanvasTexture(cvCanvas);
cvTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const cvGeometry = new THREE.BoxGeometry(
    1.4,
    2.0,
    0.08
);

const cvMaterial = new THREE.MeshStandardMaterial({
    map: cvTexture,
    color: 0xffffff
});

const cv = new THREE.Mesh(
    cvGeometry,
    cvMaterial
);

cv.name = "CV";
cv.rotation.order = "YXZ";

cv.position.set(
    -2.2,
    2.735,                    // desk top (2.7) + half paper thickness (~0.035)
    0.9
);

cv.rotation.set(
    -Math.PI / 2,
    -0.7,
    0
);

scene.add(cv);
cv.castShadow = true;
cv.receiveShadow = true;

let cvHovered = false;
let cvFocused = false;
let screenFocused = false;
let shelfFocused = false;
let curtainsOpen = false;

const cvIdlePosition = new THREE.Vector3(-2.2, 2.735, 0.9);
const cvHoverPosition = new THREE.Vector3(-1.0, 3.2, 1.8);
const cvFocusPosition = new THREE.Vector3(0.15, 3.2, 2.8);

// Order is explicit here so that cv.rotation.copy(...) — used in hideIntro
// when the Enter button is clicked — carries the correct rotation order
// along with it, instead of silently resetting cv.rotation.order back to
// three.js's default ('XYZ') and breaking the flatten math.
const cvIdleRotation = new THREE.Euler(-Math.PI / 2, -0.7, 0, "YXZ");
const cvHoverRotation = new THREE.Euler(0, -0.08, 0, "YXZ");
const cvFocusRotation = new THREE.Euler(0, 0, 0, "YXZ");

const deskTopY = desk.position.y + deskGeometry.parameters.height / 2;
const cvBoundingBox = new THREE.Box3();

function updateCVState() {
    // Rotation and scale are updated first so the position target below can
    // use this frame's *current* rotation, instead of chasing a target that
    // was already out of date.
    const desiredRotation = cvFocused
        ? cvFocusRotation
        : cvHovered
            ? cvHoverRotation
            : cvIdleRotation;

    cv.rotation.x = THREE.MathUtils.lerp(cv.rotation.x, desiredRotation.x, 0.08);
    cv.rotation.y = THREE.MathUtils.lerp(cv.rotation.y, desiredRotation.y, 0.08);
    cv.rotation.z = THREE.MathUtils.lerp(cv.rotation.z, desiredRotation.z, 0.08);

    const desiredScale = cvFocused ? 1.9 : cvHovered ? 1.3 : 0.88;
    cv.scale.x = THREE.MathUtils.lerp(cv.scale.x, desiredScale, 0.08);
    cv.scale.y = THREE.MathUtils.lerp(cv.scale.y, desiredScale, 0.08);
    cv.scale.z = THREE.MathUtils.lerp(cv.scale.z, desiredScale, 0.08);

    const desiredPosition = cvFocused
        ? cvFocusPosition
        : cvHovered
            ? cvHoverPosition
            : cvIdlePosition;

    const animatedPosition = desiredPosition.clone();

    if (cvHovered && !cvFocused) {
        animatedPosition.y += Math.sin(performance.now() * 0.004) * 0.025;
    } else if (!cvFocused && !cvHovered) {
        // Measure, from this frame's rotation/scale, how far the paper's
        // lowest point sits below its own center, then keep the center
        // exactly that far above the desk. As rotation finishes settling to
        // flat, this naturally converges to cvIdlePosition with no fighting
        // between position and rotation.
        cv.updateMatrixWorld(true);
        cvBoundingBox.setFromObject(cv);
        const bottomOffset = cvBoundingBox.min.y - cv.position.y;

        animatedPosition.y = Math.max(
            cvIdlePosition.y,
            deskTopY - bottomOffset
        );
    }

    cv.position.lerp(animatedPosition, 0.08);
}

function checkCVHover() {

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersections = raycaster.intersectObject(cv);
    const screenIntersections = raycaster.intersectObject(screen);
    const shelfIntersections = raycaster.intersectObjects(shelfParts, false);
    const curtainIntersections = raycaster.intersectObjects(curtains, false);

    const nextHovered = intersections.length > 0;

    document.body.style.cursor =
        nextHovered || screenIntersections.length > 0 || shelfIntersections.length > 0 || curtainIntersections.length > 0
            ? "pointer"
            : "default";

    if (nextHovered !== cvHovered) {
        cvHovered = nextHovered;
    }
}

window.addEventListener("click", () => {

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersections = raycaster.intersectObjects([cv, screen, ...shelfParts, ...curtains], false);
    const clickedObject = intersections[0]?.object;

    if (clickedObject === cv) {
        cvFocused = !cvFocused;
        screenFocused = false;
        shelfFocused = false;
    } else if (clickedObject === screen) {
        screenFocused = !screenFocused;
        cvFocused = false;
        shelfFocused = false;
    } else if (shelfParts.includes(clickedObject)) {
        shelfFocused = !shelfFocused;
        cvFocused = false;
        screenFocused = false;
    } else if (curtains.includes(clickedObject)) {
        curtainsOpen = !curtainsOpen;
    }

});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        cvFocused = false;
        screenFocused = false;
        shelfFocused = false;
        curtainsOpen = false;
    }
});

// =============================
// MOUSE
// =============================

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;

    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

});

const raycaster = new THREE.Raycaster();

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-button");

const hideIntro = () => {
    if (intro) {
        intro.classList.add("hidden");
    }

    screenFocused = false;
    shelfFocused = false;
    curtainsOpen = false;
    cv.position.copy(cvIdlePosition);
    cv.rotation.copy(cvIdleRotation);
    cv.scale.setScalar(0.88);
    cvFocused = true;
};

enterButton.addEventListener("click", hideIntro);

// =============================
// COMPUTER MONITOR
// =============================

const monitorGeometry = new THREE.BoxGeometry(
    3.5,
    2.1,
    0.25
);

const monitorMaterial = new THREE.MeshStandardMaterial({
    color: 0x181818
});

const monitor = new THREE.Mesh(
    monitorGeometry,
    monitorMaterial
);

monitor.position.set(
    0,
    4.0,
    0
);
monitor.castShadow = true;
monitor.receiveShadow = true;

scene.add(monitor);


// =============================
// MONITOR SCREEN
// =============================

const screenGeometry = new THREE.PlaneGeometry(
    3.1,
    1.7
);

const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x0b3d78,
    emissiveIntensity: 1.4
});

const screen = new THREE.Mesh(
    screenGeometry,
    screenMaterial
);

screen.position.set(
    0,
    4.0,
    0.16
);

screen.rotation.y = 0;
screen.receiveShadow = true;

scene.add(screen);


// =============================
// MONITOR STAND
// =============================

const standGeometry = new THREE.BoxGeometry(
    0.25,
    1,
    0.25
);

const standMaterial = new THREE.MeshStandardMaterial({
    color: 0x151515
});

const stand = new THREE.Mesh(
    standGeometry,
    standMaterial
);

stand.position.set(
    0,
    3.2,
    0
);
stand.castShadow = true;
stand.receiveShadow = true;

scene.add(stand);


// =============================
// MONITOR BASE
// =============================

const baseGeometry = new THREE.BoxGeometry(
    1.5,
    0.12,
    0.7
);

const base = new THREE.Mesh(
    baseGeometry,
    standMaterial
);

base.position.set(
    0,
    2.75,
    0
);
base.castShadow = true;
base.receiveShadow = true;

scene.add(base);

// =============================
// COMPUTER SCREEN CONTENT
// =============================

const canvas = document.createElement("canvas");

canvas.width = 2048;
canvas.height = 1024;

const context = canvas.getContext("2d");
context.scale(2, 2);

function drawScreenContent(time) {
    const pulse = (Math.sin(time * 0.004) + 1) / 2;
    const cursorVisible = Math.floor(time / 500) % 2 === 0;

    context.fillStyle = "#081014";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#10232a";
    context.fillRect(0, 0, canvas.width, 58);

    context.fillStyle = "#62e6c4";
    context.fillRect(36, 24, 12, 12);

    context.fillStyle = "#d9fff5";
    context.font = "bold 24px Arial";
    context.fillText("HERMAN / WORKSPACE", 68, 34);

    context.fillStyle = "#75939b";
    context.font = "18px Arial";
    context.fillText("PORTFOLIO SYSTEM", 800, 34);

    context.fillStyle = "#ecfff9";
    context.font = "bold 50px Arial";
    context.fillText("HERMAN BANTJES", 42, 132);

    context.fillStyle = "#8fb1b3";
    context.font = "24px Arial";
    context.fillText("Computing student / software developer", 44, 170);

    context.fillStyle = "#183239";
    context.fillRect(42, 215, 420, 178);
    context.fillRect(486, 215, 496, 178);

    context.fillStyle = "#62e6c4";
    context.font = "bold 18px Arial";
    context.fillText("CURRENT FOCUS", 68, 250);
    context.fillText("BUILD STATUS", 512, 250);

    context.fillStyle = "#d9fff5";
    context.font = "24px Arial";
    context.fillText("Interactive web experiences", 68, 295);
    context.fillText("Three.js portfolio scene", 68, 333);
    context.fillText("Visual design + front end", 68, 371);

    context.fillStyle = "#8fb1b3";
    context.font = "20px Arial";
    context.fillText("SCENE_RENDER", 512, 292);
    context.fillText("INTERACTION", 512, 336);

    context.fillStyle = "#244d51";
    context.fillRect(708, 278, 236, 12);
    context.fillRect(708, 322, 236, 12);
    context.fillStyle = "#62e6c4";
    context.fillRect(708, 278, 190, 12);
    context.fillRect(708, 322, 218, 12);

    context.fillStyle = `rgba(98, 230, 196, ${0.5 + pulse * 0.5})`;
    context.beginPath();
    context.arc(512, 373, 6, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#75939b";
    context.font = "18px monospace";
    context.fillText("STATUS: ONLINE  |  READY FOR THE NEXT IDEA", 42, 452);
    context.fillStyle = "#62e6c4";
    context.fillText(cursorVisible ? "_" : " ", 920, 452);
}

drawScreenContent(0);


// Create texture
const screenTexture =
    new THREE.CanvasTexture(canvas);
screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();


// Apply texture
screen.material.map = screenTexture;

screen.material.needsUpdate = true;


// =============================
// DESK LEGS
// =============================

function createDeskLeg(x, z) {

    const geometry = new THREE.BoxGeometry(
        0.3,
        2.5,
        0.3
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x151515
    });

    const leg = new THREE.Mesh(
        geometry,
        material
    );

    leg.position.set(
        x,
        1.25,
        z
    );
    leg.castShadow = true;
    leg.receiveShadow = true;

    scene.add(leg);
}


createDeskLeg(-2.9, -1.05);
createDeskLeg(2.9, -1.05);
createDeskLeg(-2.9, 1.05);
createDeskLeg(2.9, 1.05);


// =============================
// ANIMATION
// =============================

function animate() {

    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    lampGlowLight.intensity = 3.3 + Math.sin(t * 0.6) * 0.25;

    checkCVHover();
    updateCVState();
    drawScreenContent(performance.now());
    screenTexture.needsUpdate = true;

    const curtainPositions = [
        curtainsOpen ? -3.05 : -2.25,
        curtainsOpen ? 0.65 : -0.15
    ];

    curtains.forEach((curtain, index) => {
        curtain.position.z = THREE.MathUtils.lerp(
            curtain.position.z,
            curtainPositions[index],
            0.08
        );
    });

    moonlight.intensity = THREE.MathUtils.lerp(
        moonlight.intensity,
        curtainsOpen ? 1.5 : 7,
        0.06
    );

    warmWindowLight.intensity = THREE.MathUtils.lerp(
        warmWindowLight.intensity,
        curtainsOpen ? 200 : 0,
        0.06
    );

    windowMaterial.color.set(curtainsOpen ? 0xffd36a : 0x31547e);
    windowMaterial.emissive.set(curtainsOpen ? 0xffa52f : 0x18345d);
    windowMaterial.emissiveIntensity = curtainsOpen ? 100 : 0.8;

    const desiredCameraPosition = shelfFocused
        ? new THREE.Vector3(0, 8.45, -1.7)
        : screenFocused
            ? new THREE.Vector3(0, 4.15, 3.5)
            : cvFocused
                ? new THREE.Vector3(0, 3.9, 5.9)
                : new THREE.Vector3(0, 3.65, 7.3);

    camera.position.lerp(desiredCameraPosition, 0.04);

    const desiredLookAt = shelfFocused
        ? new THREE.Vector3(0, 7.65, -4.2)
        : screenFocused
            ? new THREE.Vector3(0, 3.95, 0.05)
            : cvFocused
                ? new THREE.Vector3(0, 3.35, 1.4)
                : new THREE.Vector3(0, 3.1, 0.5);

    cameraLookAt.lerp(desiredLookAt, 0.08);
    camera.lookAt(cameraLookAt);

    renderer.render(
        scene,
        camera
    );
}

animate();


// =============================
// WINDOW RESIZE
// =============================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);