/*
 * @Description:
 * @Version: 2.0
 * @Autor: wuwei3
 * @Date: 2020-08-14 11:06:14
 * @LastEditors:
 * @LastEditTime: 2020-09-23 09:12:31
 */
import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg },
    });

    expect(wrapper.text()).toMatch(msg);
  });
});
