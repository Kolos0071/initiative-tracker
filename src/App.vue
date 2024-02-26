<script setup lang="ts">
import type {IFormState, ICharItem} from "./internal"
import { ref, Ref, onMounted } from 'vue'


   const formState:Ref<IFormState>= ref({
        isOpen: false,
        name: "Боец 1",
        initiative: 0,
        hits: 5
    })

    const fightersList: Ref<ICharItem[]> = ref([]);

    function formToggler() {
        formState.value.isOpen = !formState.value.isOpen;
    }

    function addFighter() {
        const fighter: ICharItem = {
            name: formState.value.name,
            initiative:formState.value.initiative,
            hits: formState.value.hits
        };
        fightersList.value.push(fighter);
        fightersList.value.sort( (a, b) => {
            return a.initiative - b.initiative;});
        formState.value.name = "Боец 1";
        formState.value.initiative = 0;
        formState.value.hits = 5;
    }
    function dealDamage(index: number) {
      fightersList.value[index].hits --;
    }
</script>

<template>
  <div>
   <h1>TRACKER</h1>
  </div>
  <main>
    <div class="container">
      <div
        class="form"
        :class="{'form_active': formState.isOpen}"
      >
        <div
          class="form__overlay"
          @click="formToggler"
        />
        <div class="form__input-wrapper">
          <div>
            <label for="">Name</label>
            <input
              v-model="formState.name"
              type="text"
            >
          </div>
          <div>
            <label for="">Initiative</label>
            <input
              v-model="formState.initiative"
              type="number"
            >
          </div>
          <div>
            <label for="">Hits</label>
            <input
              v-model="formState.hits"
              type="number"
            >
          </div>
          <button @click="formToggler">
            cancel
          </button>
          <button @click="addFighter">
            add
          </button>
        </div>
      </div>
      <h1 class="fight__title">FIGHT</h1>
      <button
        class="fight__add-button"
        @click="formToggler"
      >
        Добавить бойца
      </button>
      <ul class="fighter-list">
        <li
          v-for="(fighter, id) in fightersList"
          :key="id"
          class="fighter-list__item"
          :class="{'fighter-list__item_disabled': fighter.hits <= 0}"
        >
          <h2>{{ fighter.name }}</h2>
          <h3>{{ fighter.initiative }}</h3>
          <div v-if="fighter.hits > 0">
            <span
              v-for="(item, index) in fighter.hits"
              :key="index"
              class="fighter__hits"
            />
          </div>
          <button
            v-if="fighter.hits > 0"
            @click="dealDamage(id)"
          >
            Нанести урон
          </button>
        </li>
      </ul>
    </div>
  </main>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.form {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    align-items: center;
    justify-content: center;
}

.form_active {
    display: flex;
}


.fight__title {
    margin-bottom: 24px;
}

.fight__add-button {
    background-color: #cacaca;
    border: 1px solid transparent;
    margin-bottom: 24px;
    padding: 12px;
}

.fight__add-button:hover {
    border-color: black;
}

.fighter__hits {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: red;
}

.fighter__hits:not(:last-child) {
    margin-right: 2px;
}

.form__overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: rgba(0, 0, 0, .5);
    z-index: -1;
}

.form__input-wrapper {
    background-color: #fff;
    padding: 12px;
}

.fighter-list {
    display: flex;
    flex-wrap: wrap;
}

.fighter-list__item {
    width: 320px;
    padding: 12px;
    background-color: #cacaca;

}

.fighter-list__item:not(:last-child) {
    margin-bottom: 12px;
    margin-right: 12px;
}

.fighter-list__item_disabled {
    opacity: 0.5;
    pointer-events: none;
    background-image: url("./dead.png");
    background-size: contain;
    background-position: right;
}
</style>
