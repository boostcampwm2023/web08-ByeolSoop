/* eslint-disable react/no-unknown-property */

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import * as THREE from "three";
import diaryAtom from "../atoms/diaryAtom";
import userAtom from "../atoms/userAtom";
import shapeAtom from "../atoms/shapeAtom";
import starAtom from "../atoms/starAtom";
import lastPageAtom from "../atoms/lastPageAtom";
import SwitchButton from "../components/Button/SwitchButton";
import ModalWrapper from "../styles/Modal/ModalWrapper";
import hand from "../assets/hand.svg";
import stella from "../assets/stella.svg";
import arrow from "../assets/arrow.svg";
import paint from "../assets/paint.svg";

function StarPage({ refetch }) {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const [starState, setStarState] = useRecoilState(starAtom);

  return (
    <>
      <CanvasContainer>
        <Canvas
          camera={{
            position: [
              -0.5 / Math.sqrt(3),
              -0.5 / Math.sqrt(3),
              -0.5 / Math.sqrt(3),
            ],
          }}
        >
          <directionalLight intensity={0.037} />
          <ambientLight intensity={0.01} />
          <OrbitControls
            enabled={starState.drag}
            enablePan={false}
            enableDamping={false}
            enableZoom={false}
            target={[0, 0, 0]}
            rotateSpeed={-0.25}
          />
          <StarView refetch={refetch} />
        </Canvas>
      </CanvasContainer>
      {!(
        diaryState.isList ||
        diaryState.isAnalysis ||
        diaryState.isPurchase
      ) ? (
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
              selected: null,
            }));
          }}
          rightEvent={() => {
            setDiaryState((prev) => ({
              ...prev,
              isCreate: false,
              isRead: false,
              isUpdate: false,
              isDelete: false,
            }));
            setStarState((prev) => ({
              ...prev,
              mode: "stella",
              drag: false,
              selected: null,
            }));
          }}
        />
      ) : null}
      {starState.mode !== "create" ? (
        <ModalWrapper
          width='25rem'
          height='3rem'
          $top='90%'
          $borderRadius='3rem'
          $paddingTop='1.5rem'
          $paddingBottom='1.5rem'
        >
          <DockGuide>
            {
              {
                move: "밤하늘을 드래그하여 시점을 이동해 보세요.",
                stella:
                  "두 개의 별을 순서대로 클릭하여 별자리 선을 만들어 보세요.",
                starMove:
                  "별을 클릭한 후 빈 공간을 클릭하여 별을 이동시켜 보세요.",
              }[starState.mode]
            }
          </DockGuide>
          <DockWrapper>
            <DockContent
              selected={starState.mode === "move"}
              onClick={() => {
                setStarState((prev) => ({
                  ...prev,
                  mode: "move",
                  drag: true,
                  selected: null,
                }));
              }}
            >
              <img src={hand} alt='hand' />
              화면 이동
            </DockContent>
            <DockContent
              selected={starState.mode === "stella"}
              onClick={() => {
                setStarState((prev) => ({
                  ...prev,
                  mode: "stella",
                  drag: false,
                  selected: null,
                }));
              }}
            >
              <img src={stella} alt='stella' />
              별자리 수정
            </DockContent>
            <DockContent
              selected={starState.mode === "starMove"}
              onClick={() => {
                setStarState((prev) => ({
                  ...prev,
                  mode: "starMove",
                  drag: false,
                  selected: null,
                }));
              }}
            >
              <img src={arrow} alt='starMove' />별 이동
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

function Scene() {
  const fbx = useFBX("/maintest.fbx");

  return (
    <primitive
      object={fbx}
      scale={0.005}
      position={[0, Math.cos(Math.PI / 1.98) * 20, 0]}
    />
  );
}

function StarView({ refetch }) {
  const { scene, raycaster, camera } = useThree();
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const userState = useRecoilValue(userAtom);
  const [starState, setStarState] = useRecoilState(starAtom);
  const { mode, selected } = starState;
  const shapeState = useRecoilValue(shapeAtom);
  const [texture, setTexture] = useState({});

  const { data: points, refetch: pointsRefetch } = useQuery(
    "points",
    () =>
      fetch(`${process.env.REACT_APP_BACKEND_URL}/lines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.accessToken}`,
        },
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        data.forEach((point) => {
          const { first, second } = point;
          first.coordinate.x /= 100000;
          first.coordinate.y /= 100000;
          first.coordinate.z /= 100000;
          second.coordinate.x /= 100000;
          second.coordinate.y /= 100000;
          second.coordinate.z /= 100000;
        });
      },
    },
  );

  async function updateDiaryFn(data) {
    setDiaryState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/diaries`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify(data.diaryData),
    }).then(() => {
      refetch();
      pointsRefetch();
      setStarState((prev) => ({
        ...prev,
        selected: null,
      }));
    });
  }

  const {
    mutate: updateDiary,
    // isLoading: diaryIsLoading,
    // isError: diaryIsError,
  } = useMutation(updateDiaryFn);

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
      // color1: { value: new THREE.Color("#656990") },
      // color2: { value: new THREE.Color("#182683") },
      color1: { value: new THREE.Color("#454980") },
      color2: { value: new THREE.Color("#182663") },
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

        if (distance > 0.005) {
          const moveDistance = Math.min(0.005, distance);
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

  const clickOnStarMove = (e) => {
    if (selected) {
      const selectedDiary = diaryState.diaryList.find(
        (diary) => diary.uuid === selected.uuid,
      );

      updateDiary({
        accessToken: userState.accessToken,
        diaryData: {
          uuid: selected.uuid,
          title: selectedDiary.title,
          content: selectedDiary.content,
          date: selectedDiary.date,
          point: `${e.point.x * 100000},${e.point.y * 100000},${
            e.point.z * 100000
          }`,
          tags: selectedDiary.tags,
          shapeUuid: selectedDiary.shapeUuid,
        },
      });
    }
  };

  return (
    <>
      <Scene />
      <mesh>
        <sphereGeometry
          args={[30, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.98]}
        />
        <primitive object={material} attach='material' side={THREE.BackSide} />
      </mesh>
      <mesh
        onClick={mode === "starMove" ? clickOnStarMove : null}
        onDoubleClick={mode === "create" ? doubleClickOnCreate : null}
      >
        <sphereGeometry
          args={[29, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.98]}
        />
        <meshStandardMaterial transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.5]} />
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
              points={points}
              refetch={pointsRefetch}
            />
          ))
        : null}
      {points?.map((point) => (
        <Line
          key={point.id}
          point={[point.first.coordinate, point.second.coordinate]}
        />
      ))}
    </>
  );
}

function Star(props) {
  const { uuid, position, sentiment, texture, moveToStar, points, refetch } =
    props;
  const setDiaryState = useSetRecoilState(diaryAtom);
  const userState = useRecoilValue(userAtom);
  const [starState, setStarState] = useRecoilState(starAtom);
  const setLastPageState = useSetRecoilState(lastPageAtom);
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
    setLastPageState((prev) => [...prev, "main"]);
  };

  async function createLineFn(data) {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/lines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify({
        uuid1: data.uuid1,
        uuid2: data.uuid2,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        refetch();
      });
  }

  async function deleteLineFn(data) {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/lines/${data.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
    }).then(() => {
      refetch();
    });
  }

  const { mutate: createLine } = useMutation(createLineFn);

  const { mutate: deleteLine } = useMutation(deleteLineFn);

  const clickOnStella = (e) => {
    e.stopPropagation();

    if (!selected) {
      setStarState((prev) => ({
        ...prev,
        selected: { uuid, position },
      }));
    } else {
      const isExist = points.find(
        (point) =>
          (point.first.uuid === selected.uuid && point.second.uuid === uuid) ||
          (point.first.uuid === uuid && point.second.uuid === selected.uuid),
      );

      setStarState((prev) => ({
        ...prev,
        selected: null,
      }));

      if (isExist) {
        deleteLine({
          id: isExist.id,
          accessToken: userState.accessToken,
        });
      } else {
        createLine({
          uuid1: selected.uuid,
          uuid2: uuid,
          accessToken: userState.accessToken,
        });
      }
    }
  };

  const clickOnStarMove = (e) => {
    e.stopPropagation();

    setStarState((prev) => ({
      ...prev,
      selected: { uuid, position },
    }));
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
        onClick={(e) => {
          if (mode === "create") {
            clickOnCreate(e);
          } else if (mode === "stella") {
            clickOnStella(e);
          } else if (mode === "starMove") {
            clickOnStarMove(e);
          }
        }}
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
      (each) => new THREE.Vector3(each.x * 1.01, each.y * 1.01, each.z * 1.01),
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

const DockGuide = styled.div`
  width: 100%;
  transform: translate(-50%, -50%);

  position: fixed;
  top: -20%;
  left: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #ffffffbb;
  font-size: 1rem;
`;

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
  height: 150%;
  background-color: ${(props) =>
    props.selected ? "rgba(255, 255, 255, 0.2)" : "transparent"};
  border-radius: 1.5rem;

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
