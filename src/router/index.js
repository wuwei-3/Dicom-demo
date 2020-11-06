/*
 * @Description: 路由文件，定义文件路由
 * @Version: 2.0
 * @Autor: wuwei3
 * @Date: 2020-03-23 15:55:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-02 17:28:57
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash', // 开启后需要后端支持
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue'),
      children: [],
    },
  ],
});

/**
 * @description:  登录拦截
 * @param {to} 路由跳转结束
 * @param {from} 路由跳转起始
 * @param {next} 跳转方法
 * @return:
 */
router.beforeEach((to, from, next) => {
  return next();
});
export default router;
