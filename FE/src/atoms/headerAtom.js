import { atom } from "recoil";

const headerAtom = atom({
  key: "headerState",
  default: {
    isLogin: false,
    isSignUp: false,
  },
});

export default headerAtom;
