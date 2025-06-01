// Initialize Three.js scene
let scene, camera, renderer, controls;
let geometry, material, mesh;
let particles = [];

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('hero-canvas').appendChild(renderer.domElement);

    // Create particles
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 10;
        particlePositions[i + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim(),
        size: 0.03,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Create main geometry (floating cube)
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshPhongMaterial({
        color: getComputedStyle(document.documentElement).getPropertyValue('--model-primary').trim(),
        transparent: true,
        opacity: 0.9,
        wireframe: true,
        wireframeLinewidth: 2
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
        getComputedStyle(document.documentElement).getPropertyValue('--model-accent').trim(),
        1.5
    );
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Add a second point light for better illumination
    const pointLight2 = new THREE.PointLight(
        getComputedStyle(document.documentElement).getPropertyValue('--model-secondary').trim(),
        1
    );
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    // Update controls
    controls.update();

    // Render scene
    renderer.render(scene, camera);
}

// Initialize the 3D model when the page loads
window.addEventListener('load', init);

// Handle theme changes
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Update particle color
        const particleMaterial = scene.children[0].material;
        particleMaterial.color.setHex(
            parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--particle-color')
                .trim()
                .replace('#', '0x'))
        );
        
        // Update cube material color
        mesh.material.color.setHex(
            parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--model-primary')
                .trim()
                .replace('#', '0x'))
        );

        // Update point lights
        const pointLight = scene.children[2];
        const pointLight2 = scene.children[3];
        
        pointLight.color.setHex(
            parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--model-accent')
                .trim()
                .replace('#', '0x'))
        );
        
        pointLight2.color.setHex(
            parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--model-secondary')
                .trim()
                .replace('#', '0x'))
        );
    });
} 