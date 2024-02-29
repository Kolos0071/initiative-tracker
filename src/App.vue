<script setup lang="ts">
import type {IFormState, ICharItem} from "./internal"
import { ref, Ref, onMounted } from 'vue'

let counter = 1;

   const formState:Ref<IFormState>= ref({
        isOpen: false,
        name: "Боец " + counter,
        initiative: 2,
        hits: 5,
        reset() {
            this.name = "Боец " + counter;
            this.initiative =  2;
            this.hits = 5;
        }
    })

    const fightersList: Ref<ICharItem[]> = ref([]);

    function formToggler() {
        formState.value.isOpen = !formState.value.isOpen;
    }

    function addFighter() {
        const fighter: ICharItem = {
            name: formState.value.name,
            initiative:formState.value.initiative,
            hits: formState.value.hits,
            tempDamage: 1,
        };
        fightersList.value.push(fighter);
        counter ++;
        fightersList.value.sort( (a, b) => {
            return a.initiative - b.initiative;});
        formState.value.reset();
    }
    function dealDamage(index: number, tempDamage: number) {
      fightersList.value[index].hits -= tempDamage;
    }

    function deleteFighters() {
      fightersList.value = [];
      counter = 1;
      formState.value.reset();
    }
    function addRandomFighter() {
      const fighter: ICharItem = {
            name: formState.value.name,
            initiative:  Math.round(Math.random() * 18 + 2),
            hits: formState.value.hits,
            tempDamage: 1,
        };
        fightersList.value.push(fighter);
        counter ++;
        fightersList.value.sort( (a, b) => {
            return b.initiative - a.initiative;});
        formState.value.reset();
    }

    onMounted(()=>{
      document.addEventListener("keydown",(e)=>{
        if(e.code === "KeyA") {
          formToggler();
        }

        if(e.key === "Escape") {
          formState.value.isOpen = false;
        }

        if(e.key === "Delete") {
          deleteFighters();
        }
      })
    })
</script>

<template>
  <main>
    <div class="container"
    >
      <div
        class="form"
        :class="{'form_active': formState.isOpen}"
      >
        <div
          class="form__overlay"
          @click="formToggler"
          
        />
        <div class="form__wrapper">
          <ul class="form__input-list">
          <li class="form__input-wrapper">
            <label class="form__input-label" for="">Имя</label>
            <input
              v-model="formState.name"
              type="text"
            >
          </li>
          <li class="form__input-wrapper">
            <label class="form__input-label" for="">Инициатива</label>
            <input
              v-model="formState.initiative"
              type="number"
            >
          </li>
          <li class="form__input-wrapper">
            <label class="form__input-label" for="">Хиты</label>
            <input
              v-model="formState.hits"
              type="number"
            >
          </li>
          
        </ul>
        <div class="form__button-wrapper">
            <button @click="formToggler">
              Отмена
            </button>
            <button @click="addFighter">
              Добавить
            </button>
        </div>
        
        </div>
       
      </div>
      <div class="fight__add-button-wrapper">
        <button
        class="fight__add-button"
        @click="formToggler"
      >
        Добавить бойца
      </button>
      <button
        class="fight__add-button"
        @click="addRandomFighter"
      >
        Random
      </button>
      </div>
      
      <ul class="fighter-list">
        <li
          v-for="(fighter, id) in fightersList"
          :key="id"
          class="fighter-list__item-wrapper"
        >
         <div class="fighter-list__item"
          :class="{'fighter-list__item_disabled': fighter.hits <= 0}">
          <h2>{{ fighter.name }}</h2>
          <h3>{{ fighter.initiative }}</h3>
          <div v-if="fighter.hits > 0">
            <span
              v-for="(item, index) in fighter.hits"
              :key="index"
              class="fighter__hits"
            />
          </div>
          <div  v-if="fighter.hits > 0">
            <input type="number" v-model="fighter.tempDamage">
            <button
              @click="dealDamage(id, fighter.tempDamage)"
            >
              Нанести урон
            </button>
          </div>
         </div>
        </li>
      </ul>
    </div>
  </main>
</template>
