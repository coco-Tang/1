<!--
 * @Author: coco-Tang
 * @Date: 2019-09-17 17:47:57
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-09-17 17:47:57
 * @Description: 
 -->
<template>
    <div class='cellOperation' ref='childComponent'>
        <el-button class='task-info-edit' @click='editTaskInfo' :disabled='this.params.data.processState!==0'>编辑</el-button>
        <el-button class='task-process-start' @click='startProcessTask' :disabled='this.params.data.processState!==0'>提交</el-button>
    </div>
</template>

<script>
import Vue from "vue"
import { processTask, getTaskMediaCount } from '@/api/impMedia'
import { clearInterval } from "timers";
window.timerArr = []

export default Vue.extend({
    data() {
        return {
            parent: null,
        }
    },
    methods: {
        editTaskInfo () {
            console.log('%ceditTaskInfo -- this.params:', 'color:green', this.params)
            this.parent.updateMsg.data = this.params.data
            this.parent.updateMsg.isEdit = true
            this.parent.$refs.c1.showDialog()
        },
        startProcessTask () {
            let modEle = this.parent.rowData.find(e => e.taskId == this.params.data.taskId),
                modEleIdx = this.parent.rowData.findIndex(e => e.taskId == this.params.data.taskId)
            // Vue.set(modEle, 'processState', 1 )
            modEle.processState = 1
            this.parent.rowData.splice(modEleIdx, 1, modEle)
            console.warn('this.parent.rowData:', this.parent.rowData)

            let tempTaskState = {}
            tempTaskState.processState = 1
            sessionStorage.setItem(this.params.data.taskId, JSON.stringify(tempTaskState)) // 后台没有中间状态, 改由前端存当前正在处理的任务的中间状态

            let ssRank = 'storageRank' + this.params.data.id,
                tmRank = 'timer' + this.params.data.id

            sessionStorage.setItem(ssRank, this.params.data.taskId)

            let p = new URLSearchParams()
            p.append('type', 1)

            processTask(this.params.data.taskId, p)
                .then(res => {
                    console.log('processTask --- res:', res)
                    // let modEle = this.parent.rowData.find(e => e.taskId == this.params.data.taskId)
                    // this.$set(modEle, 'processState', 1 )
                    
                    
                })
                .catch(err => {
                    this.$message.error({
                        message: JSON.stringify(err.response.data)
                    })
                })

            if (sessionStorage.getItem(ssRank)) {
                this.parent.tmRank = setInterval(() => {

                    let p2 = new URLSearchParams()
                    p2.append('type', 1)
                    getTaskMediaCount(this.params.data.taskId, p2)
                        .then(res => {
                            console.warn('进入了 getTaskMediaCount')
                            // this.$set(modEle, 'hasProcessed', res.data)
                            modEle.hasProcessed = res.data
                            this.parent.rowData.splice(modEleIdx, 1, modEle)

                            if (res.data === this.params.data.impMediaNum) {
                            // if (res.data >= this.params.data.impMediaNum) { // 后台逻辑有误, 某些情况下会自增溢出, 姑且用 >= 来判断
                                this.parent.dataInit()

                                sessionStorage.removeItem(this.params.data.taskId)
                                sessionStorage.removeItem(ssRank)
                                window.clearInterval(this.parent.tmRank)
                            }
                        })

                }, 2000, modEle, modEleIdx)

                window.timerArr.push(this.parent.tmRank)
            }
            //  else {
            //     clearInterval(this.parent.tmRank)
            // }
        }
    },
    beforeCreate() {

    },
    created() {
        
    },
    beforeMount() {
        
    },
    mounted() {
        console.log(this.parent)
        this.parent = this.params.context.componentParent
    },
    beforeUpdate () {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {

    }
})
</script>

<style scoped lang="scss">
.cellOperation {
    display: flex;
    height: 40px;
    align-items: center;
    
    .task-info-edit,
    .task-process-start {
        // padding: 3px;
        padding: 0 10px;
    }
    button:nth-of-type(2) {
        margin-left: 6px;
        // background: pink;
    }
}
</style>