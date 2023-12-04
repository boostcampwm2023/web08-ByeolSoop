import { atom } from "recoil";

const starAtom = atom({
  key: "starState",
  default: {
    mode: "create",
    drag: true,
    selected: null,
  },
});

export default starAtom;
