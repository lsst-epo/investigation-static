import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from 'react-three-fiber';

function CameraController() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.minDistance = 3;
    controls.maxDistance = 200000;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
}

export default CameraController;
