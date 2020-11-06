/*
 * @Description: 核心配置，全局组件挂载
 * @Version: 2.0
 * @Autor: wuwei3
 * @Date: 2020-03-25 09:40:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-02 17:29:41
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import moment from 'moment';
import lodash from 'lodash';
// 开启CDN加载方式
import ELEMENT from 'element-ui';
import { Message } from 'element-ui';
import './icon/iconfont.css';
import './utils/directives';

Vue.use(ELEMENT); // UI组件使用

// 全局变量
Vue.config.productionTip = false;
Vue.prototype.$msg = Message; // 全局消息提示
Vue.prototype.$moment = moment; // 时间处理
Vue.prototype.$_ = lodash; // 数据处理

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
