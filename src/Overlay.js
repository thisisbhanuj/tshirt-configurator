import React, { useState } from 'react'
import {
  AiOutlineHighlight,
  AiOutlineShoppingCart,
  AiOutlineArrowLeft,
  AiOutlineReload
} from 'react-icons/ai'
import { useSnapshot } from 'valtio'
import { motion, AnimatePresence } from 'framer-motion'

import Tab from './Tab'
import FilePicker from './FilePicker'
import ZoomSlider from './ZoomSlider'
import TextInput from './TextInput'
import { reader } from './helpers';
import { DecalTypes, EditorTabs } from './constants';
import { slideAnimation } from './motion'
import { state } from './store'

export default function Overlay() {
  const snap = useSnapshot(state)

  const transition = { type: 'spring', duration: 0.8 }

  const config = {
    initial: { x: -100, opacity: 0, transition: { ...transition, delay: 0.5 } },
    animate: { x: 0, opacity: 1, transition: { ...transition, delay: 0 } },
    exit: { x: -100, opacity: 0, transition: { ...transition, delay: 0 } }
  }

  return (
    <div className="container">
      <motion.header
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 1.8, delay: 1 }}>
      </motion.header>

      <AnimatePresence>
        {snap.intro ? (
          <Intro key="main" config={config} />
        ) : (
            <div>
                <Customizer key="custom" config={config} />      
            </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Intro({ config }) {
  return (
    <motion.section {...config} >
       <motion.header {...slideAnimation("down")}>
            {/* <img 
              src='./threejs.png'
              alt="logo"
              className="w-8 h-8 object-contain"
            /> */}
      </motion.header>
      <div className="home">
        <div>
          <h1 className="head-text">
            LET'S <br className="xl:block hidden" /> DO IT!
          </h1>
        </div>
        <div className="home--content">
          <div>
            <p className='home-content-para'>
              Customize unique and exclusive T-Shirt...Unleash your imagination and define your own style.
            </p>
            <br></br>
            <br></br>
            <button
              style={{ background: 'black' }}
              onClick={() => (state.intro = false)}>
                BEGIN <AiOutlineHighlight size="1.3em" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function isSelectedTexture(texture) {
  return state.selectedTextures.some((item) => item.texture === texture);
}

function Customizer({ config }) {
  const snap = useSnapshot(state);

  const [zoom, setZoom] = useState(35);
  const handleZoomChange = (value) => {
    state.fov = value;
    setZoom(value);
  };

  const [file, setFile] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState("");

  const [textureVisibility, setTextureVisibility] = useState({});
  const toggleTexture = (texture) => {
    setTextureVisibility((prevVisibility) => ({
      ...prevVisibility,
      [texture]: !prevVisibility[texture], // Toggle the visibility
    }));
  };

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "textPicker":
        return <TextInput
          onTextSubmit={handleTextSubmit} 
        />
      default:
        return null;
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    let position = [0, 0, 0];
    let scale = .06;
    let rotation;

    switch (type) {
      case "logo":
        state.isLogoSelected = true;
        position = [0.08, 0.11, 0.1];
        scale = .07;
        break;
      case "poster":
        state.isPosterSelected = true;
        position = [0, -0.075, 0.21];
        scale = .3; 
        break;
      case "back":
        state.isBackPosterSelected = true;
        position = [0, -0.075, -0.21];
        rotation=[0, Math.PI, 0];
        scale = .3; 
        break;
      case "text":
        state.customText = result;
        state.isTextSelected = true;
        position = [-0.005, -0.002, 0.1];
        scale = 0.1;
        break;
      default:
        break;
    }

    state.selectedTextures.push({
      texture: type,
      position: position,
      rotation: rotation ? rotation : [0, 0, 0],
      scale: scale,
    });
  }

  const handleTextSubmit = (text) => {
    if (!!text) {
      handleDecals('text', text);
      setActiveEditorTab("");
    } else {

    }
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  return (
    <motion.section {...config}>
      <div className="customizer">

        <div className="color-options">
          {snap.colors.map((color) => (
            <div
              key={color}
              className="circle"
              style={{ background: color }}
              onClick={() => (state.selectedColor = color)}></div>
          ))}
        </div>

        <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
        >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                  {EditorTabs.map((tab) => (
                    <Tab 
                      key={tab.name}
                      tab={tab}
                      handleClick={() => setActiveEditorTab(tab.name)}
                    />
                  ))}
                {generateTabContent()}
              </div>
            </div>
        </motion.div>

        <div className="decals">
          <div className="decals--container">
            {snap.textures.map((texture) => {
              const isSelected = isSelectedTexture(texture);
              const isTextureVisible = textureVisibility[texture] || false; // Default to false if not set

              return (
                <div
                  key={texture}
                  className={`decal ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    const selectedTextures = state.selectedTextures.slice();
                    if (isSelected) {
                      const index = selectedTextures.findIndex((item) => item.texture === texture);
                      if (index !== -1) {
                        selectedTextures.splice(index, 1); // Remove the texture if already selected
                      }
                    } else {
                      // Add the texture and its associated mapping information as an object
                      let position = [];
                      let scale = 0;
                      let rotation;

                      if (texture === 'logo') {
                        state.isLogoSelected = true;
                        position = [0.08, 0.11, 0.1];
                        scale = 0.07;
                      } else if (texture === 'poster') {
                        state.isPosterSelected = true;
                        position = [0, -0.075, 0.21];
                        scale = 0.3;
                      } else if (texture === 'back') {
                        state.selectedPosterDecal = 'poster.png';
                        state.isBackPosterSelected = true;
                        position = [0, -0.075, -0.21];
                        rotation = [0, Math.PI, 0];
                        scale = 0.3;
                      }

                      selectedTextures.push({
                        texture: texture,
                        position: position,
                        rotation: rotation ? rotation : [0, 0, 0],
                        scale: scale,
                      });
                    }

                    state.selectedTextures = selectedTextures;

                    // Toggle visibility when clicked
                    toggleTexture(texture);
                  }}
                >
                  <button
                    className='button font-extralight text-[10px]'
                    style={{
                      background: isTextureVisible
                        ? snap.hideButtonColor
                        : snap.showButtonColor,
                    }}
                  >
                    {isTextureVisible ? `HIDE ${texture}` : `SHOW ${texture}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="cart"
          style={{ background: snap.showButtonColor }}
          onClick={() => {
            const link = document.createElement('a')
            link.setAttribute('download', 'canvas.png')
            link.setAttribute(
              'href',
              document
                .querySelector('canvas')
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream')
            )
            link.click()
          }}>
          SAVE
          <AiOutlineShoppingCart size="1.3em" />
        </button>

        <button
            className="flip"
            style={{ background: snap.showButtonColor }}
            onClick={() => {
                state.isFlipped = !state.isFlipped;
            }}>
            FLIP
            <AiOutlineReload size="1.3em" />
        </button>

        <button
            className="exit"
            style={{ background: snap.showButtonColor }}
            onClick={() => (state.intro = true)}>
            <AiOutlineArrowLeft size="1.3em" />
        </button>

        <ZoomSlider zoom={zoom} onZoomChange={handleZoomChange} />

      </div>
    </motion.section>
  )
}
