export function isValidField(value) {
  return /^\s*[a-zA-Z][a-zA-Z0-9\-.\s]*$/.test(value);
}

export function isValidEmailField(value) {
  return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
    value
  );
}

export function getRoles(){
  return ["PM","ADMIN","DEV"];
}
