<script  lang="ts">
    export default {
    props: {
        isOpen: Boolean
    },
    setup() {
        
    }
    }
</script>

<template>
     <div
        class="form"
        :class="{'form_active':isOpen}"
      >
        <div
          class="form__overlay"
          @click="$emit('close')"
        />
        <div class="form__wrapper">
            <slot></slot>
        </div>
      </div>
</template>

<style>
.form {
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

.form_active {
    display: flex;
}

.form__overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, .5);
    z-index: -1;
}

.form__wrapper {
  width: 60%;
  height: 60%;
  max-width: 600px;
  max-height: 400px;
  padding: 12px;
  background-color: #fff;
}

</style>