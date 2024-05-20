import React, { forwardRef } from 'react';
import HoverVideoPlayer from 'react-hover-video-player';

const HoverVideoPlayerWrapper = forwardRef((props, ref) => (
  <HoverVideoPlayer {...props} ref={ref} />
));

export default HoverVideoPlayerWrapper;