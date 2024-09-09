
<script setup lang="ts">
import type { IOptionsFormState } from '../internal';
import CommonForm from "./CommonForm.vue";
import {defineProps} from "vue";
defineProps<{
  optionFormState: IOptionsFormState
}>()
</script>
<template>
  <CommonForm :is-open="optionFormState.isOpen" class="option-form" @close="optionFormState.toggler()">
    <h1>Настройки</h1>
    <p>
      Внимание! Любое несохраненное изменение будет сброшено после перезапуска приложения.
    </p>
    <div class="option-form__container">
      <div>
        <h2>Initiative range</h2>
        <input type="number" v-model="optionFormState.initiativeMin">
        <span>-</span>
        <input type="number" v-model="optionFormState.initiativeMax">
      </div>
      <div>
        <h2>HP range</h2>
        <input type="number" v-model="optionFormState.hpMin">
        <span>-</span>
        <input type="number" v-model="optionFormState.hpMax">
      </div>
    </div>
    <button @click="$emit('save')">Save</button>
  </CommonForm>
</template>


<style >

</style>
