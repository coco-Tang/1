export const SPEAKERID = 'SPEAKERID'

const speaker = {
	state:{
		speakerId: null
	},
	mutations:{
		[SPEAKERID](state, data) {
            state.speakerId = data
        }
	},
	getters:{
		getSpeakerId: state => state.speakerId
	}
}

export default speaker