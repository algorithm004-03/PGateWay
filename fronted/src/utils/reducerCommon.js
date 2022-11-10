import _ from 'lodash';

function reducer(state, action) {
	switch (action.type){
		case "forcedUpdate": {
			return {...state, ...action.payload}
		}
		case "updateDataById": {
			let newData = state.data
			let {selectedRowIndex, id} = action.payload
			let i = _.findIndex(newData, {id: id})
			newData[i] = {...newData[i], ...action.payload.data}
			return {...state, selectedRow: action.payload.data, data: newData}
		}
		case "deleteDataById": {
			
			let newData = state.data
			let {selectedRowIndex, id} = action.payload
			let i = _.findIndex(newData, {id: id})
			newData.splice(i,1)
			return {...state, data: newData}
		}
		
		case "addOneRowData": {
			return {...state, data: [action.payload.data, ...state.data]}
		}
		
		default: 
			return state;
	}
	
}



export { reducer };