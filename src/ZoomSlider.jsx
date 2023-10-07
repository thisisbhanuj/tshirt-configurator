import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function ZoomSlider({ zoom, onZoomChange }) {
  return (
    <div className="zoom-slider custom-zoom">
      <p className='uppercase font-extrabold'>+ Zoom -</p>
      <Slider
        min={10} // Minimum FOV value
        max={50} // Maximum FOV value
        step={1}  // Step size for zoom
        value={zoom}
        onChange={onZoomChange}
      />
      {/* <p>{zoom}</p> */}
    </div>
  );
}

export default ZoomSlider;
