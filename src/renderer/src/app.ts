import FighterForm from './components/FighterForm.vue'
import OptionsForm from './components/OptionsForm.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import type { IFormState, ICharItem, IOptionsFormState, BattleLogEntry, AttackState } from './internal'
import { ref, Ref, onMounted, computed } from 'vue'
import {BTOptions} from "../../main/data-service";

export default {
    components: {
      OptionsForm: OptionsForm,
      FighterForm: FighterForm,
      ThemeToggle: ThemeToggle
    },

    setup() {
        let counter: number = 1
        const roundCounter: Ref<number> = ref(1)
        const fightersList: Ref<ICharItem[]> = ref([])
        const battleLog: Ref<BattleLogEntry[]> = ref([])
        const attackState: Ref<AttackState> = ref({
          isAttacking: false,
          attackerIndex: null,
          attackerName: ''
        })
        const logIdCounter: Ref<number> = ref(0)
        
        function addLogEntry(entry: Omit<BattleLogEntry, 'id' | 'timestamp' | 'round'>) {
          logIdCounter.value++
          const logEntry: BattleLogEntry = {
            id: logIdCounter.value,
            round: roundCounter.value,
            ...entry,
            timestamp: new Date().toLocaleTimeString()
          }
          battleLog.value.unshift(logEntry)
          // Отправляем в main процесс для синхронизации с окном лога
          window.api.addBattleLogEntry(logEntry)
        }
        const optionFormState:Ref<IOptionsFormState> = ref({
          isOpen: false as boolean,
          toggler() {
              this.isOpen = !this.isOpen
          },
          hpMin: 5,
          hpMax: 5,
          initiativeMax: 20,
          initiativeMin: 2,
          showArmor: true,
          armorMax: 3,
          armorMin: 0,
          armorCount: false,
          armorCoefficient: 1
        })
        const formState: Ref<IFormState> = ref({
          isOpen: false as boolean,
          name: 'Боец ' + counter,
          initiative: 2,
          hits: 5,
          armor: 0,
          showArmor:false,
          toggler() {
            this.isOpen = !this.isOpen
          },
          reset() {
            this.name = 'Боец ' + counter
            this.initiative = 2
            this.hits = 5
          }
        })

      async function  saveOptions()  {
          let options: BTOptions = {
            hpMax: optionFormState.value.hpMax,
            hpMin: optionFormState.value.hpMin,
            initiativeMax: optionFormState.value.initiativeMax,
            initiativeMin: optionFormState.value.initiativeMin,
            showArmor: optionFormState.value.showArmor,
            armorMax:optionFormState.value.armorMax,
            armorMin:optionFormState.value.armorMin,
            armorCount: optionFormState.value.armorCount,
            armorCoefficient: optionFormState.value.armorCoefficient
          }
          formState.value.showArmor =optionFormState.value.showArmor;
          await  window.api.setData(options);
          optionFormState.value.toggler();
      }

        async function getOptions() {
            const data: BTOptions = await window.api.getData()
          optionFormState.value.hpMin = data.hpMin;
          optionFormState.value.hpMax = data.hpMax;
          optionFormState.value.initiativeMin = data.initiativeMin;
          optionFormState.value.initiativeMax = data.initiativeMax;
          optionFormState.value.showArmor =data.showArmor;
          optionFormState.value.armorMin =data.armorMin;
          optionFormState.value.armorMax= data.armorMax
          optionFormState.value.armorCount = data.armorCount
          optionFormState.value.armorCoefficient = data.armorCoefficient
          formState.value.showArmor =  optionFormState.value.showArmor;
        }

        function removeFighter(index: number) {
          console.log(index);
          
          if(fightersList.value.length == 1) {
            deleteFighters()
          } else {
            fightersList.value.splice(index,1);
          }
        }

        function addFighter() {
            const fighter: ICharItem = {
                name: formState.value.name,
                initiative: formState.value.initiative,
                hits: formState.value.hits,
                maxHits: formState.value.hits,
                tempDamage: 1,
                isActive: true,
                isDead: false,
                armor: formState.value.armor
            }
            fightersList.value.push(fighter)
            counter++
            fightersList.value.sort((a, b) => {
                return b.initiative - a.initiative
            })
            formState.value.reset()
        }
        function dealDamage(index: number, tempDamage: number) {
          if(optionFormState.value.armorCount) {
            if((tempDamage -  fightersList.value[index].armor) > 0) {
              fightersList.value[index].hits -= (tempDamage -  fightersList.value[index].armor);
            }
          }else {
            fightersList.value[index].hits -= tempDamage
          }
            if (fightersList.value[index].hits <= 0) {
                fightersList.value[index].isDead = true
                fightersList.value[index].isActive = false
            }
          
          addLogEntry({
            targetName: fightersList.value[index].name,
            damage: tempDamage,
            isHeal: false
          })
        }
          
        function commitAttack(targetIndex: number) {
          const attacker = fightersList.value[attackState.value.attackerIndex!]
          const target = fightersList.value[targetIndex]
          const damage = attacker.tempDamage
          
          if(optionFormState.value.armorCount) {
            if((damage - target.armor) > 0) {
              target.hits -= (damage - target.armor);
            }
          } else {
            target.hits -= damage
          }
          
          if (target.hits <= 0) {
            target.isDead = true
            target.isActive = false
          }
          
          addLogEntry({
            attackerName: attacker.name,
            targetName: target.name,
            damage,
            isHeal: false
          })
          
          attackState.value.isAttacking = false
          attackState.value.attackerIndex = null
          attackState.value.attackerName = ''
          attacker.tempDamage = 1
        }

        function healDamage(index: number, tempHealing: number) {
          if (fightersList.value[index].hits <= 0) {
            fightersList.value[index].hits = tempHealing
            fightersList.value[index].isDead = false
            fightersList.value[index].isActive = true
          } else {
            fightersList.value[index].hits += tempHealing
          }
          
          addLogEntry({
            targetName: fightersList.value[index].name,
            damage: tempHealing,
            isHeal: true
          })
        }

        function deleteFighters() {
            fightersList.value = []
            counter = 1
            roundCounter.value = 1
            formState.value.reset()
        }

        function  getRange(min: number, max: number): number {
          return  Math.round(Math.random() * (max - min) + min);
        }

        function addRandomFighter():void {
          const HP = getRange(optionFormState.value.hpMin, optionFormState.value.hpMax);
          const armour = getRange(optionFormState.value.armorMin, optionFormState.value.armorMax);
            const fighter: ICharItem = {
                name: formState.value.name,
                initiative: getRange( optionFormState.value.initiativeMin, optionFormState.value.initiativeMax) ,
                hits: HP,
                maxHits: HP,
                tempDamage: 1,
                isActive: true,
                isDead: false,
                armor: armour
            }
            fightersList.value.push(fighter)
            counter++
            fightersList.value.sort((a, b) => {
                return b.initiative - a.initiative
            })
            formState.value.reset()
        }

        function makeMove(index: number) {
            fightersList.value[index].isActive = false
            checkRound()
        }

        function startAttack(index: number) {
          attackState.value.isAttacking = true
          attackState.value.attackerIndex = index
          attackState.value.attackerName = fightersList.value[index].name
        }
        
        function selectTarget(index: number) {
          if (attackState.value.isAttacking && attackState.value.attackerIndex !== null) {
            // Запрещаем атаковать самого себя
            if (index === attackState.value.attackerIndex) {
              return
            }
            commitAttack(index)
          }
        }
        
        function cancelAttack() {
          attackState.value.isAttacking = false
          attackState.value.attackerIndex = null
          attackState.value.attackerName = ''
        }
        
        function openBattleLog() {
          // Получаем ID главного окна через electron API
          const mainWindowId = 1 // По умолчанию, electron-vite использует один main window
          window.api.openBattleLog(mainWindowId)
        }
        
        const nextAttackerIndex = computed(() => {
          return fightersList.value.findIndex(f => f.isActive && !f.isDead)
        })

        function checkRound() {
            if (fightersList.value.every((item) => !item.isActive)) {
                fightersList.value.forEach((fighter) => {
                    if (!fighter.isDead) {
                        fighter.isActive = true
                    }
                })
                roundCounter.value++
            }
        }

        onMounted(() => {
          getOptions();
          document.addEventListener('keydown', (e) => {

                if (e.key === 'Escape') {
                    formState.value.isOpen = false;
                    optionFormState.value.isOpen = false;
                }

                if (e.key === 'Delete') {
                    deleteFighters()
                }
            })
        })

      function  setMin(item: ICharItem) {
        if(item.tempDamage<0) {
          item.tempDamage = 1
        }
      }

        return {
            checkRound,
            fightersList,
            formState,
            optionFormState,
            makeMove,
            addFighter,
            addRandomFighter,
            deleteFighters,
            dealDamage,
            counter,
            roundCounter,
            battleLog,
            attackState,
            startAttack,
            selectTarget,
            cancelAttack,
            openBattleLog,
            nextAttackerIndex,
          saveOptions,
          healDamage,
          removeFighter,
          setMin
        }
    }
}
