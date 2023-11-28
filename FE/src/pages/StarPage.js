/* eslint-disable react/no-unknown-property */

import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import diaryAtom from "../atoms/diaryAtom";
import userAtom from "../atoms/userAtom";

function StarPage() {
  return (
    <CanvasContainer>
      <Canvas
        camera={{
          position: [-1, -1, -1],
        }}
      >
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
  const [DiaryState, setDiaryState] = useRecoilState(diaryAtom);
  const userState = useRecoilValue(userAtom);

  const {
    data: DiaryList,
    isLoading,
    refetch,
  } = useQuery("diaryList", () =>
    fetch("http://223.130.129.145:3005/diaries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userState.accessToken}`,
      },
    }).then((res) => res.json()),
  );

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

  useEffect(() => {
    refetch();
  }, [DiaryState]);

  if (isLoading) return null;

  return (
    <>
      <mesh
        onClick={() => {
          setDiaryState((prev) => ({
            ...prev,
            isRead: false,
          }));
        }}
        onDoubleClick={(e) => {
          moveToStar(e, () => {
            setDiaryState((prev) => ({
              ...prev,
              isCreate: true,
              isRead: false,
              diaryPoint: `${e.point.x},${e.point.y},${e.point.z}`,
            }));
          });
        }}
      >
        <sphereGeometry args={[30, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          emissive={0x13275a}
          emissiveIntensity={0.8}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[3]} />
        <meshStandardMaterial transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      {DiaryList.map((diary) => (
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
      onClick={(e) => {
        e.stopPropagation();
        setDiaryState((prev) => ({
          ...prev,
          isCreate: false,
          isRead: false,
          diaryUuid: uuid,
        }));
        moveToStar(e, () => {
          setDiaryState((prev) => ({
            ...prev,
            isCreate: false,
            isRead: true,
          }));
        });
      }}
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
  background-color: #000000ee;

  position: absolute;
  top: 0;
  left: 0;
`;

export default StarPage;
