import { atom } from "recoil";

const diaryAtom = atom({
  key: "diaryState",
  default: {
    isCreate: false,
    isRead: false,
    isDelete: false,
    isList: false,
    diaryUuid: "1",
  },
});

export default diaryAtom;
