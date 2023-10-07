import * as THREE from 'three';

function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 24;
  const fontFamily = 'Arial';

  context.font = `${fontSize}px ${fontFamily}`;
  const textWidth = context.measureText(text).width;

  canvas.width = textWidth;
  canvas.height = fontSize;

  context.font = `${fontSize}px ${fontFamily}`;
  context.fillStyle = 'white';
  context.fillText(text, 0, fontSize);

  const dataUrl = canvas.toDataURL(); // Convert canvas to data URL
  const texture = new THREE.TextureLoader().load(dataUrl);

  return texture;
}

function createTextTexture1(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 24; // Adjust the font size as needed
  const fontFamily = 'Arial'; // Specify the desired font family

  context.font = `${fontSize}px ${fontFamily}`;
  const textWidth = context.measureText(text).width;

  // Set canvas dimensions based on text size
  canvas.width = textWidth;
  canvas.height = fontSize;

  context.font = `${fontSize}px ${fontFamily}`;
  context.fillStyle = 'white'; // Set text color
  context.fillText(text, 0, fontSize);

  // Convert the canvas to a data URL
  const dataUrl = canvas.toDataURL();

  // Create a new TextureLoader
  const textureLoader = new THREE.TextureLoader();

  // Load the data URL as a texture
  const texture = textureLoader.load(dataUrl);
  texture.needsUpdate = true

  return texture;
}
