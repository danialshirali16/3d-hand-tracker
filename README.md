# Interactive 3D Particle System with Hand Tracking

A real-time interactive 3D particle system built with Three.js and MediaPipe for hand tracking. The system allows you to control particles with hand gestures and customize their appearance.

## Features

- Real-time 3D particle system with various templates (hearts, flowers, Saturn, Buddha statues, fireworks, etc.)
- Hand tracking to control particle scaling and expansion
- Color picker to customize particle colors
- Responsive and modern UI
- Gesture-responsive particles that react to hand movements

## Requirements

- Modern web browser with WebGL support
- Access to camera for hand tracking
- HTTPS connection (required for camera access)

## How to Use

1. Open `index.html` in a web browser (preferably Chrome or Firefox)
2. Click the "Start Camera" button to enable hand tracking
3. Allow camera permissions when prompted
4. Show both hands to the camera to control the particles:
   - Bring hands closer together to contract the particle system
   - Move hands farther apart to expand the particle system
5. Use the dropdown menu to change particle templates
6. Use the color picker to change particle colors
7. Click "Reset Particles" to return to default scale

## Templates

- **Heart**: Creates a 3D heart-shaped particle formation
- **Flower**: Generates a flower-like pattern with petals
- **Saturn**: Forms a Saturn-like ring with a central planet
- **Buddha Statue**: Approximates a sitting Buddha figure
- **Fireworks**: Simulates an explosion of particles
- **Sphere**: Creates a spherical particle cloud
- **Cube**: Forms a cubic particle arrangement

## Technical Details

- Built with Three.js for 3D rendering
- Uses MediaPipe Hands for real-time hand tracking
- Implements custom algorithms for particle positioning based on mathematical formulas
- Supports responsive design for various screen sizes
- Optimized for performance with buffer geometries

## Files

- `index.html`: Main HTML structure and UI elements
- `main.js`: Core JavaScript logic for particle system and hand tracking
- `README.md`: This documentation file

## Browser Compatibility

The application requires a modern browser that supports:
- WebGL for 3D rendering
- WebRTC for camera access
- MediaStream API for video streaming
- ES6+ JavaScript features

Note: Some browsers require a secure HTTPS connection to access the camera.