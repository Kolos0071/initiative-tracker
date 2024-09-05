<template>
  <button class="option-button" @click="optionFormState.toggler">*</button>
  <Form :is-open="optionFormState.isOpen" class="option-form" @close="optionFormState.toggler()">
    <h1>OPTION FORM</h1>
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
            :class="{ 'fighter-list__item_disabled': fighter.isDead || !fighter.isActive }"
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
              <button @click="makeMove(id)">Ход</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts" src="./app.ts" />
