<template>
  <CommonForm class="fighter-form" :is-open="formState.isOpen" @close="formState.toggler()">
    <div class="fighter-form__wrapper">
      <ul class="fighter-form__input-list">
        <li class="fighter-form__input-wrapper">
          <label class="fighter-form__input-label" for="">Имя</label>
          <input class="fighter-form__input" v-model.trim="formState.name" type="text" />
        </li>
        <li class="fighter-form__input-wrapper">
          <label class="fighter-form__input-label" for="">Инициатива</label>
          <input class="fighter-form__input" v-model.number="formState.initiative" type="number" />
        </li>
        <li class="fighter-form__input-wrapper">
          <label class="fighter-form__input-label" for="">Хиты</label>
          <input class="fighter-form__input" v-model.number="formState.hits" type="number" />
        </li>
      </ul>
      <div class="fighter-form__button-wrapper">
        <button class="fighter-form__button" @click="formState.toggler()">Отмена</button>
        <button class="fighter-form__button" @click="$emit('add')">Добавить</button>
      </div>
    </div>
  </CommonForm>
</template>

<script setup lang="ts">
import type { IFormState } from '../internal';
import CommonForm from "./CommonForm.vue";
import {defineProps} from "vue";
defineProps<{
  formState: IFormState
}>()
</script>

<style scoped>

</style>
