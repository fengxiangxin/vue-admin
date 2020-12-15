<template>
  <div>
    <Category />
    <SpuShow v-if="isShow" @updateSpu="updateSpu" />
    <SpuUpdate v-else :spuRow="spuRow" @show="show" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShow from "./spuShow";
import SpuUpdate from "./spuUpdate";
export default {
  name: "SpuList",
  data() {
    return {
      isShow: true,
      spuRow: {},
    };
  },
  methods: {
    /* 重新回到这个页面 */
    show(category3Id) {
      /* 修改显示 */
      this.isShow = true;
      /* 重新加载数据 */
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
    updateSpu(row) {
      /* 修改显示 */
      this.isShow = false;
      this.spuRow = row;
    },
  },
  components: {
    Category,
    SpuShow,
    SpuUpdate,
  },
};
</script>
