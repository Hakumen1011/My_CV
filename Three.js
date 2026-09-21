import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

const gltfLoader = new GLTFLoader();

export function loadDecorations(scene, THREE) {
    const alignmentBox = new THREE.Box3();

    function loadDecor({ url, position, rotation = [0, 0, 0], scale = 1, restingY, onLoad }) {
        gltfLoader.load(
            url,
            (gltf) => {
                const model = gltf.scene;

                model.position.set(...position);
                model.rotation.set(...rotation);
                model.scale.setScalar(scale);

                // If a resting surface height was given, measure the model's
                // actual bounding box after scale/rotation and nudge it so
                // its lowest point sits exactly on that surface. This is
                // what fixes models floating above or sinking into the desk
                // regardless of where each .glb file's own origin point is
                // — we no longer have to guess a position.y per model.
                if (restingY !== undefined) {
                    model.updateMatrixWorld(true);
                    alignmentBox.setFromObject(model);
                    const bottomOffset = alignmentBox.min.y - model.position.y;
                    model.position.y = restingY - bottomOffset;
                }

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                scene.add(model);
                onLoad?.(model);
            },
            undefined,
            () => console.warn(`Optional decoration not found: ${url}`)
        );
    }

    const deskTopY = 2.7;   // desk.position.y (2.5) + deskGeometry height/2 (0.2)
    const shelfTopY = 7.99; // shelf plank position.y (7.9) + its height/2 (0.09)
    const floorY = 0;

    loadDecor({
        url: "assets/models/keyboard_and_mouse.glb",
        position: [-0.8, 0, 1.2],
        rotation: [0, 0, 0],
        scale: 5.3,
        restingY: deskTopY
    });

    loadDecor({
        url: "assets/models/coffee_cup.glb",
        position: [2.0, 0, -0.55],
        rotation: [0, -0.25, 0],
        scale: 0.4,
        restingY: deskTopY
    });

    loadDecor({
        url: "assets/models/hatsune_miku_figure.glb",
        position: [-1.65, 0, -4.50],
        rotation: [0, 0.25, 0],
        scale: 0.19,
        restingY: shelfTopY
    });

    loadDecor({
    url: "assets/models/dumbbell.glb",
    position: [-0.8, 0, -4.50],
    rotation: [0, 0.6, 0],
    scale: 1.8,
    restingY: shelfTopY
    });

    const lampGlowLight = new THREE.PointLight(0xffa45f, 3.6, 12);
    lampGlowLight.position.set(-8.1, 3.2, -3.8);
    scene.add(lampGlowLight);

    loadDecor({
        url: "assets/models/saturn_desk_lamp.glb",
        position: [-8.1, 0, -3.8],
        rotation: [0, 0.4, 0],
        scale: 4.4,
        restingY: floorY,
        onLoad: (model) => {
            model.traverse((child) => {
                if (child.isMesh && /glow|bulb|ring|light/i.test(child.name)) {
                    child.material.emissive = new THREE.Color(0xff9d4d);
                    child.material.emissiveIntensity = 4;
                }
            });
        }
    });

    return lampGlowLight;
}
