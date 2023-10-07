import { proxy } from 'valtio'

const state = proxy({
  intro: true,
  colors: ['#FFFFFF','#000C66', '#B7A1A6', '#80C670', '#E32227', '#FB6090', '#010100', '#FFA500'],
  decals: ['react.png'],
  textures: ['logo', 'poster', 'back'],
  selectedTextures: [],
  selectedLogoDecal: 'react.png',
  selectedPosterDecal: 'poster.png',
  selectedColor: '#80C670',
  isPosterSelected: false,
  isLogoSelected: false,
  isBackPosterSelected: false,
  //isTextSelected: false,
  //customText: 'react.png',
  isFlipped: false,
  showButtonColor: '#000000',
  hideButtonColor: '#dd5c18',
  fov: 35,
})

export { state }
