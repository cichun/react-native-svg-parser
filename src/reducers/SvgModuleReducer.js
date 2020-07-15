import React from "react";
import * as actionTypes from '../actions/types';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';

const initialState = {
    idToElementRef: new Map(),
    selectedIDs: [],
    scrollViewRef: React.createRef(),
    sparepartsData: {}
};

const SvgModuleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_ELEMENTREF_FOR_ID:
            state.idToElementRef.set(action.payload.id, action.payload.elementRef);
            return {...state}   // no need to refresh

        case actionTypes.SET_SPAREPARTS_DATA:
            return {...state, sparepartsData: action.payload}

        case actionTypes.CLICK_ELEMENT:
            const {id} = action.payload;

            const scrollToId = id => {
                const tableIndex = state.sparepartsData.spareparts.findIndex((sparepart)=>sparepart.set_number==id)
                if (tableIndex==-1) {
                    console.log('Nie odnaleziono set_number==', id);
                    return;
                }
                state.scrollViewRef.current.scrollToIndex({index: tableIndex})
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
            // this.setState({selectedIDs: newSelectedIDs});

            const elementRef = state.idToElementRef.get(id);
            if (elementRef) {
                const obj = elementRef.current;
                obj.setNativeProps({stroke: extractBrush(fillColor), strokeWidth: strokeWidth});
            }
            return {...state, selectedIDs: newSelectedIDs};

        default:
            return state;
    }
};

export default SvgModuleReducer;
