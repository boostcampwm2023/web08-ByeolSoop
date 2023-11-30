/* eslint-disable react/no-unknown-property */

import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import diaryAtom from "../atoms/diaryAtom";
import shapeAtom from "../atoms/shapeAtom";
import starAtom from "../atoms/starAtom";
import SwitchButton from "../components/Button/SwitchButton";
import ModalWrapper from "../styles/Modal/ModalWrapper";
import hand from "../assets/hand.svg";
import stella from "../assets/stella.svg";
import arrow from "../assets/arrow.svg";
import paint from "../assets/paint.svg";

function StarPage() {
  const [starState, setStarState] = useRecoilState(starAtom);

  return (
    <>
      <CanvasContainer>
        <Canvas
          camera={{
            position: [-1, -1, -1],
          }}
        >
          <ambientLight />
          <OrbitControls
            enabled={starState.drag}
            enablePan={false}
            enableDamping={false}
            enableZoom={false}
            target={[0, 0, 0]}
          />
          <StarView />
        </Canvas>
      </CanvasContainer>
      <SwitchButton
        bottom='3rem'
        right='3rem'
        leftContent='일기 생성'
        rightContent='별자리 편집'
        leftEvent={() => {
          setStarState((prev) => ({
            ...prev,
            mode: "create",
            drag: true,
          }));
        }}
        rightEvent={() => {
          setStarState((prev) => ({
            ...prev,
            mode: "edit",
            drag: false,
          }));
        }}
      />
      {starState.mode === "edit" ? (
        <ModalWrapper
          width='25rem'
          height='3rem'
          top='90%'
          borderRadius='3rem'
          paddingTop='1.5rem'
          paddingBottom='1.5rem'
        >
          <DockWrapper>
            <DockContent>
              <img src={hand} alt='hand' />
              화면 이동
            </DockContent>
            <DockContent>
              <img src={stella} alt='stella' />
              별자리 수정
            </DockContent>
            <DockContent>
              <img src={arrow} alt='arrow' />별 이동
            </DockContent>
            <DockContent>
              <img src={paint} alt='paint' />
              스킨 변경
            </DockContent>
          </DockWrapper>
        </ModalWrapper>
      ) : null}
    </>
  );
}

function StarView() {
  const { scene, raycaster, camera } = useThree();
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const { mode, points } = useRecoilValue(starAtom);
  const shapeState = useRecoilValue(shapeAtom);
  const [texture, setTexture] = useState({});

  useEffect(() => {
    const newTexture = {};
    shapeState.forEach((shape) => {
      const blob = new Blob([shape.data], { type: "image/svg+xml" });
      const urlObject = URL.createObjectURL(blob);
      const loader = new THREE.TextureLoader();
      const svgTexture = loader.load(urlObject);
      newTexture[shape.uuid] = svgTexture;
    });
    setTexture(newTexture);
  }, [shapeState]);

  // const shapeData = shapeState.find((shape)
  // => shape.uuid === shapeUuid)?.data;
  // const blob = new Blob([shapeData], { type: "image/svg+xml" });
  // const urlObject = URL.createObjectURL(blob);

  // const loader = new THREE.TextureLoader();
  // const svgTexture = loader.load(urlObject);

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
      diaryPoint: `${e.point.x * 100000},${e.point.y * 100000},${
        e.point.z * 100000
      }`,
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
      <mesh>
        <sphereGeometry
          args={[30, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.98]}
        />
        <primitive object={material} attach='material' side={THREE.BackSide} />
      </mesh>
      <mesh
        onClick={mode === "create" ? clickOnCreate : null}
        onDoubleClick={mode === "create" ? doubleClickOnCreate : null}
      >
        <sphereGeometry args={[29]} />
        <meshStandardMaterial transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3]} />
        <meshStandardMaterial transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      {Object.keys(texture).length > 0
        ? diaryState.diaryList?.map((diary) => (
            <Star
              key={[diary.coordinate.x, diary.coordinate.y, diary.coordinate.z]}
              uuid={diary.uuid}
              position={[
                diary.coordinate.x,
                diary.coordinate.y,
                diary.coordinate.z,
              ]}
              sentiment={diary.emotion.sentiment}
              texture={texture[diary.shapeUuid]}
              moveToStar={moveToStar}
            />
          ))
        : null}
      {points.map((point) => (
        <Line
          key={[...point[0].position, ...point[1].position]}
          point={point}
        />
      ))}
    </>
  );
}

function Star(props) {
  const { uuid, position, sentiment, texture, moveToStar } = props;
  const setDiaryState = useSetRecoilState(diaryAtom);
  const [starState, setStarState] = useRecoilState(starAtom);
  const { mode, selected } = starState;

  const clickOnCreate = (e) => {
    e.stopPropagation();
    setDiaryState((prev) => ({
      ...prev,
      isCreate: false,
      isRead: false,
      diaryUuid: uuid,
      diaryPoint: `${position[0] * 100000},${position[1] * 100000},${
        position[2] * 100000
      }`,
    }));
    moveToStar(e, () => {
      setDiaryState((prev) => ({
        ...prev,
        isCreate: false,
        isRead: true,
      }));
    });
  };

  const clickOnEdit = (e) => {
    e.stopPropagation();

    if (!selected) {
      setStarState((prev) => ({
        ...prev,
        selected: { uuid, position },
      }));
    } else {
      const isExist =
        starState.points.some(
          (point) => point[0].uuid === selected.uuid && point[1].uuid === uuid,
        ) ||
        starState.points.some(
          (point) => point[0].uuid === uuid && point[1].uuid === selected.uuid,
        );

      if (isExist) {
        setStarState((prev) => ({
          ...prev,
          selected: null,
          points: prev.points.filter(
            (point) =>
              (point[0].uuid !== selected.uuid || point[1].uuid !== uuid) &&
              (point[0].uuid !== uuid || point[1].uuid !== selected.uuid),
          ),
        }));
      } else {
        setStarState((prev) => ({
          ...prev,
          selected: null,
          points: [...prev.points, [selected, { uuid, position }]],
        }));
      }
    }
  };

  // 긍정 - 00ccff, 부정 - d1180b, 중립 - ba55d3
  const sentimentColor = {
    positive: "#00ccff",
    negative: "#d1180b",
    neutral: "#ba55d3",
  }[sentiment];
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(sentimentColor) },
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
        float distance = length(vUv - vec2(0.5));
        vec3 finalColor = mix(
          color1,
          color2,
          smoothstep(gradientStart, gradientStart + 0.57, distance)
        );

        if (distance < gradientStart) {
            finalColor = vec3(0.0, 0.0, 0.0);
        }

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });

  return (
    <>
      <mesh
        rotation={new THREE.Euler().setFromRotationMatrix(
          new THREE.Matrix4().lookAt(
            new THREE.Vector3(),
            new THREE.Vector3(...position),
            new THREE.Vector3(0, 1, 0), // Up vector
          ),
        )}
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
        onClick={mode === "create" ? clickOnCreate : clickOnEdit}
      >
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      <mesh
        rotation={new THREE.Euler().setFromRotationMatrix(
          new THREE.Matrix4().lookAt(
            new THREE.Vector3(),
            new THREE.Vector3(...position),
            new THREE.Vector3(0, 1, 0), // Up vector
          ),
        )}
        position={position.map((p) => p * 1.01)}
      >
        <circleGeometry args={[0.6, 32]} />
        <primitive object={material} attach='material' />
      </mesh>
    </>
  );
}

function Line(props) {
  const { point } = props;

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(
    point.map(
      (each) => new THREE.Vector3(...each.position.map((p) => p * 1.01)),
    ),
  );

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        attach='material'
        color='#9c88ff'
        linewidth={0.1}
        linecap='round'
        linejoin='round'
      />
    </line>
  );
}

const DockWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const DockContent = styled.div`
  width: 50%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  cursor: pointer;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000000;

  position: absolute;
  top: 0;
  left: 0;
`;

export default StarPage;
