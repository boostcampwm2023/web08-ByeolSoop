import { atom } from "recoil";

const lastPageAtom = atom({
  key: "lastPageState",
  default: [],
});

export default lastPageAtom;
