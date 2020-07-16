//Get query string
export function getURLSharedId() {
  //Grab url
  const url = window.location.search;
  const searchParams = new URLSearchParams(url);
  const id = searchParams.get("share") || null;
  return id;
}
