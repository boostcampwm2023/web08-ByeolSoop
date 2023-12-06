import { atom } from "recoil";

const diaryAtom = atom({
  key: "diaryState",
  default: {
    isCreate: false,
    isRead: false,
    isUpdate: false,
    isDelete: false,
    isList: false,
    isAnalysis: false,
    diaryUuid: "",
    diaryPoint: "",
    diaryList: [],
    isLoaded: false,
  },
});

export default diaryAtom;
