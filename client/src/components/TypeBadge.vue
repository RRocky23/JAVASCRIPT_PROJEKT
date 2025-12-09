<template>
    <div class="type-badge" :style="styleObj"></div>
</template>

<script setup>
    import { TYPE_COLORS } from "../utils/colors.js";

const props = defineProps({
    type: String,
});

const icon = `/types/${props.type}.png`;

const styleObj = {
    backgroundColor: TYPE_COLORS[props.type],
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
};
</script>

<style scoped>
.type-badge {
    width: 40px;
    height: 14px;
    background: white;
    border-radius: 4px;
}
</style>
