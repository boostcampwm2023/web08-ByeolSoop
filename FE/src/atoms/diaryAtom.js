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
    isPurchase: false,
    diaryUuid: "",
    diaryPoint: "",
    diaryList: [],
    isLoading: false,
    isRedirect: false,
  },
});

export default diaryAtom;
