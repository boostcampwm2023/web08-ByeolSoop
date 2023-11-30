const preventBeforeUnload = (e) => {
  e.preventDefault();
  e.returnValue = "";
};

export default preventBeforeUnload;
