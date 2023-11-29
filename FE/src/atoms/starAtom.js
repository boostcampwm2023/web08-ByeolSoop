import { atom } from "recoil";

const starAtom = atom({
  key: "starState",
  default: {
    mode: "create",
    selected: null,
  },
});

export default starAtom;
