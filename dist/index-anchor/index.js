import { VantComponent } from '../common/component';
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
VantComponent({
    relation: {
        name: 'index-bar',
        type: 'ancestor',
        current: 'index-anchor'
    },
    props: {
        useSlot: Boolean,
        index: null
    },
    data: {
        active: false,
        wrapperStyle: '',
        anchorStyle: ''
    },
    methods: {
        scrollIntoView(scrollTop) {
            this.getBoundingClientRect().then((rect) => {
                wx.pageScrollTo({
                    duration: 0,
                    scrollTop: scrollTop + rect.top - this.parent.data.stickyOffsetTop
                });
            });
        },
        getBoundingClientRect() {
            return this.getRect('.van-index-anchor-wrapper');
        }
    }
});
