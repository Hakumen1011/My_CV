import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { loadDecorations } from "./Three.js";



// =============================
// SCENE
// =============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 8, 25);

const printerParts = [];

// Hobby labels: shelf decorations that show a text tag when hovered.
// hobbyLabels maps each mesh to the text it should display.
const hobbyParts = [];
const hobbyLabels = new WeakMap();

function registerHobbyModel(model, label) {
    model.traverse((child) => {
        if (child.isMesh) {
            hobbyParts.push(child);
            hobbyLabels.set(child, label);
        }
    });
}

const lampGlowLight = loadDecorations(scene, THREE, {
    onPrinterLoad: (model) => {
        model.traverse((child) => {
            if (child.isMesh) {
                printerParts.push(child);
            }
        });
    },
    onMikuLoad: (model) => registerHobbyModel(model, "Animation"),
    onDumbbellLoad: (model) => registerHobbyModel(model, "GYM"),
    onBlackHoleLoad: (model) => registerHobbyModel(model, "Space")
});
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

// Shifted +0.25 on z from the original -4.55/-4.7/-4.2 spots so the whole
// shelf assembly clears the decorative wall coat instead of poking through
// it — the brackets used to reach back to z: -4.91, past the wall's
// interior surface at z: -4.9.
createShelfPart(
    new THREE.BoxGeometry(4.2, 0.18, 0.55),
    [0, 7.9, -4.30]
);

createShelfPart(
    new THREE.BoxGeometry(0.16, 0.75, 0.42),
    [-1.45, 7.5, -4.45]
);

createShelfPart(
    new THREE.BoxGeometry(0.16, 0.75, 0.42),
    [1.45, 7.5, -4.45]
);

const shelfLight = new THREE.PointLight(0xffc45c, 2.5, 5, 2);
shelfLight.position.set(0, 9.65, -3.95);
scene.add(shelfLight);

const shelfCeilingBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd27a })
);
shelfCeilingBulb.position.set(0, 9.82, -3.95);
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
// SMALL DESK & PRINTER
// =============================

// Sits right beside the main desk (which spans x: -3.5 to 3.5), with a
// small gap, and matches its top height (2.7) so the two read as one
// continuous work surface.

const smallDeskGeometry = new THREE.BoxGeometry(
    2.0,
    0.35,
    1.8
);

const smallDesk = new THREE.Mesh(
    smallDeskGeometry,
    deskMaterial
);

smallDesk.position.set(4.65, 2.525, 0);
smallDesk.castShadow = true;
smallDesk.receiveShadow = true;

scene.add(smallDesk);

function createSmallDeskLeg(x, z) {
    const geometry = new THREE.BoxGeometry(0.22, 2.35, 0.22);
    const material = new THREE.MeshStandardMaterial({ color: 0x151515 });
    const leg = new THREE.Mesh(geometry, material);

    leg.position.set(x, 1.175, z);
    leg.castShadow = true;
    leg.receiveShadow = true;

    scene.add(leg);
}

createSmallDeskLeg(3.8, -0.75);
createSmallDeskLeg(5.5, -0.75);
createSmallDeskLeg(3.8, 0.75);
createSmallDeskLeg(5.5, 0.75);


const CV_PDF_PATH = "assets/cv/Herman_Bantjes_CV.pdf";

function downloadCV() {
    const link = document.createElement("a");
    link.href = CV_PDF_PATH;
    link.download = "Herman_Bantjes_CV.pdf";
    link.click();
}

const printerConfirmEl = document.getElementById("printer-confirm");
const printerConfirmYes = document.getElementById("printer-confirm-yes");
const printerConfirmCancel = document.getElementById("printer-confirm-cancel");

function showPrinterConfirm() {
    printerConfirmEl?.classList.add("visible");
}

function hidePrinterConfirm() {
    printerConfirmEl?.classList.remove("visible");
}

function confirmPrint() {
    downloadCV();
    hidePrinterConfirm();
    printerFocused = false;
}

function cancelPrint() {
    hidePrinterConfirm();
    printerFocused = false;
}

printerConfirmYes?.addEventListener("click", (event) => {
    event.stopPropagation();   // stops this click from bubbling into the window handler below
    confirmPrint();
});

printerConfirmCancel?.addEventListener("click", (event) => {
    event.stopPropagation();
    cancelPrint();
});






// =============================
// CV DOCUMENT
// =============================

const cvCanvas = document.createElement("canvas");
cvCanvas.width = 1800;
cvCanvas.height = 2400;

const cvContext = cvCanvas.getContext("2d");
cvContext.scale(2, 2);

// Working coordinate space below is 900 x 1200 (the canvas is 1800 x 2400,
// drawn at 2x scale). Manual word-wrap since canvas text doesn't wrap itself.
const cvMargin = 60;
const cvMaxWidth = 900 - cvMargin * 2;
let cvY = 0;

function cvWrapText(text, size, color, lineHeight = size + 6) {
    cvContext.fillStyle = color;
    cvContext.font = `${size}px Arial`;

    const words = text.split(" ");
    let line = "";

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = cvContext.measureText(testLine).width;

        if (testWidth > cvMaxWidth && line !== "") {
            cvContext.fillText(line.trim(), cvMargin, cvY);
            line = words[i] + " ";
            cvY += lineHeight;
        } else {
            line = testLine;
        }
    }

    cvContext.fillText(line.trim(), cvMargin, cvY);
    cvY += lineHeight;
}

function cvSectionHeading(text) {
    cvContext.fillStyle = "#1a1a1a";
    cvContext.font = "bold 20px Arial";
    cvContext.fillText(text.toUpperCase(), cvMargin, cvY);
    cvY += 8;

    cvContext.strokeStyle = "#c9c2b4";
    cvContext.lineWidth = 1.5;
    cvContext.beginPath();
    cvContext.moveTo(cvMargin, cvY);
    cvContext.lineTo(900 - cvMargin, cvY);
    cvContext.stroke();
    cvY += 22;
}

function cvLine(text, font, color) {
    cvContext.fillStyle = color;
    cvContext.font = font;
    cvContext.fillText(text, cvMargin, cvY);

    // Pull the numeric size out of strings like "bold 17px Arial" —
    // parseInt(font, 10) previously choked on the leading "bold" and
    // returned NaN, which broke cvY for every line after the first
    // bold one (and NaN coordinates silently draw nothing on canvas).
    const size = parseInt(font.match(/(\d+)px/)?.[1] ?? "16", 10);
    cvY += size + 5;
}

// Background
cvContext.fillStyle = "#f5f2ea";
cvContext.fillRect(0, 0, cvCanvas.width, cvCanvas.height);

// Header
cvY = 74;
cvLine("HERMAN BANTJES", "bold 40px Arial", "#121212");
cvLine("Bachelor of Computing Student | Aspiring Software Developer", "19px Arial", "#3a3a3a");
cvY += 4;
cvLine("Pretoria, Gauteng | 060 813 4459 | hermanbantjes04@gmail.com", "15px Arial", "#555555");
cvLine("GitHub: github.com/Hakumen1011", "15px Arial", "#555555");
cvY += 12;

cvContext.strokeStyle = "#d9d3c9";
cvContext.lineWidth = 2;
cvContext.beginPath();
cvContext.moveTo(cvMargin, cvY);
cvContext.lineTo(900 - cvMargin, cvY);
cvContext.stroke();
cvY += 34;

// Professional summary
cvSectionHeading("Professional Summary");
cvWrapText(
    "Third-year Bachelor of Computing (BCom) student at Belgium Campus with hands-on experience developing full-stack web applications, RESTful APIs, database-driven systems, and machine learning dashboards. Experienced with C#, JavaScript, Python, Java, ASP.NET Core, Express.js, PostgreSQL, MongoDB and Docker through academic and personal projects. Fast learner with strong problem-solving and time management skills seeking a graduate software development opportunity.",
    17,
    "#222222"
);
cvY += 12;

// Education
cvSectionHeading("Education");
cvLine("Belgium Campus iTversity - Bachelor of Computing (BCom)", "bold 17px Arial", "#222222");
cvLine("2025 - Expected Graduation: 2028", "15px Arial", "#555555");
cvY += 6;
cvLine("National Senior Certificate (Grade 12)", "bold 17px Arial", "#222222");
cvWrapText(
    "Completed Grades 1-12 with no failed grades. Subjects: English, Afrikaans, Mathematics, Physical Sciences, Information Technology, Engineering Graphics & Design, Life Orientation.",
    15,
    "#333333"
);
cvY += 12;

// Technical skills
cvSectionHeading("Technical Skills");
cvWrapText("Languages: C#, Java, JavaScript, Python, SQL, HTML, CSS", 16, "#222222");
cvWrapText("Frameworks & Technologies: ASP.NET Core, Node.js, Express.js, Entity Framework Core, REST APIs, Docker", 16, "#222222");
cvWrapText("Databases: PostgreSQL, MongoDB", 16, "#222222");
cvWrapText("Tools: Git, GitHub, Visual Studio, Visual Studio Code, Jupyter Notebook", 16, "#222222");
cvY += 12;

// Projects
cvSectionHeading("Projects");
cvLine("CampusLearn", "bold 16px Arial", "#222222");
cvWrapText("RESTful ASP.NET Core application with PostgreSQL, CRUD operations, API endpoints and Docker deployment.", 15, "#333333");
cvY += 6;
cvLine("Machine Learning Dashboard", "bold 16px Arial", "#222222");
cvWrapText("Dash/Plotly dashboard integrating predictive ML models and data visualisation.", 15, "#333333");
cvY += 6;
cvLine("Web Programming MVC Application", "bold 16px Arial", "#222222");
cvWrapText("Node.js/Express/MongoDB application following MVC architecture with a responsive frontend.", 15, "#333333");
cvY += 12;

// Experience
cvSectionHeading("Experience");
cvLine("Stock Management Assistant - Seal Centre", "bold 16px Arial", "#222222");
cvLine("Jan 2026 - Mar 2026", "14px Arial", "#666666");
cvWrapText("Managed inventory, maintained accurate stock records and supported warehouse operations.", 15, "#333333");
cvY += 12;

// Soft skills
cvSectionHeading("Soft Skills");
cvWrapText(
    "Problem Solving | Time Management | Fast Learner | Team Collaboration | Analytical Thinking | Adaptability",
    15,
    "#333333"
);

const cvTexture = new THREE.CanvasTexture(cvCanvas);
cvTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const cvGeometry = new THREE.BoxGeometry(
    1.4,
    2.0,
    0.08
);

const cvMaterial = new THREE.MeshStandardMaterial({
    map: cvTexture,
    color: 0xffffff,
    // Reuses the same canvas texture as an emissive map: the pale page
    // background is close to white so it glows brighter on focus, while
    // the near-black text emits almost nothing — so contrast increases
    // without the words themselves washing out.
    emissive: 0xfff6e4,
    emissiveMap: cvTexture,
    emissiveIntensity: 0
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
let printerFocused = false;

// Nothing in the scene should be clickable or hoverable until the Enter
// button has been pressed once — see checkCVHover, checkHobbyHover and the
// window "click" listener below, which all bail out early while this is
// false.
let introDismissed = false;

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

    // Brighten the page on focus so the text reads more clearly — a light
    // glow while fully focused, a faint hint on hover, nothing at rest.
    const targetEmissive = cvFocused ? 0.65 : cvHovered ? 0.2 : 0;
    cvMaterial.emissiveIntensity = THREE.MathUtils.lerp(
        cvMaterial.emissiveIntensity,
        targetEmissive,
        0.08
    );
}

function checkCVHover() {

    if (!introDismissed) {
        document.body.style.cursor = "default";
        return;
    }

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersections = raycaster.intersectObject(cv);
    const screenIntersections = raycaster.intersectObject(screen);
    const shelfIntersections = raycaster.intersectObjects(shelfParts, false);
    const curtainIntersections = raycaster.intersectObjects(curtains, false);
    const printerIntersections = raycaster.intersectObjects(printerParts, false);

    const nextHovered = intersections.length > 0;

    document.body.style.cursor =
        nextHovered || screenIntersections.length > 0 || shelfIntersections.length > 0 || curtainIntersections.length > 0 || printerIntersections.length > 0
            ? "pointer"
            : "default";

    if (nextHovered !== cvHovered) {
        cvHovered = nextHovered;
    }
}

function checkHobbyHover() {

    // Only show hobby tags once the camera has actually zoomed in on the
    // shelf — hovering the models from the default wide view stays quiet.
    if (!introDismissed || !shelfFocused) {
        hobbyLabel.classList.remove("visible");
        return;
    }

    raycaster.setFromCamera(mouse, camera);

    const hobbyIntersections = raycaster.intersectObjects(hobbyParts, false);
    const hit = hobbyIntersections[0]?.object;
    const label = hit ? hobbyLabels.get(hit) : undefined;

    if (label) {
        hobbyLabelText.textContent = label;
        hobbyLabel.style.left = `${mouseClient.x}px`;
        hobbyLabel.style.top = `${mouseClient.y}px`;
        hobbyLabel.classList.add("visible");
    } else {
        hobbyLabel.classList.remove("visible");
    }
}

window.addEventListener("click", () => {

    if (!introDismissed) {
        return;
    }

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersections = raycaster.intersectObjects([cv, screen, ...shelfParts, ...curtains, ...printerParts], false);
    const clickedObject = intersections[0]?.object;

        if (clickedObject === cv) {
        cvFocused = !cvFocused;
        screenFocused = false;
        shelfFocused = false;
        printerFocused = false;
        hidePrinterConfirm();
    } else if (clickedObject === screen) {
        if (screenFocused) {
            // Already zoomed in on the browser mockup — check whether this
            // click landed on a repo card before treating it as "back out".
            const screenHit = intersections.find((hit) => hit.object === screen);
            const uv = screenHit?.uv;

            if (uv) {
                const canvasX = uv.x * 1024;
                const canvasY = (1 - uv.y) * 512;

                const clickedCard = githubCardLayout.find(
                    (card) =>
                        canvasX >= card.x &&
                        canvasX <= card.x + card.w &&
                        canvasY >= card.y &&
                        canvasY <= card.y + card.h
                );

                if (clickedCard) {
                    // Private repos have nothing public to link to — clicking
                    // one just stays put instead of opening a dead link.
                    if (!clickedCard.repo.private) {
                        window.open(`https://github.com/${githubUsername}/${clickedCard.repo.name}`, "_blank");
                    }
                    return;
                }
            }

            screenFocused = false;
        } else {
            screenFocused = true;
            cvFocused = false;
            shelfFocused = false;
            printerFocused = false;
            hidePrinterConfirm();
        }
    } else if (shelfParts.includes(clickedObject)) {
        shelfFocused = !shelfFocused;
        cvFocused = false;
        screenFocused = false;
        printerFocused = false;
        hidePrinterConfirm();
    } else if (curtains.includes(clickedObject)) {
        curtainsOpen = !curtainsOpen;
    } else if (printerParts.includes(clickedObject)) {
        if (printerFocused) {
            cancelPrint();
        } else {
            cvFocused = false;
            screenFocused = false;
            shelfFocused = false;
            printerFocused = true;
            showPrinterConfirm();
        }
    }

});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        cvFocused = false;
        screenFocused = false;
        shelfFocused = false;
        curtainsOpen = false;
        printerFocused = false;
        hidePrinterConfirm();
    }
});

// =============================
// MOUSE
// =============================

const mouse = new THREE.Vector2();
const mouseClient = { x: 0, y: 0 };

window.addEventListener("mousemove", (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;

    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    mouseClient.x = event.clientX;
    mouseClient.y = event.clientY;

});

const raycaster = new THREE.Raycaster();

const hobbyLabel = document.getElementById("hobby-label");
const hobbyLabelText = document.getElementById("hobby-label-text");

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enter-button");

const hideIntro = (event) => {
    // Stops this same click from also reaching the scene's window-level
    // click listener — otherwise, since introDismissed flips to true a few
    // lines below, this one click could immediately register as a second
    // click on whatever happens to sit behind the Enter button.
    event?.stopPropagation();

    if (intro) {
        intro.classList.add("hidden");
    }

    introDismissed = true;
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

// Real public repos pulled from github.com/Hakumen1011, plus the other
// projects from the CV that live in private repos — those show up as
// non-clickable "PRIVATE" cards instead of linking out to a repo the
// visitor can't actually see. A language of null just means GitHub didn't
// report one for that repo, so no language dot is drawn.
const githubUsername = "Hakumen1011";
const githubRepos = [
    {
        name: "SEN381_Civicconnect_Project",
        description: "CivicConnect — community service request management platform, built as a Software Engineering project.",
        language: null,
        languageColor: "#8b949e",
        private: false
    },
    {
        name: "WPR381_project_Smart-event-management-system",
        description: "Smart event management system built for the Web Programming module.",
        language: "JavaScript",
        languageColor: "#f1e05a",
        private: false
    },
    {
        name: "CampusLearn",
        description: "RESTful ASP.NET Core app with PostgreSQL, CRUD operations, API endpoints and Docker deployment.",
        language: "C#",
        languageColor: "#178600",
        private: true
    },
    {
        name: "Machine Learning Dashboard",
        description: "Dash/Plotly dashboard integrating predictive ML models and data visualisation.",
        language: "Python",
        languageColor: "#3572a5",
        private: true
    },
    {
        name: "Web Programming MVC Application",
        description: "Node.js/Express/MongoDB app following MVC architecture with a responsive frontend.",
        language: "JavaScript",
        languageColor: "#f1e05a",
        private: true
    }
];

// Canvas is 2048x1024 physical, scaled 2x -> this is a 1024x512 logical
// space. Layout is computed once and reused both to draw the cards and to
// hit-test clicks against them (see the screen click handler below).
const githubCardLayout = (() => {
    const cardX = 40;
    const cardW = 1024 - 80;
    const cardH = 54;
    const gap = 10;
    let y = 148;

    return githubRepos.map((repo) => {
        const card = { repo, x: cardX, y, w: cardW, h: cardH };
        y += cardH + gap;
        return card;
    });
})();

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let cursorY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && line !== "") {
            ctx.fillText(line.trim(), x, cursorY);
            line = words[i] + " ";
            cursorY += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line.trim(), x, cursorY);
    return cursorY + lineHeight;
}

function truncateCanvasText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) {
        return text;
    }

    let truncated = text;
    while (truncated.length > 1 && ctx.measureText(truncated + "…").width > maxWidth) {
        truncated = truncated.slice(0, -1);
    }

    return truncated + "…";
}

function roundedRectPath(ctx, x, y, w, h, radius) {
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, radius);
    } else {
        ctx.rect(x, y, w, h);
    }
}

function drawGithubBrowser() {
    const w = 1024;
    const h = 512;

    // Page background (GitHub's own dark background color)
    context.fillStyle = "#0d1117";
    context.fillRect(0, 0, w, h);

    // Browser chrome bar
    context.fillStyle = "#1c1f26";
    context.fillRect(0, 0, w, 46);

    const dotColors = ["#ff5f57", "#febc2e", "#28c840"];
    dotColors.forEach((color, i) => {
        context.fillStyle = color;
        context.beginPath();
        context.arc(28 + i * 22, 23, 6, 0, Math.PI * 2);
        context.fill();
    });

    // Address bar
    roundedRectPath(context, 110, 10, 360, 26, 13);
    context.fillStyle = "#0d1117";
    context.fill();
    context.strokeStyle = "#30363d";
    context.lineWidth = 1;
    context.stroke();

    context.fillStyle = "#8b949e";
    context.font = "14px Arial";
    context.fillText(`github.com/${githubUsername}`, 126, 28);

    context.fillStyle = "#6e7681";
    context.font = "13px Arial";
    context.fillText("REPOSITORIES", w - 190, 27);

    // Profile header
    context.fillStyle = "#e6edf3";
    context.font = "bold 26px Arial";
    context.fillText(githubUsername, 40, 92);

    context.fillStyle = "#7d8590";
    context.font = "15px Arial";
    context.fillText("Herman Bantjes — Computing student", 40, 116);

    // Repo cards — one compact row each so all five fit on screen at once.
    githubCardLayout.forEach(({ repo, x, y, w: cardW, h: cardH }) => {
        roundedRectPath(context, x, y, cardW, cardH, 8);
        context.fillStyle = "#161b22";
        context.fill();
        context.strokeStyle = "#30363d";
        context.lineWidth = 1;
        context.stroke();

        // Right-hand badge: a "PRIVATE" tag, or a language dot + name when
        // the repo is public and GitHub reported a language. Measured first
        // so the name/description on the left know how much room they have.
        let badgeWidth = 0;

        if (repo.private) {
            context.font = "bold 12px Arial";
            badgeWidth = context.measureText("PRIVATE").width + 24;
        } else if (repo.language) {
            context.font = "13px Arial";
            badgeWidth = context.measureText(repo.language).width + 34;
        }

        const textMaxWidth = cardW - 32 - badgeWidth;

        context.fillStyle = "#58a6ff";
        context.font = "bold 17px Arial";
        context.fillText(
            truncateCanvasText(context, repo.name, textMaxWidth),
            x + 16,
            y + 22
        );

        context.fillStyle = "#8b949e";
        context.font = "13px Arial";
        context.fillText(
            truncateCanvasText(context, repo.description, textMaxWidth),
            x + 16,
            y + 41
        );

        if (repo.private) {
            roundedRectPath(context, x + cardW - badgeWidth - 12, y + cardH / 2 - 11, badgeWidth, 22, 11);
            context.fillStyle = "rgba(219, 109, 40, 0.15)";
            context.fill();
            context.strokeStyle = "#db6d28";
            context.lineWidth = 1;
            context.stroke();

            context.fillStyle = "#db6d28";
            context.font = "bold 12px Arial";
            context.fillText("PRIVATE", x + cardW - badgeWidth, y + cardH / 2 + 4);
        } else if (repo.language) {
            context.fillStyle = repo.languageColor;
            context.beginPath();
            context.arc(x + cardW - badgeWidth + 6, y + cardH / 2, 5, 0, Math.PI * 2);
            context.fill();

            context.fillStyle = "#c9d1d9";
            context.font = "13px Arial";
            context.fillText(repo.language, x + cardW - badgeWidth + 16, y + cardH / 2 + 5);
        }
    });

    context.fillStyle = "#6e7681";
    context.font = "13px monospace";
    context.fillText("Click a repo to open it on GitHub  |  click elsewhere to back out", 40, h - 20);
}

function drawScreenContent(time) {
    if (screenFocused) {
        drawGithubBrowser();
        return;
    }

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
    checkHobbyHover();
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
        ? new THREE.Vector3(0, 4.15, 2.3)
        : cvFocused
            ? new THREE.Vector3(0, 3.9, 5.9)
            : printerFocused
                ? new THREE.Vector3(6.4, 3.3, 1.3)
                : new THREE.Vector3(0, 3.65, 7.3);
    camera.position.lerp(desiredCameraPosition, 0.04);

   const desiredLookAt = shelfFocused
    ? new THREE.Vector3(0, 7.65, -3.95)
    : screenFocused
        ? new THREE.Vector3(0, 3.95, 0.05)
        : cvFocused
            ? new THREE.Vector3(0, 3.35, 1.4)
            : printerFocused
                ? new THREE.Vector3(4.65, 2.9, 0.05)
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