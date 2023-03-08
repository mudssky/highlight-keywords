export function getLocalStorageJSON(keyname: string) {
  const data = localStorage.getItem(keyname)
  return data ? JSON.parse(data) : null
}

export function setLocalStorageJSON(keyname: string, value: string) {
  localStorage.setItem(keyname, value)
}

export function setLocalStorageObj(keyname: string, value: unknown) {
  localStorage.setItem(keyname, JSON.stringify(value))
}
