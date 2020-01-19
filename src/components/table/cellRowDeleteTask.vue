<template>
    <div class="cellRowDeleteTask" ref="childComponent">
        <div class="delete" @click="callDeleteTask"></div>
    </div>
</template>

<script>
import { deleteTask } from '@/api/index.js'
import Vue from "vue";

export default Vue.extend({
    data() {
        return {}
    },
    methods: {
        callDeleteTask() {
            // console.log(this.params)
            this.params.api.deselectAll()
            this.params.node.setSelected(true)
            let selRowsArr = this.params.api.getSelectedRows()[0],
                parent = this.params.context.componentParent,
                grandparent = this.params.context.componentParent.$parent;

            // if (!selRowsArr) {
            //     this.$message.warning({
            //         message: '请先选择要取消的任务!',
            //     })
            //     return false;
            // }
            
            let params = new URLSearchParams()
            params.append('taskid', selRowsArr.taskid)
            deleteTask(params).then(res => {
               // console.log(res)
               grandparent.dataInit()
               parent.mycancel = true
               parent.mydelete = true
            })
        }
    },
    mounted () {}
});
</script>

<style scoped lang="scss">
.cellRowDeleteTask{
    display: flex;
    height: 40px;
    margin-top: 11px;
    line-height: 40px;
    text-align: center;
    .delete{
        display: none;
        height: 18px;
        width: 18px;
        min-width: 18px;
        // margin-left: 10px;
        background: url('../../static/images/删除默认.png');
        cursor: pointer;
        &:hover{
            background: url('../../static/images/删除选中.png');
        }
        
    }
}
  
</style>
<style lang="scss">
.ag-row{
    &:hover{
        .cellRowDeleteTask{
            .delete{
                display: block !important;
            }
        }
    }
}
</style>