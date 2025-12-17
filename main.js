// Main script for the interactive 3D particle system
class ParticleSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleSystem = null;
        this.geometry = null;
        this.material = null;
        this.domeMesh = null;
        this.domeGeometry = null;
        this.domeMaterial = null;
        
        // Hand tracking variables
        this.hands = null;
        this.videoElement = null;
        this.canvasElement = null;
        this.ctx = null;
        
        // Particle properties
        this.particleCount = 2000;
        this.currentTemplate = 'heart';
        this.currentColor = new THREE.Color(0xff69b4);
        this.scaleFactor = 1.0;
        this.isHandTrackingActive = false;
        
        // Initialize the scene
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        // Create initial particles
        this.createParticles();
        
        // Create dome visualization
        this.createDome();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        // Start animation loop
        this.animate();
    }

    createParticles() {
        // Remove existing particles if they exist
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
        }

        if (this.geometry) {
            this.geometry.dispose();
        }

        if (this.material) {
            this.material.dispose();
        }

        // Create new geometry based on selected template
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);

        // Generate particles based on the selected template
        this.generateTemplatePositions(positions, this.currentTemplate);

        // Set up colors
        for (let i = 0; i < this.particleCount; i++) {
            colors[i * 3] = this.currentColor.r;
            colors[i * 3 + 1] = this.currentColor.g;
            colors[i * 3 + 2] = this.currentColor.b;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create material
        this.material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        // Create particle system
        this.particleSystem = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particleSystem);
    }

    generateTemplatePositions(positions, template) {
        for (let i = 0; i < this.particleCount; i++) {
            let x, y, z;

            switch (template) {
                case 'heart':
                    // Heart shape formula
                    const t = (Math.random() - 0.5) * 4 * Math.PI;
                    const heartScale = 0.8;
                    x = 16 * Math.pow(Math.sin(t), 3);
                    y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                    z = (Math.random() - 0.5) * 2;
                    
                    // Normalize and scale
                    x = (x / 20) * heartScale;
                    y = (y / 20) * heartScale;
                    break;
                    
                case 'flower':
                    // Flower pattern
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 2;
                    const petalCount = 8;
                    const petalAngle = (Math.floor(Math.random() * petalCount) * 2 * Math.PI) / petalCount;
                    x = Math.cos(angle) * radius * (0.5 + 0.5 * Math.cos(petalAngle * 3));
                    y = Math.sin(angle) * radius * (0.5 + 0.5 * Math.sin(petalAngle * 4));
                    z = (Math.random() - 0.5) * 1;
                    break;
                    
                case 'saturn':
                    // Saturn-like ring with planet
                    const ringRadius = 1.5 + Math.random() * 0.5;
                    const ringAngle = Math.random() * Math.PI * 2;
                    if (Math.random() > 0.3) { // Ring particles
                        x = Math.cos(ringAngle) * ringRadius;
                        y = (Math.random() - 0.5) * 0.2; // Thin ring
                        z = Math.sin(ringAngle) * ringRadius;
                    } else { // Planet particles
                        const sphereRadius = Math.random() * 0.5;
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.random() * Math.PI;
                        x = Math.sin(phi) * Math.cos(theta) * sphereRadius;
                        y = Math.sin(phi) * Math.sin(theta) * sphereRadius;
                        z = Math.cos(phi) * sphereRadius;
                    }
                    break;
                    
                case 'buddha':
                    // Simplified Buddha statue shape (approximated)
                    // Using a combination of shapes to represent a sitting figure
                    const u = Math.random();
                    const v = Math.random();
                    
                    if (u < 0.3) { // Head
                        x = (Math.random() - 0.5) * 0.8;
                        y = 1.2 + Math.random() * 0.4;
                        z = (Math.random() - 0.5) * 0.8;
                    } else if (u < 0.6) { // Torso
                        x = (Math.random() - 0.5) * 1.2;
                        y = 0.5 + Math.random() * 0.7;
                        z = (Math.random() - 0.5) * 0.8;
                    } else { // Base/lotus
                        x = (Math.random() - 0.5) * 1.5;
                        y = Math.random() * 0.3;
                        z = (Math.random() - 0.5) * 1.5;
                    }
                    break;
                    
                case 'fireworks':
                    // Firework explosion pattern
                    const fireAngle = Math.random() * Math.PI * 2;
                    const firePhi = Math.random() * Math.PI;
                    const fireRadius = Math.random() * 2;
                    x = Math.sin(firePhi) * Math.cos(fireAngle) * fireRadius;
                    y = Math.sin(firePhi) * Math.sin(fireAngle) * fireRadius;
                    z = Math.cos(firePhi) * fireRadius;
                    break;
                    
                case 'sphere':
                default:
                    // Random sphere
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    const r = Math.cbrt(Math.random()) * 1.5; // Cube root for uniform distribution
                    x = Math.sin(phi) * Math.cos(theta) * r;
                    y = Math.sin(phi) * Math.sin(theta) * r;
                    z = Math.cos(phi) * r;
                    break;
            }

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
    }

    createDome() {
        // Remove existing dome if it exists
        if (this.domeMesh) {
            this.scene.remove(this.domeMesh);
            if (this.domeGeometry) this.domeGeometry.dispose();
            if (this.domeMaterial) this.domeMaterial.dispose();
        }

        // Create dome geometry (adjust size based on current template)
        let domeRadius = 5;
        if (this.currentTemplate === 'heart' || this.currentTemplate === 'flower') {
            domeRadius = 3;
        } else if (this.currentTemplate === 'saturn') {
            domeRadius = 4;
        } else {
            domeRadius = 3.5;
        }
        
        this.domeGeometry = new THREE.SphereGeometry(domeRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeVertices = this.domeGeometry.attributes.position.array;
        
        // Adjust vertices to make it a dome instead of a hemisphere
        for (let i = 0; i < domeVertices.length; i += 3) {
            // Modify the Z coordinate to make it more of a dome shape
            if (domeVertices[i + 2] < 0) {
                domeVertices[i + 2] = -domeVertices[i + 2] * 0.3; // Flatten the bottom
            }
        }
        
        // Update the geometry
        this.domeGeometry.attributes.position.needsUpdate = true;
        this.domeGeometry.computeVertexNormals();

        // Create dome material
        this.domeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });

        // Create dome mesh
        this.domeMesh = new THREE.Mesh(this.domeGeometry, this.domeMaterial);
        this.domeMesh.rotation.x = Math.PI; // Flip the dome to face upward
        this.scene.add(this.domeMesh);
    }

    updateParticles() {
        if (!this.particleSystem) return;

        // Get current positions
        const positions = this.geometry.attributes.position.array;
        const originalPositions = new Float32Array(positions); // Keep original positions

        // Apply scaling based on hand distance
        for (let i = 0; i < this.particleCount; i++) {
            const origX = originalPositions[i * 3];
            const origY = originalPositions[i * 3 + 1];
            const origZ = originalPositions[i * 3 + 2];

            // Scale the positions
            positions[i * 3] = origX * this.scaleFactor;
            positions[i * 3 + 1] = origY * this.scaleFactor;
            positions[i * 3 + 2] = origZ * this.scaleFactor;
        }

        // Mark the attribute as needing update
        this.geometry.attributes.position.needsUpdate = true;
        
        // Update dome scale as well
        if (this.domeMesh) {
            this.domeMesh.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        }
    }

    setupEventListeners() {
        // Template selection
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            this.currentTemplate = e.target.value;
            this.createParticles();
            this.createDome(); // Recreate dome to stay synchronized
        });

        // Color picker
        document.getElementById('colorPicker').addEventListener('input', (e) => {
            this.currentColor = new THREE.Color(e.target.value);
            this.updateColors();
        });

        // Start camera button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startHandTracking();
        });

        // Reset particles button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.scaleFactor = 1.0;
            this.updateParticles();
        });
    }

    updateColors() {
        if (!this.particleSystem) return;

        const colors = this.geometry.attributes.color.array;
        for (let i = 0; i < this.particleCount; i++) {
            colors[i * 3] = this.currentColor.r;
            colors[i * 3 + 1] = this.currentColor.g;
            colors[i * 3 + 2] = this.currentColor.b;
        }

        this.geometry.attributes.color.needsUpdate = true;
        
        // Update dome color to match particle color
        if (this.domeMaterial) {
            // Convert THREE.Color to a similar brightness for the dome
            const avgBrightness = (this.currentColor.r + this.currentColor.g + this.currentColor.b) / 3;
            // Make dome color slightly brighter to be visible against particles
            const domeColorValue = Math.min(1, avgBrightness * 1.5);
            this.domeMaterial.color.setRGB(domeColorValue, domeColorValue, domeColorValue);
        }
    }

    startHandTracking() {
        if (this.isHandTrackingActive) return;

        // Show video element
        this.videoElement = document.getElementById('video');
        this.videoElement.style.display = 'block';
        document.getElementById('video-container').style.display = 'block';

        // Initialize MediaPipe Hands
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });

        this.hands.onResults((results) => {
            this.handleHandResults(results);
        });

        // Get camera feed
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
                .then((stream) => {
                    this.videoElement.srcObject = stream;
                    this.videoElement.onloadedmetadata = () => {
                        this.videoElement.play();
                        
                        // Update status
                        document.getElementById('status').textContent = 'Camera active - show your hands to control particles';
                        
                        // Start processing frames
                        this.processVideoFrame();
                    };
                })
                .catch((err) => {
                    console.error("Error accessing camera:", err);
                    document.getElementById('status').textContent = 'Error accessing camera: ' + err.message;
                });
        } else {
            document.getElementById('status').textContent = 'getUserMedia not supported in this browser';
        }

        this.isHandTrackingActive = true;
    }

    handleHandResults(results) {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            // No hands detected, reset to default scale
            this.scaleFactor = 1.0;
            return;
        }

        // Calculate the distance between index fingertips of both hands
        if (results.multiHandLandmarks.length >= 2) {
            const rightHand = results.multiHandLandmarks[0]; // Assuming first is right
            const leftHand = results.multiHandLandmarks[1];  // Assuming second is left
            
            // Get index finger tip landmarks (landmark 8)
            const rightIndexTip = rightHand[8];
            const leftIndexTip = leftHand[8];
            
            // Calculate distance between fingertips
            const distance = Math.sqrt(
                Math.pow(rightIndexTip.x - leftIndexTip.x, 2) +
                Math.pow(rightIndexTip.y - leftIndexTip.y, 2) +
                Math.pow(rightIndexTip.z - leftIndexTip.z, 2)
            );
            
            // Map distance to scale factor (adjust these values based on testing)
            // When hands are close, particles contract; when far apart, they expand
            const minDistance = 0.05; // Minimum detectable distance
            const maxDistance = 0.3;  // Maximum expected distance
            const minScale = 0.5;     // Minimum scale when hands are very close
            const maxScale = 2.0;     // Maximum scale when hands are far apart
            
            // Normalize distance to scale factor
            const normalizedDistance = Math.min(1, Math.max(0, (distance - minDistance) / (maxDistance - minDistance)));
            this.scaleFactor = minScale + (maxScale - minScale) * normalizedDistance;
        } else if (results.multiHandLandmarks.length === 1) {
            // Single hand detected - maybe use palm openness to control scale?
            const hand = results.multiHandLandmarks[0];
            // For now, just keep current scale or slightly reduce it
            this.scaleFactor *= 0.98; // Gradually contract when only one hand
        }
        
        // Ensure scale stays within reasonable bounds
        this.scaleFactor = Math.max(0.1, Math.min(3.0, this.scaleFactor));
    }

    processVideoFrame() {
        if (!this.videoElement || !this.videoElement.videoWidth) {
            requestAnimationFrame(() => this.processVideoFrame());
            return;
        }

        this.hands.send({ image: this.videoElement }).then(() => {
            requestAnimationFrame(() => this.processVideoFrame());
        }).catch(e => {
            console.error("Error processing frame:", e);
            requestAnimationFrame(() => this.processVideoFrame());
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate particles slowly for visual effect
        if (this.particleSystem) {
            this.particleSystem.rotation.x += 0.001;
            this.particleSystem.rotation.y += 0.002;
        }

        // Update particles based on hand tracking
        this.updateParticles();

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the application when the page loads
window.addEventListener('load', () => {
    new ParticleSystem();
});