import { atom } from "recoil";

const headerAtom = atom({
  key: "headerState",
  default: {
    isLogin: false,
    isSignUp: false,
    isSideBar: false,
  },
});

export default headerAtom;
