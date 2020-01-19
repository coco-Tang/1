<template>
    <div class="headerRowDeleteTask" ref="childComponent" title='删除任务'>
        <div class="delete" @click="callDeleteTask"></div>
    </div>
</template>

<script>
import { deleteTask } from '@/api/index.js'
import axios from 'axios'
import Vue from "vue"


export default Vue.extend({ 
    data() {
        return {}
    },
    methods: {
        callDeleteTask () {
            let selRowsArr = this.params.api.getSelectedRows(), 
                delTskArr = [],
                tasks = [],
                parent = this.params.context.componentParent,
                grandparent = this.params.context.componentParent.$parent;
            
            if (!selRowsArr.length) {
                this.$message.warning({
                    message: '请先选择要取消的任务!',
                })
                return false;
            }

            selRowsArr.map( el => delTskArr.push(el.taskid) )
            delTskArr.map( el => {
                let params = new URLSearchParams()
                params.append('taskid', el)
                tasks.push(deleteTask(params))
            })
            axios.all(tasks).then(res => {
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
.headerRowDeleteTask {
    display: flex;
    height: 40px;
    margin-top: 11px;
    line-height: 40px;
    text-align: center;
    .delete {
        height: 18px;
        width: 18px;
        min-width: 18px;
        // margin-left: 10px;
        background: url('../../static/images/删除默认.png');

        &:hover {
            background: url('../../static/images/删除选中.png');
        }
    }
}
</style>