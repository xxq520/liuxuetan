import { VantComponent } from '../common/component';
import { GREEN, GRAY_DARK } from '../common/color';
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
VantComponent({
    classes: ['desc-class'],
    props: {
        icon: String,
        steps: Array,
        active: Number,
        direction: {
            type: String,
            value: 'horizontal'
        },
        activeColor: {
            type: String,
            value: GREEN
        },
        inactiveColor: {
            type: String,
            value: GRAY_DARK
        },
        activeIcon: {
            type: String,
            value: 'checked'
        },
        inactiveIcon: String
    },
    methods: {
        onClick(event) {
            const { index } = event.currentTarget.dataset;
            this.$emit('click-step', index);
        }
    },
});
