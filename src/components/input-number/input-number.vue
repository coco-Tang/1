<template>
    <div :class="wrapClasses">
        <div :class="handlerClasses">
            <a
                @click="up"
                @mousedown="preventDefault"
                :class="upClasses">
                <span :class="innerUpClasses" @click="preventDefault"></span>
            </a>
            <a
                @click="down"
                @mousedown="preventDefault"
                :class="downClasses">
                <span :class="innerDownClasses" @click="preventDefault"></span>
            </a>
        </div>
        <div :class="inputWrapClasses">
            <input
                :id="elementId"
                :class="inputClasses"
                :disabled="disabled"
                autocomplete="off"
                spellcheck="false"
                :autofocus="autofocus"
                @focus="focus"
                @blur="blur"
                @keydown.stop="keyDown"
                @input="change"
                @mouseup="preventDefault"
                @change="change"
                :readonly="readonly || !editable"
                :name="name"
                :value="formatterValue"
                :placeholder="placeholder">
        </div>
    </div>
</template>
<script>
import { oneOf } from "@/utils";
import Emitter from "@/mixins/emitter";

const prefixCls = "ivu-input-number";
const iconPrefixCls = "ivu-icon";

function addNum(num1, num2) {
  let sq1, sq2, m;
  try {
    sq1 = num1.toString().split(".")[1].length;
  } catch (e) {
    sq1 = 0;
  }
  try {
    sq2 = num2.toString().split(".")[1].length;
  } catch (e) {
    sq2 = 0;
  }
  //        if (sq1 === 0 || sq2 === 0) {
  //            return num1 + num2;
  //        } else {
  //            m = Math.pow(10, Math.max(sq1, sq2));
  //            return (num1 * m + num2 * m) / m;
  //        }
  m = Math.pow(10, Math.max(sq1, sq2));
  return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
}

export default {
  name: "InputNumber",
  mixins: [Emitter],
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      default: 1
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    precision: {
      type: Number
    },
    elementId: {
      type: String
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      focused: false,
      upDisabled: false,
      downDisabled: false,
      currentValue: this.value
    };
  },
  computed: {
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-focused`]: this.focused
        }
      ];
    },
    handlerClasses() {
      return `${prefixCls}-handler-wrap`;
    },
    upClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-up`,
        {
          [`${prefixCls}-handler-up-disabled`]: this.upDisabled
        }
      ];
    },
    innerUpClasses() {
      return `${prefixCls}-handler-up-inner ${iconPrefixCls} ${iconPrefixCls}-ios-arrow-up`;
    },
    downClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-down`,
        {
          [`${prefixCls}-handler-down-disabled`]: this.downDisabled
        }
      ];
    },
    innerDownClasses() {
      return `${prefixCls}-handler-down-inner ${iconPrefixCls} ${iconPrefixCls}-ios-arrow-down`;
    },
    inputWrapClasses() {
      return `${prefixCls}-input-wrap`;
    },
    inputClasses() {
      return `${prefixCls}-input`;
    },
    precisionValue() {
      // can not display 1.0
      if (!this.currentValue) return this.currentValue;
      return this.precision
        ? this.currentValue.toFixed(this.precision)
        : this.currentValue;
    },
    formatterValue() {
      if (this.formatter && this.precisionValue !== null) {
        return this.formatter(this.precisionValue);
      } else {
        return this.precisionValue;
      }
    }
  },
  methods: {
    preventDefault(e) {
      e.preventDefault();
    },
    up(e) {
      const targetVal = Number(e.target.value);
      if (this.upDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep("up", e);
    },
    down(e) {
      const targetVal = Number(e.target.value);
      if (this.downDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep("down", e);
    },
    changeStep(type, e) {
      if (this.disabled || this.readonly) {
        return false;
      }

      const targetVal = Number(e.target.value);
      let val = Number(this.currentValue);
      const step = Number(this.step);
      if (isNaN(val)) {
        return false;
      }

      // input a number, and key up or down
      if (!isNaN(targetVal)) {
        if (type === "up") {
          if (addNum(targetVal, step) <= this.max) {
            val = targetVal;
          } else {
            return false;
          }
        } else if (type === "down") {
          if (addNum(targetVal, -step) >= this.min) {
            val = targetVal;
          } else {
            return false;
          }
        }
      }

      if (type === "up") {
        val = addNum(val, step);
      } else if (type === "down") {
        val = addNum(val, -step);
      }
      this.setValue(val);
    },
    setValue(val) {
      // 如果 step 是小数，且没有设置 precision，是有问题的
      if (val && !isNaN(this.precision))
        val = Number(Number(val).toFixed(this.precision));

      this.$nextTick(() => {
        this.currentValue = val;
        this.$emit("input", val);
        this.$emit("on-change", val);
        this.dispatch("FormItem", "on-form-change", val);
      });
    },
    focus(event) {
      this.focused = true;
      this.$emit("on-focus", event);
    },
    blur() {
      this.focused = false;
      this.$emit("on-blur");
    },
    keyDown(e) {
      if (e.keyCode === 38) {
        e.preventDefault();
        this.up(e);
      } else if (e.keyCode === 40) {
        e.preventDefault();
        this.down(e);
      }
    },
    change(event) {
      let val = event.target.value.trim();
      if (this.parser) {
        val = this.parser(val);
      }

      if (event.type == "input" && val.match(/^\-?\.?$|\.$/)) return; // prevent fire early if decimal. If no more input the change event will fire later

      const { min, max } = this;
      const isEmptyString = val.length === 0;
      val = Number(val);

      if (isEmptyString) {
        this.setValue(null);
        return;
      }
      if (event.type == "change") {
        if (val === this.currentValue && val > min && val < max) return; // already fired change for input event
      }

      if (!isNaN(val) && !isEmptyString) {
        this.currentValue = val;

        if (event.type == "input" && val < min) return; // prevent fire early in case user is typing a bigger number. Change will handle this otherwise.
        if (val > max) {
          this.setValue(max);
        } else if (val < min) {
          this.setValue(min);
        } else {
          this.setValue(val);
        }
      } else {
        event.target.value = this.currentValue;
      }
    },
    changeVal(val) {
      val = Number(val);
      if (!isNaN(val)) {
        const step = this.step;

        this.upDisabled = val + step > this.max;
        this.downDisabled = val - step < this.min;
      } else {
        this.upDisabled = true;
        this.downDisabled = true;
      }
    }
  },
  mounted() {
    this.changeVal(this.currentValue);
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.changeVal(val);
    },
    min() {
      this.changeVal(this.currentValue);
    },
    max() {
      this.changeVal(this.currentValue);
    }
  }
};
</script>
<style>
.ivu-input-number {
  display: inline-block;
  width: 100%;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  color: #495060;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  -webkit-transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    -webkit-box-shadow 0.2s ease-in-out;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    -webkit-box-shadow 0.2s ease-in-out;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
  margin: 0;
  padding: 0;
  width: 80px;
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
  border: 1px solid #dddee1;
  border-radius: 4px;
  overflow: hidden;
}
.ivu-input-number::-moz-placeholder {
  color: #bbbec4;
  opacity: 1;
}
.ivu-input-number:-ms-input-placeholder {
  color: #bbbec4;
}
.ivu-input-number::-webkit-input-placeholder {
  color: #bbbec4;
}
.ivu-input-number:hover {
  border-color: #57a3f3;
}
.ivu-input-number:focus {
  border-color: #57a3f3;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}
.ivu-input-number[disabled],
fieldset[disabled] .ivu-input-number {
  background-color: #f3f3f3;
  opacity: 1;
  cursor: not-allowed;
  color: #ccc;
}
.ivu-input-number[disabled]:hover,
fieldset[disabled] .ivu-input-number:hover {
  border-color: #e4e5e7;
}
textarea.ivu-input-number {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  vertical-align: bottom;
  font-size: 14px;
}
.ivu-input-number-large {
  font-size: 14px;
  padding: 6px 7px;
  height: 36px;
}
.ivu-input-number-small {
  padding: 1px 7px;
  height: 24px;
  border-radius: 3px;
}
.ivu-input-number-handler-wrap {
  width: 22px;
  height: 100%;
  border-left: 1px solid #dddee1;
  border-radius: 0 4px 4px 0;
  background: #fff;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
}
.ivu-input-number:hover .ivu-input-number-handler-wrap {
  opacity: 1;
}
.ivu-input-number-handler-up {
  cursor: pointer;
}
.ivu-input-number-handler-up-inner {
  top: 1px;
}
.ivu-input-number-handler-down {
  border-top: 1px solid #dddee1;
  top: -1px;
  cursor: pointer;
}
.ivu-input-number-handler {
  display: block;
  width: 100%;
  height: 16px;
  line-height: 0;
  text-align: center;
  overflow: hidden;
  color: #999;
  position: relative;
}
.ivu-input-number-handler:hover .ivu-input-number-handler-down-inner,
.ivu-input-number-handler:hover .ivu-input-number-handler-up-inner {
  color: #57a3f3;
}
.ivu-input-number-handler-down-inner,
.ivu-input-number-handler-up-inner {
  width: 12px;
  height: 12px;
  line-height: 12px;
  font-size: 14px;
  color: #999;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: absolute;
  right: 4px;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
}
.ivu-input-number:hover {
  border-color: #57a3f3;
}
.ivu-input-number-focused {
  border-color: #57a3f3;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}
.ivu-input-number-disabled {
  background-color: #f3f3f3;
  opacity: 1;
  cursor: not-allowed;
  color: #ccc;
}
.ivu-input-number-disabled:hover {
  border-color: #e4e5e7;
}
.ivu-input-number-input-wrap {
  overflow: hidden;
  height: 32px;
}
.ivu-input-number-input {
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding: 0 7px;
  text-align: left;
  outline: 0;
  -moz-appearance: textfield;
  color: #666;
  border: 0;
  border-radius: 4px;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
}
.ivu-input-number-input[disabled] {
  background-color: #f3f3f3;
  opacity: 1;
  cursor: not-allowed;
  color: #ccc;
}
.ivu-input-number-input[disabled]:hover {
  border-color: #e4e5e7;
}
.ivu-input-number-large {
  padding: 0;
}
.ivu-input-number-large .ivu-input-number-input-wrap {
  height: 36px;
}
.ivu-input-number-large .ivu-input-number-handler {
  height: 18px;
}
.ivu-input-number-large input {
  height: 36px;
  line-height: 36px;
}
.ivu-input-number-large .ivu-input-number-handler-up-inner {
  top: 2px;
}
.ivu-input-number-large .ivu-input-number-handler-down-inner {
  bottom: 2px;
}
.ivu-input-number-small {
  padding: 0;
}
.ivu-input-number-small .ivu-input-number-input-wrap {
  height: 24px;
}
.ivu-input-number-small .ivu-input-number-handler {
  height: 12px;
}
.ivu-input-number-small input {
  height: 24px;
  line-height: 24px;
  margin-top: -1px;
  vertical-align: top;
}
.ivu-input-number-small .ivu-input-number-handler-up-inner {
  top: -1px;
}
.ivu-input-number-small .ivu-input-number-handler-down-inner {
  bottom: -1px;
}
.ivu-input-number-disabled .ivu-input-number-handler-down-inner,
.ivu-input-number-disabled .ivu-input-number-handler-up-inner,
.ivu-input-number-handler-down-disabled .ivu-input-number-handler-down-inner,
.ivu-input-number-handler-down-disabled .ivu-input-number-handler-up-inner,
.ivu-input-number-handler-up-disabled .ivu-input-number-handler-down-inner,
.ivu-input-number-handler-up-disabled .ivu-input-number-handler-up-inner {
  opacity: 0.72;
  color: #ccc !important;
  cursor: not-allowed;
}
.ivu-input-number-disabled .ivu-input-number-input {
  opacity: 0.72;
  cursor: not-allowed;
  background-color: #f3f3f3;
}
.ivu-input-number-disabled .ivu-input-number-handler-wrap {
  display: none;
}
.ivu-input-number-disabled .ivu-input-number-handler {
  opacity: 0.72;
  color: #ccc !important;
  cursor: not-allowed;
}
.ivu-form-item-error .ivu-input-number {
  border: 1px solid #ed3f14;
}
.ivu-form-item-error .ivu-input-number:hover {
  border-color: #ed3f14;
}
.ivu-form-item-error .ivu-input-number:focus {
  border-color: #ed3f14;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
  box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
}
.ivu-form-item-error .ivu-input-number-focused {
  border-color: #ed3f14;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
  box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
}
</style>
