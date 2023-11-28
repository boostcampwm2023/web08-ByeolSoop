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
    isLoaded: false,
  },
  effects: [
    ({ onSet }) =>
      onSet((newDiaryState) => {
        console.log(newDiaryState);
      }),
  ],
});

export default diaryAtom;
