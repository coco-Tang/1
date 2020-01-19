<template>
    <div class="headerRowCancelTask" ref="childComponent" title='取消任务'>
        <div class="cancelTask" @click="callCancelTask"></div>
    </div>
</template>

<script>
import { cancelTask } from '@/api/index.js'
import axios from 'axios'
import Vue from "vue"

export default Vue.extend({ //https://github.com/ag-grid/ag-grid-vue-example/issues/15#issuecomment-446273865 or https://www.ag-grid.com/javascript-grid-cell-rendering/vuejs.php

// export default { // It's also OK when not nested in 3rd party UI components like el-dialog
    data() {
        return {};
    },
    methods: {
        callCancelTask () {
            // console.warn('header--this', this)
            // console.warn('this.params.api.getSelectedRows():', this.params.api.getSelectedRows())
            let selRowsArr = this.params.api.getSelectedRows(), 
                cxlTskArr = [],
                tasks = [],
                parent = this.params.context.componentParent,
                grandparent = this.params.context.componentParent.$parent;
            
            if (!selRowsArr.length) {
                this.$message.warning({
                    message: '请先选择要取消的任务!',
                })
                return false;
            }

            selRowsArr.map( el => cxlTskArr.push(el.taskid) )
            cxlTskArr.map( el => {
                let params = new URLSearchParams()
                params.append('taskid', el)
                tasks.push(cancelTask(params))
            })
            axios.all(tasks).then(res => {
               // console.log(res)
               grandparent.dataInit()
               parent.mycancel = true
               parent.mydelete = true
            })
        }
    },
    mounted() {}
// };
})
</script>

<style scoped lang="scss">
.headerRowCancelTask {
    display: flex;
    height: 40px;
    margin-top: 11px;
    line-height: 40px;
    text-align: center;
    .cancelTask {
        height: 18px;
        width: 18px;
        min-width: 18px;
        // margin-left: 10px;
        background: url("../../static/images/cancelTask-default.png");

        &:hover {
            background: url("../../static/images/cancelTask-hover.png");
        }
    }
}
</style>