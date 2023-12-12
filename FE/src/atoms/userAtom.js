import { atom } from "recoil";

const userAtom = atom({
  key: "userState",
  default: {
    isLogin: false,
    accessToken: "",
    nickname: "",
    isPremium: false,
  },
});

export default userAtom;
