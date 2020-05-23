import { VantComponent } from '../common/component';
const request = require("../../utils/request.js");
const url = require("../../utils/apisUrl.js");
const app = getApp();
VantComponent({
    props: {
        dot: Boolean,
        info: null,
        customStyle: String
    }
});
