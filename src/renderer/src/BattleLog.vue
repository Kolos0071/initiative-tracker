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
  background-color: #1a1a1a;
  color: #fff;
}

.battle-log-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 16px;
}

.battle-log__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
  margin-bottom: 12px;
}

.battle-log__header h2 {
  font-size: 20px;
  font-weight: 600;
}

.battle-log__actions {
  display: flex;
  gap: 8px;
}

.battle-log__actions button {
  padding: 6px 12px;
  font-size: 14px;
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
}

.battle-log__actions button:hover {
  background-color: #3a3a3a;
  border-color: #646cff;
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
  background-color: #2a2a2a;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.battle-log__entry--heal {
  background-color: #1a3a1a;
}

.battle-log__round {
  color: #888;
  font-size: 12px;
}

.battle-log__time {
  color: #666;
  font-size: 12px;
}

.battle-log__attacker {
  color: #ff9800;
  font-weight: 500;
}

.battle-log__target {
  color: #646cff;
  font-weight: 500;
}

.battle-log__arrow {
  color: #888;
}

.battle-log__damage {
  margin-left: auto;
  font-weight: bold;
  font-size: 16px;
}

.battle-log__damage--heal {
  color: #4caf50;
}

.battle-log__entry:not(.battle-log__entry--heal) .battle-log__damage {
  color: #f44336;
}

.battle-log__empty {
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 16px;
}

/* Scrollbar styling */
.battle-log__content::-webkit-scrollbar {
  width: 8px;
}

.battle-log__content::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.battle-log__content::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.battle-log__content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
