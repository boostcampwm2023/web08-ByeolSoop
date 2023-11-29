import { atom } from "recoil";

const starAtom = atom({
  key: "starState",
  default: {
    mode: "edit",
    selected: null,
    points: [],
  },
});

export default starAtom;
