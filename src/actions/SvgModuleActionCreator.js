import * as actionTypes from "./types";

export const clickElement = (id) => ({
    type: actionTypes.CLICK_ELEMENT,
    payload: {id},
});

export const registerElementRefForId = (elementRef, id) => ({
    type: actionTypes.REGISTER_ELEMENTREF_FOR_ID,
    payload: {elementRef, id}
});

export const setSparepartsData = (sparepartsData) => ({
    type: actionTypes.SET_SPAREPARTS_DATA,
    payload: sparepartsData
});

export const setSvgViewBox = (viewBox) => ({
    type: actionTypes.SET_SVG_VIEWBOX,
    payload: viewBox
});

export const setBottomSheetHeight = (height) => ({
    type: actionTypes.SET_BOTTOM_SHEET_HEIGHT,
    payload: height
});


// export const restTimer = (newCounterValue) => {
//   return {
//     type: actionTypes.SET_COUNTER_VALUE_TO,
//     payload: newCounterValue,
//   };
// };
