import { atom } from "recoil";

const userAtom = atom({
  key: "userState",
  default: {
    isLogin: false,
  },
});

export default userAtom;
