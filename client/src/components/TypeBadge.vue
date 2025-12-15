<template>
    <div class="type-badge" :style="styleObj">
        <img :src="icon" class="type-icon" />
    </div>
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
    min-width: 55px;
    height: 22px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.type-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}
</style>
