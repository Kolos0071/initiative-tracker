<template>
  <div class="battle-log-window">
    <header class="battle-log__header">
      <h2>Лог боя</h2>
      <div class="battle-log__actions">
        <button @click="clearLog">Очистить</button>
        <button @click="closeWindow">Закрыть</button>
      </div>
    </header>
    <main class="battle-log__content">
      <ul class="battle-log__list" v-if="battleLog.length > 0">
        <li v-for="entry in battleLog" :key="entry.id" class="battle-log__entry" :class="{ 'battle-log__entry--heal': entry.isHeal }">
          <span class="battle-log__round">[Раунд {{ entry.round }}]</span>
          <span class="battle-log__time">({{ entry.timestamp }})</span>
          <span v-if="entry.attackerName" class="battle-log__attacker">{{ entry.attackerName }}</span>
          <span v-if="entry.attackerName" class="battle-log__arrow">→</span>
          <span v-if="entry.targetName" class="battle-log__target">{{ entry.targetName }}</span>
          <span class="battle-log__damage" :class="{ 'battle-log__damage--heal': entry.isHeal }">
            {{ entry.isHeal ? '+' : '-' }}{{ entry.damage }}
          </span>
        </li>
      </ul>
      <p class="battle-log__empty" v-else>Лог пуст</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type BattleLogEntry = {
  id: number
  round: number
  attackerName?: string
  targetName?: string
  damage: number
  isHeal: boolean
  timestamp: string
}

const battleLog = ref<BattleLogEntry[]>([])

async function fetchLog() {
  try {
    const log = await window.api.getBattleLog()
    battleLog.value = log
  } catch (e) {
    console.error('Failed to fetch battle log:', e)
  }
}

function clearLog() {
  window.api.clearBattleLog()
  battleLog.value = []
}

function closeWindow() {
  window.api.closeBattleLogWindow()
}

// Подписка на обновления лога
onMounted(() => {
  fetchLog()
  
  window.api.onBattleLogUpdate(() => {
    fetchLog()
  })
})

onUnmounted(() => {
  // Очистка подписки при необходимости
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, system-ui, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
}

.battle-log-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 16px;
  background-color: var(--color-background);
}

.battle-log__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 12px;
}

.battle-log__header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.battle-log__actions {
  display: flex;
  gap: 8px;
}

.battle-log__actions button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: var(--color-button-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
}

.battle-log__actions button:hover {
  background-color: var(--color-button-hover);
  border-color: var(--color-primary);
}

.battle-log__content {
  flex: 1;
  overflow-y: auto;
}

.battle-log__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.battle-log__entry {
  padding: 10px 12px;
  background-color: var(--color-log-entry-bg);
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.battle-log__entry--heal {
  background-color: var(--color-heal-bg);
}

.battle-log__round {
  color: var(--color-log-text-secondary);
  font-size: 12px;
}

.battle-log__time {
  color: var(--color-log-text-secondary);
  font-size: 12px;
}

.battle-log__attacker {
  color: var(--color-warning);
  font-weight: 500;
}

.battle-log__target {
  color: var(--color-primary);
  font-weight: 500;
}

.battle-log__arrow {
  color: var(--color-log-text-secondary);
}

.battle-log__damage {
  margin-left: auto;
  font-weight: bold;
  font-size: 16px;
}

.battle-log__damage--heal {
  color: var(--color-log-heal-text);
}

.battle-log__entry:not(.battle-log__entry--heal) .battle-log__damage {
  color: var(--color-log-damage-text);
}

.battle-log__empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 40px;
  font-size: 16px;
}

/* Scrollbar styling */
.battle-log__content::-webkit-scrollbar {
  width: 8px;
}

.battle-log__content::-webkit-scrollbar-track {
  background: var(--color-background);
}

.battle-log__content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

.battle-log__content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}
</style>
