import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from 'react-three-fiber';

function Camera(props) {
  const ref = useRef();
  const { setDefaultCamera } = useThree();
  // Make the camera known to the system
  useEffect(() => {
    const $el = ref.current;
    setDefaultCamera($el);
  }, []);
  // Update it every frame
  useFrame(() => ref.current.updateMatrixWorld());
  return <orthographicCamera ref={ref} {...props} />;
}

export default Camera;
