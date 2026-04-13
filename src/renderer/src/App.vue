<template>

    <OptionsForm :option-form-state="optionFormState" @save="saveOptions()"/>
    <FighterForm :form-state="formState" @add="addFighter()"/>

<header class="header">
  <button class="option-button" @click="optionFormState.toggler">Options</button>

  <ul class="tip">
    <li>Delete - очистить поле</li>
    <li>Escape - закрыть форму</li>
  </ul>
  <h1>Раунд:{{ roundCounter }}</h1>
  <div class="fight__add-button-wrapper">
    <button class="fight__add-button" @click="formState.toggler()">Добавить бойца</button>
    <button class="fight__add-button" @click="addRandomFighter">Случайный боец</button>
    <button class="fight__add-button" @click="openBattleLog">📜 Лог боя</button>
  </div>
  <button class="fight__add-button" @click="cancelAttack" v-if="attackState.isAttacking">Отмена атаки</button>
</header>
  <main>
    <div class="container">
      <div class="main-content">
        <ul class="fighter-list">
          <li v-for="(fighter, id) in fightersList" :key="id" class="fighter-list__item-wrapper">
            <div
              class="fighter-list__item fighter"
              :class="{ 'fighter_attack-target': attackState.isAttacking && id !== attackState.attackerIndex }"
              @click="attackState.isAttacking ? selectTarget(id) : null"
            >
              <button class="fighter__remove-button" @click="removeFighter(id)">X</button>
              <h2>{{ fighter.name }}</h2>
              <h3>Инициатива: {{ fighter.initiative }}</h3>
              <div v-if="fighter.hits > 0">
                <div  class="fighter__armor-wrapper" v-if="optionFormState.showArmor">
                  <h4 class="fighter__armor-title">Броня:</h4>
                  <h3 class="fighter__armor-value" >
                    <span>{{ fighter.armor }}</span>
                  </h3>
                </div>
                <div>
                  <h4>HP:</h4>
                  <h3 class="fighter__hp" :class="{'fighter__hp_wounded':fighter.hits<fighter.maxHits}">
                    <span>{{ fighter.hits }}</span
                    >/<span>{{ fighter.maxHits }}</span>
                  </h3>
                </div>
              </div>
              <div class="fighter__handler-list" v-if="fighter.hits > 0">
                <label for="">Урон/Исцеление:</label>
                <input @keyup="setMin(fighter)" min="1" class="fighter__handler fighter__input"  v-model="fighter.tempDamage" type="number" />
                <button class="fighter__handler fighter__button" @click="dealDamage(id, fighter.tempDamage)">{{"Нанести урон: "+fighter.tempDamage}}</button>
                <button class="fighter__handler fighter__button" @click="healDamage(id, fighter.tempDamage)">{{"Исцелить: "+fighter.tempDamage}}</button>
                <button class="fighter__handler fighter__button" :class="{ 'item_disabled': !fighter.isActive }"  @click="makeMove(id)">Ход</button>
                <button 
                  class="fighter__handler fighter__button attack-button" 
                  @click="startAttack(id)" 
                  v-if="fighter.isActive && !attackState.isAttacking"
                >
                  Удар
                </button>
                <button 
                  class="fighter__handler fighter__button attack-button active" 
                  v-if="attackState.attackerIndex === id"
                >
                  Выберите цель
                </button>
                <button 
                  class="fighter__handler fighter__button attack-button item_disabled" 
                  v-if="!fighter.isActive && !attackState.isAttacking"
                >
                  Удар
                </button>
              </div>
              <div v-else>
                <button @click="healDamage(id, 1)">Воскресить</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script lang="ts" src="./app.ts" />
