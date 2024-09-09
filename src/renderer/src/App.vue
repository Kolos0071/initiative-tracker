<template>
  <button class="option-button" @click="optionFormState.toggler">Options</button>
  <Form :is-open="optionFormState.isOpen" class="option-form" @close="optionFormState.toggler()">
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
    <button @click="saveOptions()">Save</button>
  </Form>
  <Form class="fighter-form" :is-open="formState.isOpen" @close="formState.toggler()">
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
       <button class="fighter-form__button" @click="addFighter">Добавить</button>
     </div>
   </div>
  </Form>
  <h1>Раунд:{{ roundCounter }}</h1>
  <main>
    <div class="container">
      <div class="fight__add-button-wrapper">
        <button class="fight__add-button" @click="formState.toggler()">Добавить бойца</button>
        <button class="fight__add-button" @click="addRandomFighter">Случайный боец</button>
      </div>

      <ul class="fighter-list">
        <li v-for="(fighter, id) in fightersList" :key="id" class="fighter-list__item-wrapper">
          <div
            class="fighter-list__item fighter"
          >
            <h2>{{ fighter.name }}</h2>
            <h3>Инициатива: {{ fighter.initiative }}</h3>
            <div v-if="fighter.hits > 0">
              <div>
                <h4>HP:</h4>
                <h3 class="fighter__hp" :class="{'fighter__hp_wounded':fighter.hits<fighter.maxHits}">
                  <span>{{ fighter.hits }}</span
                  >/<span>{{ fighter.maxHits }}</span>
                </h3>
              </div>
<!--              <span v-for="(_, index) in fighter.hits" :key="index" class="fighter__hits" />-->
            </div>
            <div class="fighter__handler-list" v-if="fighter.hits > 0">
              <input class="fighter__handler fighter__input" v-model="fighter.tempDamage" type="number" />
              <button class="fighter__handler fighter__button" @click="dealDamage(id, fighter.tempDamage)">Нанести урон</button>
              <button class="fighter__handler fighter__button" @click="healDamage(id, fighter.tempDamage)">{{fighter.hits>= fighter.maxHits?"Добавить HP":"Исцелить"}}</button>
              <button class="fighter__handler fighter__button" :class="{ 'item_disabled': !fighter.isActive }"  @click="makeMove(id)">Ход</button>

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
