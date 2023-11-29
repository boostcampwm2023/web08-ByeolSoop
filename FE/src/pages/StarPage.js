/* eslint-disable react/no-unknown-property */

import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import diaryAtom from "../atoms/diaryAtom";
import starAtom from "../atoms/starAtom";

function StarPage() {
  return (
    <CanvasContainer>
      <Canvas
        camera={{
          position: [-1, -1, -1],
        }}
      >
        <ambientLight />
        <OrbitControls
          enablePan={false}
          enableDamping={false}
          enableZoom={false}
          target={[0, 0, 0]}
        />
        <StarView />
      </Canvas>
    </CanvasContainer>
  );
}

function StarView() {
  const { scene, raycaster, camera } = useThree();
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const { mode } = useRecoilValue(starAtom);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color("#656990") },
      color2: { value: new THREE.Color("#182683") },
      gradientStart: { value: 0.001 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float gradientStart;
      varying vec2 vUv;
      void main() {
        vec3 finalColor = mix(
          color1,
          color2,
          smoothstep(gradientStart, gradientStart + 0.15, vUv.y)
        );
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });

  const moveToStar = async (e, fn) => {
    raycaster.set(new THREE.Vector3(0, 0, 0), e.point);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const [ntx, nty, ntz] = intersects[0].point.toArray().map((v) => -v);
      const targetPosition = new THREE.Vector3(ntx, nty, ntz);

      const animate = () => {
        const currentPosition = camera.position.clone();
        const direction = targetPosition.clone().sub(currentPosition);
        const distance = direction.length();

        if (distance > 0.05) {
          const moveDistance = Math.min(0.05, distance);
          direction.normalize().multiplyScalar(moveDistance);
          camera.position.add(direction);
          requestAnimationFrame(animate);
        } else {
          fn(e.point.toArray());
        }
      };

      animate();
    }
  };

  const clickOnCreate = () => {
    setDiaryState((prev) => ({
      ...prev,
      isRead: false,
    }));
  };

  const doubleClickOnCreate = (e) => {
    setDiaryState((prev) => ({
      ...prev,
      isCreate: false,
      isRead: false,
      diaryPoint: `${e.point.x},${e.point.y},${e.point.z}`,
    }));

    moveToStar(e, () => {
      setDiaryState((prev) => ({
        ...prev,
        isCreate: true,
        isRead: false,
      }));
    });
  };

  return (
    <>
      <mesh
        onClick={mode === "create" ? clickOnCreate : null}
        onDoubleClick={mode === "create" ? doubleClickOnCreate : null}
      >
        <sphereGeometry args={[30, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={material} attach='material' side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3]} />
        <meshStandardMaterial transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      {diaryState.diaryList?.map((diary) => (
        <Star
          key={[diary.coordinate.x, diary.coordinate.y, diary.coordinate.z]}
          uuid={diary.uuid}
          position={[
            diary.coordinate.x,
            diary.coordinate.y,
            diary.coordinate.z,
          ]}
          moveToStar={moveToStar}
        />
      ))}
    </>
  );
}

function Star(props) {
  const { uuid, position, moveToStar } = props;
  const setDiaryState = useSetRecoilState(diaryAtom);
  const { mode } = useRecoilValue(starAtom);

  const clickOnCreate = (e) => {
    e.stopPropagation();
    setDiaryState((prev) => ({
      ...prev,
      isCreate: false,
      isRead: false,
      diaryUuid: uuid,
      diaryPoint: `${e.point.x},${e.point.y},${e.point.z}`,
    }));
    moveToStar(e, () => {
      setDiaryState((prev) => ({
        ...prev,
        isCreate: false,
        isRead: true,
      }));
    });
  };

  return (
    <mesh
      position={position}
      onPointerEnter={(e) => {
        e.stopPropagation();
        e.object.scale.set(1.5, 1.5, 1.5);
        e.object.material.emissiveIntensity = 1;
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        e.object.scale.set(1, 1, 1);
        e.object.material.emissiveIntensity = 0.7;
      }}
      onClick={mode === "create" ? clickOnCreate : null}
    >
      <Sphere args={[0.2]}>
        <meshStandardMaterial emissive={0xffffff} emissiveIntensity={0.7} />
      </Sphere>
    </mesh>
  );
}

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000000;

  position: absolute;
  top: 0;
  left: 0;
`;

export default StarPage;
