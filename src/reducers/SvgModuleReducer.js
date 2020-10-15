import React from "react";
import * as actionTypes from '../actions/types';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';
import Animated from 'react-native-reanimated'

const initialState = {
    idToElementRef: new Map(),
    selectedIDs: [],
    scrollViewRef: React.createRef(),
    svgImageZoomRef: React.createRef(),
    sparepartsData: {},
    svgViewBox: [],
    bottomSheetRef: React.createRef(),
    bottomSheetHeaderPosition: new Animated.Value(1),
    // bottomSheetHeight: Dimensions.get('window').height * (0.8-0.3)
    bottomSheetHeight: 0
};

const SvgModuleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_ELEMENTREF_FOR_ID:
            state.idToElementRef.set(action.payload.id, action.payload.elementRef);
            return {...state}   // no need to refresh

        case actionTypes.SET_SPAREPARTS_DATA:
            return {...state, sparepartsData: action.payload}

        case actionTypes.SET_SVG_VIEWBOX:
            return {...state, svgViewBox: action.payload}

        case actionTypes.SET_BOTTOM_SHEET_HEIGHT:
            console.log('setting bottom sheet height to: ',action.payload)
            return {...state, bottomSheetHeight: action.payload}

        case actionTypes.RESET_SELECTED_IDS:
            return {...state, selectedIDs: []}

        case actionTypes.CLICK_ELEMENT:
            const {id} = action.payload;


            const msg = 'ELO ELO SvgModuleReducer->CLICK_ELEMENT: ' + id;
            console.log(msg);

            let fillColor = '';
            let strokeWidth = 1;
            let newSelectedIDs = state.selectedIDs;
            if (state.selectedIDs.includes(id)) {
                newSelectedIDs = newSelectedIDs.filter(selID => selID != id);    //when multiselect enabled
                // newSelectedIDs = [];
                fillColor = null;
                strokeWidth = 1;
            } else {
                newSelectedIDs = [...newSelectedIDs, id];    //when multiselect enabled
                // newSelectedIDs = [id];
                fillColor = extractBrush('red');
                strokeWidth = 2;
            }


            const elementRef = state.idToElementRef.get(id);
            if (elementRef) {
                const obj = elementRef.current;
                // obj.setNativeProps({stroke: extractBrush(fillColor), strokeWidth: strokeWidth});
                obj.setNativeProps({fill: extractBrush(fillColor)});

                for(const child of obj.props.myChildrenRefs) {
                    const childObj = child.current;
                    if(childObj.constructor.name==="Text") {
                        //unfortunately text desapears
                        // childObj.setNativeProps({fill: extractBrush(fillColor)});
                    } else {
                        // childObj.setNativeProps({stroke: extractBrush(fillColor), strokeWidth: strokeWidth});
                        childObj.setNativeProps({fill: extractBrush(fillColor)});
                    }

                    if(childObj.constructor.name==="Circle" || childObj.constructor.name==="AnimatedCircleComponent") {
                        focusScreenOnObject(childObj)
                    }
                }
            }
            return {...state, selectedIDs: newSelectedIDs};

        default:
            return state;
    }
};

export default SvgModuleReducer;
