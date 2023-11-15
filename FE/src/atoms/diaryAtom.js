import { atom } from "recoil";

const diaryAtom = atom({
  key: "diaryState",
  default: {
    isCreate: false,
    isRead: false,
  },
});

export default diaryAtom;
