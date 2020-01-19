/*
* @Author: cjq
* @Date:   2018-02-05 14:50:21
* @Last Modified by:   cjq
* @Last Modified time: 2019-03-22 17:34:33
*/

'use strict'
let Editor = {}
// let flag = true
Editor.Editor = {
    init: function(wavesurfer) {
        this.wavesurfer = wavesurfer;
        this.clipboard = {empty: true, data: null};
        // 保存最近的操作记录
        this.undoActions = [];
        this.redoActions = [];

        
        return this
    },

    getOriginalData: function() {
        var buffer = this.wavesurfer.backend.buffer;
        // console.log('getOriginalData')
        // console.log(buffer)
        var data = [];
        for (var i = 0; i < buffer.numberOfChannels; i++) {
            data.push(buffer.getChannelData(i));
        }
        // console.log('data')
        // console.log(data)
        return data;
    },

    getTarget: function() {
        var regionList = this.wavesurfer.regions.list;
        var flag = false,
            target,
            start,
            end;

        for (var key in regionList) {
            if (!flag) {
                if (regionList.hasOwnProperty(key)) {
                    var region = regionList[key];
                    start = region.start;
                    end = region.end;
                    flag = true;
                }
            } else {
                break;
            }
        }
        if (flag) {
            var sampleRate = this.wavesurfer.backend.buffer.sampleRate;

            target = {
                start: ~~(start * sampleRate),
                end: ~~(end * sampleRate)
            };
        }

        return target;
    },

    updateView: function(newData) {
        var sampleRate = this.wavesurfer.backend.buffer.sampleRate;
        var ctx = this.wavesurfer.backend.ac;
        this.wavesurfer.backend.buffer = null;
        var newBuffer;
        // console.log('updateView')
        // console.log('newData')
        // console.log(newData)
        if (newData.length == 1) {

            try{
                console.log('try updateView')
                newBuffer = ctx.createBuffer(1, newData[0].length, sampleRate);
                newBuffer.copyToChannel(newData[0], 0, 0);
                // flag = true

            }catch(err){
                console.log('catch updateView')
                console.log(err)
                // flag = false
                return
            }
        } else if (newData.length == 2) {
            newBuffer = ctx.createBuffer(2, newData[0].length, sampleRate);
            newBuffer.copyToChannel(newData[0], 0, 0);
            newBuffer.copyToChannel(newData[1], 1, 0);
        }
        // console.log('newBuffer')
        // console.log(newBuffer)
        this.wavesurfer.loadDecodedBuffer(newBuffer);
        this.wavesurfer.pause();
        this.wavesurfer.clearRegions();
    },

    calcProgress: function(start) {
        return (1.0 * start) / (1.0 * this.wavesurfer.backend.buffer.length);
    },

    cut: function() {
        var target = this.getTarget();
        if((target.end - target.start) == this.getOriginalData()[0].length) return true
        if (target) {
            var oldData = this.getOriginalData();
            var action = Object.create(Editor.CutOperation);
            action.init(oldData, target.start, target.end);
            action.cut();

            this.undoActions.push(action);
            this.clipboard.empty = false;
            this.clipboard.data = action.cutData;

            this.updateView(action.newData);
            this.wavesurfer.seekAndCenter(this.calcProgress(target.start));
        }
    },

    copy: function() {
    	// console.log('copy')
        var target = this.getTarget();
        if (target) {
            var data = this.getOriginalData();
            var action = Object.create(Editor.CopyOperation);
            action.init(data, target.start, target.end);
            action.copy();

            this.clipboard.empty = false;
            this.clipboard.data = action.copyData;
            this.wavesurfer.pause();
            this.wavesurfer.clearRegions();


            // console.log('retuen copy')
            return action.copyData
        }
    },

    paste: function() {

    	// console.log('paste flag')
        // console.log(flag)
        if (!this.clipboard.empty && this.clipboard.data) {
            var oldData = this.getOriginalData();
            var sampleRate = this.wavesurfer.backend.buffer.sampleRate;
            var start = ~~(this.wavesurfer.backend.startPosition * sampleRate);

            var action = Object.create(Editor.PasteOperation);

            console.log('action')
            console.log(action)
            action.init(oldData, this.clipboard.data, start);
            action.paste();

            this.undoActions.push(action);
            this.updateView(action.newData);
            this.wavesurfer.seekAndCenter(this.calcProgress(start));
        }
    },

    del: function() {
        var target = this.getTarget();
        if((target.end - target.start) == this.getOriginalData()[0].length) return true
        if (target) {
            var oldData = this.getOriginalData();
            var action = Object.create(Editor.DelOperation);
            action.init(oldData, target.start, target.end);
            action.del();

            this.undoActions.push(action);

            this.updateView(action.newData);
            this.wavesurfer.seekAndCenter(this.calcProgress(target.start));
        }
    },

    undo: function() {
        var action = this.undoActions.pop();
        if (action) {
            this.redoActions.push(action);
            this.updateView(action.oldData);
            this.wavesurfer.seekAndCenter(this.calcProgress(action.start));
        }
    },

    redo: function() {
        var action = this.redoActions.pop();
        if (action) {
            this.undoActions.push(action);
            this.updateView(action.newData);
            this.wavesurfer.seekAndCenter(this.calcProgress(action.start));
        }
    },

    save: function() {
        // var target = this.getTarget();
        var data = this.getOriginalData();
        // console.log('save')
        // console.log(data)
        var saveData = []
        for (var num = 0; num < data.length; num++) {
            saveData.push(data[num].subarray(0));
        }
        // console.log('saveData')
        // console.log(saveData)
        return saveData
    }
};

Editor.CutOperation = {
    init: function(oldData, start, end) {
        this.oldData = oldData;
        this.start = start;
        this.end = end;
    },

    cut: function() {
        if((this.end - this.start) == this.oldData.length) return true
            
        var newData = [];
        var cutData = [];
        for (var num = 0; num < this.oldData.length; num++) {
            var newArr = new Float32Array(this.oldData[num].length - (this.end - this.start));
            var j = 0;

            for (var i = 0; i < this.start; i++) {
                newArr[j++] = this.oldData[num][i];
            }
            for (var i = this.end; i < this.oldData[num].length; i++) {
                newArr[j++] = this.oldData[num][i];
            }
            newData.push(newArr);
            cutData.push(this.oldData[num].subarray(this.start, this.end));
        }
        this.newData = newData;
        this.cutData = cutData;
        // console.log(newData)
    }
};

Editor.CopyOperation = {
    init: function(data, start, end) {
        this.data = data;
        this.start = start;
        this.end = end;
    },

    copy: function() {
        var copyData = [];
        for (var num = 0; num < this.data.length; num++) {
            copyData.push(this.data[num].subarray(this.start, this.end));
        }
        this.copyData = copyData;
    }
};

Editor.PasteOperation = {
    init: function(oldData, pasteData, start) {
        this.oldData = oldData;
        this.pasteData = pasteData;
        this.start = start;
    },

    paste: function() {
        var newData = [];
        for (var num = 0; num < this.oldData.length; num++) {
            
            // try{
            //     var newArr = new Float32Array(this.oldData[num].length + this.pasteData[num].length);
            //     // flag = true
            //     console.log('try')
            // }catch(err){
            //     // flag = false
            //     console.log('catch err')
            //     console.log(err)
            //     return 
            // }
            var newArr = new Float32Array(this.oldData[num].length + this.pasteData[num].length);
            var j = 0;

            for (var i = 0; i < this.start; i++) {
                newArr[j++] = this.oldData[num][i];
            }
            for (var i = 0; i < this.pasteData[num].length; i++) {
                newArr[j++] = this.pasteData[num][i];
            }
            for (var i = this.start; i < this.oldData[num].length; i++) {
                newArr[j++] = this.oldData[num][i];
            }
            newData.push(newArr);
        }
        console.log('paste')
        console.log('newData')
        console.log(newData)
        this.newData = newData;
    }
};

Editor.DelOperation = {
    init: function(oldData, start, end) {
        this.oldData = oldData;
        this.start = start;
        this.end = end;
    },

    del: function() {

        if((this.end - this.start) == this.oldData.length) return true
        var newData = [];
        for (var num = 0; num < this.oldData.length; num++) {
            var newArr = new Float32Array(this.oldData[num].length - (this.end - this.start));
            var j = 0;

            for (var i = 0; i < this.start; i++) {
                newArr[j++] = this.oldData[num][i];
            }
            for (var i = this.end; i < this.oldData[num].length; i++) {
                newArr[j++] = this.oldData[num][i];
            }
            newData.push(newArr);
        }
        this.newData = newData;
    }
};

Editor.initEditor = function() {
    if (!this.editor) {
        this.editor = Object.create(WaveSurfer.Editor);
        this.editor.init(this);
    }
};

Editor.destroyEditor = function() {
    this.editor = null;
}

export default Editor;