import { VantComponent } from '../../../common/component';
// const request = require("../../utils/request.js");
// const url = require("../../utils/apisUrl.js");
// const app = getApp();
VantComponent({
    props: {
        title: {
            type: String,
            value: '日期选择'
        },
        subtitle: String,
        showTitle: Boolean,
        showSubtitle: Boolean
    },
    data: {
        weekdays: ['日', '一', '二', '三', '四', '五', '六']
    },
    methods: {}
});
