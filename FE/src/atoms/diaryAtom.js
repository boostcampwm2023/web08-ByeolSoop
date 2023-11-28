import { atom } from "recoil";

const diaryAtom = atom({
  key: "diaryState",
  default: {
    isCreate: false,
    isRead: false,
    isUpdate: false,
    isDelete: false,
    isList: false,
    diaryUuid: "",
    diaryPoint: "",
    isLoaded: false,
  },
});

export default diaryAtom;
