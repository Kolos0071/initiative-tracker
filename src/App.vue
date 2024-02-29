<script setup lang="ts">
import Form from "./components/Form.vue"
import type {IFormState, ICharItem} from "./internal"
import { ref, Ref, onMounted } from 'vue'

let counter: number = 1;
let roundCounter: number = 1;

const optionFormState = ref({
  isOpen: false,
  toggler() {
    this.isOpen = !this.isOpen;
  },
})

   const formState:Ref<IFormState>= ref({
        isOpen: false as boolean,
        name: "Боец " + counter,
        initiative: 2,
        hits: 5,
        toggler() {
          this.isOpen = !this.isOpen;
        },
        reset() {
            this.name = "Боец " + counter;
            this.initiative =  2;
            this.hits = 5;
        }
    })

    const fightersList: Ref<ICharItem[]> = ref([]);

    function addFighter() {
        const fighter: ICharItem = {
            name: formState.value.name,
            initiative:formState.value.initiative,
            hits: formState.value.hits,
            maxHits: formState.value.hits,
            tempDamage: 1,
            isActive: true,
            isDead: false
        };
        fightersList.value.push(fighter);
        counter ++;
        fightersList.value.sort( (a, b) => {
            return a.initiative - b.initiative;});
        formState.value.reset();
    }
    function dealDamage(index: number, tempDamage: number) {
      fightersList.value[index].hits -= tempDamage;
      if(fightersList.value[index].hits <= 0) {
        fightersList.value[index].isDead = true;
        fightersList.value[index].isActive = false;
      }
    }

    function deleteFighters() {
      fightersList.value = [];
      counter = 1;
      roundCounter = 1;
      formState.value.reset();
    }
    function addRandomFighter() {
      const fighter: ICharItem = {
            name: formState.value.name,
            initiative:  Math.round(Math.random() * 18 + 2),
            hits: formState.value.hits,
            maxHits: formState.value.hits,
            tempDamage: 1,
            isActive: true,
            isDead: false
        };
        fightersList.value.push(fighter);
        counter ++;
        fightersList.value.sort( (a, b) => {
            return b.initiative - a.initiative;});
        formState.value.reset();
    }

    function makeMove(index: number) {
      fightersList.value[index].isActive = false;
      checkRound()
    }

    function checkRound() {
      if(fightersList.value.every(item=>!item.isActive)) {
        fightersList.value.forEach(fighter=>{
          if(!fighter.isDead) {
            fighter.isActive = true;
          }
        })
        roundCounter ++;
      }
    }

    onMounted(()=>{
      document.addEventListener("keydown",(e)=>{
        if(e.code === "KeyA") {
          formState.value.toggler();
        }

        if(e.code === "KeyO") {
          optionFormState.value.toggler();
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
  <button @click="optionFormState.toggler" class="option-button">*</button>
  <Form :is-open="optionFormState.isOpen" @close="optionFormState.toggler()" class="option-form">
    <h1>OPTION FORM</h1>
  </Form>
  <Form class="fighter-form" :is-open="formState.isOpen" @close="formState.toggler()">
    <ul class="fighter-form__input-list">
      <li class="fighter-form__input-wrapper">
        <label class="fighter-form__input-label" for="">Имя</label>
        <input
          v-model="formState.name"
          type="text"
        >
      </li>
      <li class="fighter-form__input-wrapper">
        <label class="fighter-form__input-label" for="">Инициатива</label>
        <input
          v-model="formState.initiative"
          type="number"
        >
      </li>
      <li class="fighter-form__input-wrapper">
        <label class="fighter-form__input-label" for="">Хиты</label>
        <input
          v-model="formState.hits"
          type="number"
        >
      </li>
    </ul>
    <div class="fighter-form__button-wrapper">
        <button @click="formState.toggler()">
          Отмена
        </button>
        <button @click="addFighter">
          Добавить
        </button>
    </div>
  </Form>
  <h1> Раунд:{{ roundCounter }}</h1>
  <main>
    <div class="container"
    >
      <div class="fight__add-button-wrapper">
        <button
        class="fight__add-button"
        @click="formState.toggler()"
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
          :class="{'fighter-list__item_disabled': fighter.isDead || !fighter.isActive}">
          <h2>{{ fighter.name }}</h2>
          <h3>{{ fighter.initiative }}</h3>
          <div v-if="fighter.hits > 0">
            <div>
              <span>{{ fighter.hits }}</span>/ <span>{{ fighter.maxHits }}</span>
            </div>
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
            <button @click="makeMove(id)">Ход</button>
          </div>
         </div>
        </li>
      </ul>
    </div>
  </main>
</template>
