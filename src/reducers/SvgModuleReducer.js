import * as actionTypes from '../actions/types';
import extractBrush from 'react-native-svg/lib/module/lib/extract/extractBrush';

const initialState = {
    clicked_element_id: null,
    // colors: [{}],
    // colors: null,//new Map(),
    colorsMap: new Map(),
    idToElementRef: new Map(),
    selectedIDs: [],
};

const SvgModuleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_ELEMENTREF_FOR_ID:
            state.idToElementRef.set(action.payload.id, action.payload.elementRef);
            return {...state}   // no need to refresh
        // return state;
        case actionTypes.CLICK_ELEMENT:
            // console.log(state)
            // const colorsMap = state.colorsMap;
            // const id = action.payload;
            // if (colorsMap.has(id)) {
            //     colorsMap.delete(id)
            // } else {
            //     colorsMap.set(id, 'orange')
            // }
            //
            // return {...state, clicked_element_id: action.payload, colorsMap: new Map(colorsMap)};

            const {id} = action.payload;

            const msg = 'ELO ELO SvgModuleReducer->CLICK_ELEMENT: ' + id;
            console.log(msg);
            // console.log(this.props.idToElementRef.map(obj=>obj));
            for (let key of state.idToElementRef.keys()) {
                console.log(key)
            }

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
