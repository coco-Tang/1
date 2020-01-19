export const TASK_ID = 'setTaskId'
export const IMPORT_STATE = 'setImportState'
// export const PROCESSING_CONTENT = 'setProcessingContent'
// export const MEDIA_REMARK = 'setMediaRemark'
// export const MEDIA_LANGUAGE = 'setMediaLanguage'
// export const MEDIA_TYPE = 'setMediaType'

const impMedia = {
	state:{
        taskId: null,
        impState: false
        // processingContent: null,
        // mediaRemark: '',
        // mediaLanguage: null,
        // mediaType: null
	},
	mutations:{
		[TASK_ID](state, data) {
			state.taskId = data
        },
        [IMPORT_STATE](state, data) {
          state.impState = data
        },
        // [PROCESSING_CONTENT](state, data) {
        //     state.processingContent = data
        // },
        // [MEDIA_REMARK](state, data) {
        //     state.mediaRemark = data
        // },
        // [MEDIA_LANGUAGE](state, data) {
        //     state.mediaLanguage = data
        // },
        // [MEDIA_TYPE](state, data) {
        //     state.mediaType = data
        // }
	},
	getters:{
        getTaskId:(state) => state.taskId,
        getImoprtState:(state) => state.impState,
        // getProcessingContent: (state) => state.processingContent,
        // getMediaRemark: (state) => state.mediaRemark,
        // getMediaLanguage: (state) => state.mediaLanguage,
        // getMediaType: (state) => state.mediaType
	}
}

export default impMedia