import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame, useThree } from 'react-three-fiber';

function Camera(props) {
  const ref = useRef();
  const { setDefaultCamera } = useThree();
  // Make the camera known to the system
  useEffect(() => {
    const $el = ref.current;
    setDefaultCamera($el);
    // $el.lookAt(props.look);
  }, []);
  // Update it every frame
  useFrame(() => ref.current.updateMatrixWorld());
  return <perspectiveCamera ref={ref} {...props} />;
}

Camera.propTypes = {
  look: PropTypes.array,
};

export default Camera;
