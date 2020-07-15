import { useEffect } from 'react';
import PropTypes from 'prop-types';
// import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from 'react-three-fiber';

function CameraController({ pov }) {
  const { camera, gl } = useThree();

  function setPov(controls) {
    if (pov) {
      const targetPov = {
        side: Math.PI / 1.0075,
        top: Math.PI / 2,
      }[pov];
      // horizontal rotation
      controls.minAzimuthAngle = 0;
      controls.maxAzimuthAngle = 0;
      // vertical rotation
      controls.minPolarAngle = targetPov;
      controls.maxPolarAngle = targetPov;
    }

    return controls;
  }

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 70;
    controls.maxDistance = 10000;
    controls.screenSpacePanning = true;
    // controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
    // controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
    // controls.touches.TWO = THREE.TOUCH.PAN;
    // controls.touches.ONE = THREE.TOUCH.DOLLY_ROTATE;

    setPov(controls, pov).update();

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
}

CameraController.propTypes = {
  pov: PropTypes.string,
};

export default CameraController;
