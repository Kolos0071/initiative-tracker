<script lang="ts">
export default {
  props: {
    isOpen: Boolean
  },
  // setup() {}
}
</script>

<template>
  <div class="common-form" :class="{ 'common-form_active': isOpen }">
    <div class="common-form__overlay" @click="$emit('close')" />
    <div class="common-form__wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.common-form {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.common-form_active {
  display: flex;
}

.common-form__overlay {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.common-form__wrapper {
  width: 60%;
  height: 60%;
  max-width: 800px;
  max-height: 600px;
  padding: 12px;
  background-color: #fff;
  overflow: auto;
}
</style>
