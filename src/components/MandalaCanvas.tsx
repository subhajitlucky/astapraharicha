// @ts-nocheck
// Type checking disabled due to React 19 + @react-three/fiber type performance issues
"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePrahariStore } from "@/store/prahariStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ShaderPlaneProps {
  primaryColor: string;
  secondaryColor: string;
  intensity: number;
  reducedMotion: boolean;
}

function ShaderPlane({ primaryColor, secondaryColor, intensity, reducedMotion }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(primaryColor) },
    uColor2: { value: new THREE.Color(secondaryColor) },
    uIntensity: { value: intensity },
    uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
  }), [primaryColor, secondaryColor, intensity, viewport.width, viewport.height]);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uColor1.value.set(primaryColor);
      material.uniforms.uColor2.value.set(secondaryColor);
      material.uniforms.uIntensity.value = intensity;
    }
  }, [primaryColor, secondaryColor, intensity]);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uIntensity;
    uniform vec2 uResolution;
    varying vec2 vUv;
    
    #define PI 3.14159265359
    
    mat2 rotate(float a) {
      float s = sin(a);
      float c = cos(a);
      return mat2(c, -s, s, c);
    }

    float getMandala(vec2 uv, float petals, float time, float layer) {
      float angle = atan(uv.y, uv.x);
      float radius = length(uv);
      
      float d = sin(angle * petals + time * (0.1 * uIntensity * layer)) * 0.1;
      float pattern = smoothstep(0.01, 0.0, abs(radius - (0.4 + layer * 0.2 + d)));
      
      // Secondary geometric lines
      float lines = sin(angle * (petals * 2.0) - time * 0.05) * 0.5 + 0.5;
      pattern += smoothstep(0.01, 0.0, abs(radius - (0.3 + layer * 0.15))) * lines * 0.5;
      
      return pattern;
    }
    
    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uResolution.x / uResolution.y;
      
      float radius = length(uv);
      float time = uTime * 0.5;
      
      float finalPattern = 0.0;
      
      // Three layers of geometry
      finalPattern += getMandala(uv, 8.0, time, 0.0);
      finalPattern += getMandala(rotate(PI/8.0) * uv, 16.0, -time * 0.7, 0.5);
      finalPattern += getMandala(rotate(-PI/4.0) * uv, 4.0, time * 1.2, 1.0);
      
      // Central core glow
      float core = smoothstep(0.15, 0.0, radius);
      finalPattern += core * (sin(time * 2.0) * 0.5 + 0.5);
      
      // Breathing effect
      float breathe = sin(uTime * 0.5) * 0.5 + 0.5;
      finalPattern *= mix(0.6, 1.0, breathe);
      
      vec3 color = mix(uColor1, uColor2, finalPattern);
      
      // Outer glow/aura
      float aura = smoothstep(1.5, 0.2, radius);
      color += uColor2 * finalPattern * 0.5;
      
      // Darken edges significantly
      float vignette = smoothstep(1.8, 0.4, radius);
      color *= vignette;
      
      gl_FragColor = vec4(color, 0.5);
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      // When reduced motion is enabled, freeze the animation at time 0
      material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width * 2, viewport.height * 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function MandalaCanvas() {
  const { currentPrahari } = usePrahariStore();
  const reducedMotion = useReducedMotion();
  
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 1);
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <ShaderPlane 
          primaryColor={currentPrahari.colors.primary}
          secondaryColor={currentPrahari.colors.secondary}
          intensity={currentPrahari.intensity}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}