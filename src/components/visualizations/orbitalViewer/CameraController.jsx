import { useEffect } from 'react';
import PropTypes from 'prop-types';
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
    controls.minDistance = 3;
    controls.maxDistance = 200000;

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
