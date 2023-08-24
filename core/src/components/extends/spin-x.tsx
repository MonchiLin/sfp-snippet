import { defineComponent } from "vue";
import { Spin, SpinProps } from "ant-design-vue";

export default defineComponent({
  components: {Spin},
  props: {} as SpinProps,
  setup(props, {slots}) {
    return () => <Spin {...props}>{slots}</Spin>;
  },
});
