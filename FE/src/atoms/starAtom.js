import { atom } from "recoil";

const starAtom = atom({
  key: "starState",
  default: {
    mode: "create",
    drag: true,
    selected: null,
    points: [],
  },
});

export default starAtom;
