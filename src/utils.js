import { ADMIN_ROLE, DEV_ROLE, PM_ROLE } from "./constants/roleConstants";

export function isValidField(value) {
  return /^\s*[a-zA-Z][a-zA-Z0-9\-.\s]*$/.test(value);
}

export function isValidEmailField(value) {
  return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
    value
  );
}

export function isValidProgressValue(value){
  return !isNaN(value) && value >= 0 && value <= 100
}

export function getRoles() {
  return [PM_ROLE, ADMIN_ROLE, DEV_ROLE];
}

export function getTaskStatuses() {
  return ["NEW", "IN_PROGRESS", "COMPLETED"];
}
