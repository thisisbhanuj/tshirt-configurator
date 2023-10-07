import React, {useRef} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { easing } from 'maath'
import {
  useGLTF,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  useTexture,
  Decal
} from '@react-three/drei'

import { useSnapshot } from 'valtio'
import { state } from './store'
import {createTextTexture} from './helpers'

export const App = ({ position = [0, 0, 0], fov = 35 }) => {
  const snap = useSnapshot(state)
  const fovState = snap.fov ? snap.fov : fov;
  return (
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position, fovState }}
        eventSource={document.getElementById('root')}
        eventPrefix="client">
        
        <ambientLight intensity={1.4} />
    
        <CameraRig>
          <Backdrop />
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
      </Canvas>
    )
}

function Shirt(props) {
  const snap = useSnapshot(state);
  const selectedLogoDecal = useTexture(snap.selectedLogoDecal);
  const selectedPosterDecal = useTexture(snap.selectedPosterDecal);
  const selectedBackPosterDecal = useTexture(snap.selectedPosterDecal);
  const selectedTextDecal = createTextTexture(snap.customText);

  const { nodes, materials } = useGLTF('/shirt_baked.glb');

  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, snap.selectedColor, 0.25, delta)
  )

  const stateString = JSON.stringify(snap);

  return (
    <group key={stateString}>
        <mesh
            castShadow
            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}
            material-roughness={1}
            {...props}
            dispose={null}
            rotation={snap.isFlipped ? [0, Math.PI, 0] : [0, 0, 0]}>

              {state.selectedTextures.map((selectedTexture) => (
                <Decal
                  key={selectedTexture.texture}
                  position={selectedTexture.position}
                  rotation={selectedTexture.rotation}
                  scale={selectedTexture.scale}
                  depthTest={false}
                  depthWrite={true}
                  map={
                    selectedTexture.texture === 'logo' ? selectedLogoDecal : 
                    selectedTexture.texture === 'poster' ? selectedPosterDecal : 
                    selectedTexture.texture === 'back' ? selectedBackPosterDecal : 
                    selectedTexture.texture === 'text' ? selectedTextDecal : null
                  }
                />
              ))}

        </mesh>
    </group>
  )
}

function Backdrop() {
  const shadows = useRef()

  useFrame((state, delta) =>
    easing.dampC(
      shadows.current.getMesh().material.color,
      state.selectedColor,
      0.2,
      delta
    )
  )

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}>

      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.25}  // background color
        ambient={0.25}
        position={[5, 5, -10]}
      />

      <RandomizedLight
        amount={1}
        radius={5}
        intensity={1.5} // background color
        ambient={0.25}
        position={[-5, 5, -9]}
      />
      
    </AccumulativeShadows>
  )
}

function CameraRig({ children }) {
  const group = useRef()
  const snap = useSnapshot(state)

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // set the initial position of the model
    let targetPosition = [-0.4, 0, 2];
    if(snap.intro) {
      if(isBreakpoint) targetPosition = [0, 0, 2];
      if(isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if(isMobile) targetPosition = [0, 0, 2.5]
      else targetPosition = [0, 0, 2];
    }

    // set model camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta)

    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    )
  })
  return (
    <group ref={group}>
      <PerspectiveCamera makeDefault fov={snap.fov} position={[0, 0, 0]} />
      <OrbitControls  
          minPolarAngle={-Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={1}/>
      {children}
    </group>
  );
}

useGLTF.preload('/shirt_baked.glb');
//['/react.png', '/threejs.png'].forEach(useTexture.preload)
