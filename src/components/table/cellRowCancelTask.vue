<template>
    <div class="cellRowCancelTask" ref="childComponent">
        <div class="cancelTask" @click="callCancelTask"></div>
    </div>
</template>

<script>
import { cancelTask } from '@/api/index.js'
import Vue from "vue";

export default Vue.extend({
    data() {
        return {}
    },
    methods: {
        callCancelTask() {
            this.params.api.deselectAll()
            this.params.node.setSelected(true)
            let selRowsArr = this.params.api.getSelectedRows()[0],
                parent = this.params.context.componentParent,
                grandparent = this.params.context.componentParent.$parent;
            
            // if (!selRowsArr) { // undefined
            //     this.$message.warning({
            //         message: '请先选择要取消的任务!',
            //     })
            //     return false;
            // }

            let params = new URLSearchParams()
            params.append('taskid', selRowsArr.taskid)
            cancelTask(params).then(res => {
               // console.log(res)
               grandparent.dataInit()
               parent.mycancel = true
               parent.mydelete = true
            })
        }
    },
    mounted() {}
});
</script>

<style scoped lang="scss">
.cellRowCancelTask{
    display: flex;
    height: 40px;
    margin-top: 11px;
    line-height: 40px;
    text-align: center;
    .cancelTask{
        display: none;
        height: 18px;
        width: 18px;
        min-width: 18px;
        // margin-left: 10px;
        background: url('../../static/images/cancelTask-default.png');
        cursor: pointer;
        &:hover{
            background: url('../../static/images/cancelTask-hover.png');
        }
        
    }
}
  
</style>
<style lang="scss">
.ag-row{
    &:hover{
        .cellRowCancelTask{
            .cancelTask{
                display: block !important;
            }
        }
    }
}
</style>