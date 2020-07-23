import React from "react";
import * as actionTypes from '../actions/types';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';

const initialState = {
    idToElementRef: new Map(),
    selectedIDs: [],
    scrollViewRef: React.createRef(),
    svgImageZoomRef: React.createRef(),
    sparepartsData: {},
    svgViewBox: []
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

        case actionTypes.CLICK_ELEMENT:
            const {id} = action.payload;

            //scroll tableview to row representing selected SVG node
            const scrollToId = id => {
                const tableIndex = state.sparepartsData.spareparts.findIndex((sparepart) => sparepart.set_number == id)
                if (tableIndex == -1) {
                    console.log('Nie odnaleziono set_number==', id);
                    return;
                }
                state.scrollViewRef.current.scrollToIndex({index: tableIndex})

                //dane do chmurki
                // const sparepart = state.sparepartsData.spareparts[tableIndex];
                // console.log(sparepart)
            }
            scrollToId(id)


            const msg = 'ELO ELO SvgModuleReducer->CLICK_ELEMENT: ' + id;
            console.log(msg);
            // for (let key of state.idToElementRef.keys()) {
            //     console.log(key)
            // }

            let fillColor = '';
            let strokeWidth = 1;
            let newSelectedIDs = state.selectedIDs;
            if (state.selectedIDs.includes(id)) {
                newSelectedIDs = newSelectedIDs.filter(selID => selID != id);
                fillColor = extractBrush('black');
                strokeWidth = 1;
            } else {
                newSelectedIDs = [...newSelectedIDs, id];
                fillColor = extractBrush('red');
                strokeWidth = 3;
            }

            const elementRef = state.idToElementRef.get(id);
            if (elementRef) {
                const obj = elementRef.current;
                obj.setNativeProps({stroke: extractBrush(fillColor), strokeWidth: strokeWidth});
                //focus screen
                const targetLocation = obj?.props?.d?.split(' ')?.[1]?.split(',');
                state.svgImageZoomRef.current.centerOn({
                    x: state.svgViewBox[2] / 2 - targetLocation[0],
                    y: state.svgViewBox[3] / 2 - targetLocation[1],
                    scale: 1,
                    duration: 1000
                })
                // state.svgImageZoomRef.current.centerOn({x:0, y:0, scale:1, duration:1000})
            }
            return {...state, selectedIDs: newSelectedIDs};

        default:
            return state;
    }
};

export default SvgModuleReducer;
