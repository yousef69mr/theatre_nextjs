
export const scanTicketsRequest = async (url: string) => {
  const promise = await fetch(url, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });
  // console.log(promise);

  const response = await promise.json();
  // console.log(promise.ok);
  if (!promise.ok) {
    // console.log(response["error"]);
    throw Error(response["error"]);
  }
  return response;
};
