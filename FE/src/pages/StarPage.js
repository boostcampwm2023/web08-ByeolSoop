/* eslint-disable react/no-unknown-property */

import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import diaryAtom from "../atoms/diaryAtom";
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
  const { uuid, position, moveToStar } = props;
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
      onClick={mode === "create" ? clickOnCreate : clickOnEdit}
    >
      <Sphere args={[0.2]}>
        <meshStandardMaterial emissive={0xffffff} emissiveIntensity={0.7} />
      </Sphere>
    </mesh>
  );
}

function Line(props) {
  const { point } = props;

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(
    point.map((p) => new THREE.Vector3(...p.position)),
  );

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        attach='material'
        color='#9c88ff'
        linewidth={10}
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
