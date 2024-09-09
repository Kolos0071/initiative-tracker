<template>
  <button class="option-button" @click="optionFormState.toggler">Options</button>
  <Form :is-open="optionFormState.isOpen" class="option-form" @close="optionFormState.toggler()">
    <h1>OPTION FORM</h1>
    <p>
      Внимание! Любое несохраненное изменение опций будет сброшено после перезапуска приложения.
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
      <div>
        <h2>HP appearance</h2>
      </div>
    </div>
    <button @click="saveOptions()">Save</button>
  </Form>
  <Form class="fighter-form" :is-open="formState.isOpen" @close="formState.toggler()">
    <ul class="fighter-form__input-list">
      <li class="fighter-form__input-wrapper">
        <label class="fighter-form__input-label" for="">Имя</label>
        <input v-model="formState.name" type="text" />
      </li>
      <li class="fighter-form__input-wrapper">
        <label class="fighter-form__input-label" for="">Инициатива</label>
        <input v-model="formState.initiative" type="number" />
      </li>
      <li class="fighter-form__input-wrapper">
        <label class="fighter-form__input-label" for="">Хиты</label>
        <input v-model="formState.hits" type="number" />
      </li>
    </ul>
    <div class="fighter-form__button-wrapper">
      <button @click="formState.toggler()">Отмена</button>
      <button @click="addFighter">Добавить</button>
    </div>
  </Form>
  <h1>Раунд:{{ roundCounter }}</h1>
  <main>
    <div class="container">
      <div class="fight__add-button-wrapper">
        <button class="fight__add-button" @click="formState.toggler()">Добавить бойца</button>
        <button class="fight__add-button" @click="addRandomFighter">Random</button>
      </div>

      <ul class="fighter-list">
        <li v-for="(fighter, id) in fightersList" :key="id" class="fighter-list__item-wrapper">
          <div
            class="fighter-list__item"
          >
            <h2>{{ fighter.name }}</h2>
            <h3>{{ fighter.initiative }}</h3>
            <div v-if="fighter.hits > 0">
              <div>
                <span>{{ fighter.hits }}</span
                >/ <span>{{ fighter.maxHits }}</span>
              </div>
              <span v-for="(_, index) in fighter.hits" :key="index" class="fighter__hits" />
            </div>
            <div v-if="fighter.hits > 0">
              <input v-model="fighter.tempDamage" type="number" />
              <button @click="dealDamage(id, fighter.tempDamage)">Нанести урон</button>
              <button @click="healDamage(id, fighter.tempDamage)">{{fighter.hits>= fighter.maxHits?"Добавить":"Исцелить"}}</button>
              <button :class="{ 'item_disabled': !fighter.isActive }"  @click="makeMove(id)">Ход</button>

            </div>
            <div v-else>
              <button @click="healDamage(id, 1)">Воскресить</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts" src="./app.ts" />
