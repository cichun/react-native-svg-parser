import * as actionTypes from "./types";

export const clickElement = (id) => ({
    type: actionTypes.CLICK_ELEMENT,
    payload: {id},
});

export const registerElementRefForId = (elementRef, id) => ({
    type: actionTypes.REGISTER_ELEMENTREF_FOR_ID,
    payload: {elementRef, id}
});

// export const restTimer = (newCounterValue) => {
//   return {
//     type: actionTypes.SET_COUNTER_VALUE_TO,
//     payload: newCounterValue,
//   };
// };
