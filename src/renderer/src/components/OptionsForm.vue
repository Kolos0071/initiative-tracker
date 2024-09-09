
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
      <div class="option-form__input-wrapper">
        <h2 class="option-form__input-title">Разброс инициативы</h2>
        <input class="option-form__input" type="number" v-model="optionFormState.initiativeMin">
        <span>-</span>
        <input class="option-form__input" type="number" v-model="optionFormState.initiativeMax">
      </div>
      <div class="option-form__input-wrapper">
        <h2 class="option-form__input-title">Разброс HP</h2>
        <input class="option-form__input" type="number" v-model="optionFormState.hpMin">
        <span>-</span>
        <input class="option-form__input" type="number" v-model="optionFormState.hpMax">
      </div>
    </div>

    <div class="option-form__footer">
      <button class="option-form__button" @click="$emit('save')">Сохранить</button>

    </div>
  </CommonForm>
</template>


<style >
.option-form__input-wrapper:last-child {
}
.option-form__footer {
  position: sticky;
  bottom: 0;
  background-color: #fff;
}
.option-form__input-title {
  margin-bottom: 12px;
}

.option-form__input {
  height: 40px;
  font-size: 20px;
  width: 80px;
  text-align: center;
}

.option-form__button {
  margin-top: 20px;
}
</style>
