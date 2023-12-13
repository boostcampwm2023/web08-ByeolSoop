function setStorage(accessToken) {
  if (localStorage.getItem("accessToken"))
    localStorage.setItem("accessToken", accessToken);
  if (sessionStorage.getItem("accessToken"))
    sessionStorage.setItem("accessToken", accessToken);
}

function handleResponse(
  res,
  accessToken,
  options = {
    successStatus: 200,
    onSuccessCallback: () => {},
    on400Callback: () => {},
    on403Callback: () => {},
    on401Callback: () => {},
  },
) {
  const {
    successStatus,
    onSuccessCallback,
    on400Callback,
    on403Callback,
    on401Callback,
  } = options;
  if (res.status === successStatus) {
    return onSuccessCallback();
  }
  if (res.status === 400) {
    return on400Callback();
  }
  if (res.status === 403) {
    return on403Callback();
  }
  if (res.status === 401) {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reissue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStorage(data.accessToken);
        on401Callback(data.accessToken);
      });
  }
  throw new Error("error");
}

export default handleResponse;
