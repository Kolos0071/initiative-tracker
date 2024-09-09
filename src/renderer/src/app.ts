import CommonForm from './components/CommonForm.vue'
import FighterForm from './components/FighterForm.vue'
import OptionsForm from './components/OptionsForm.vue'
import type { IFormState, ICharItem, IOptionsFormState } from './internal'
import { ref, Ref, onMounted } from 'vue'
import {BTOptions} from "../../main/data-service";

export default {
    components: {
      CommonForm: CommonForm,
      OptionsForm: OptionsForm,
      FighterForm: FighterForm
    },

    setup() {
        let counter: number = 1
        const roundCounter: Ref<number> = ref(1)
        const fightersList: Ref<ICharItem[]> = ref([])
        const optionFormState:Ref<IOptionsFormState> = ref({
            isOpen: false as boolean,
            toggler() {
                this.isOpen = !this.isOpen
            },
            hpMin: 5,
            hpMax: 5,
            initiativeMax: 20,
            initiativeMin: 2
        })
        const formState: Ref<IFormState> = ref({
          isOpen: false as boolean,
          name: 'Боец ' + counter,
          initiative: 2,
          hits: 5,
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
          }
          await  window.api.setData(options);
          optionFormState.value.toggler();
      }

        async function getOptions() {
            const data = await window.api.getData()
          optionFormState.value.hpMin = data.hpMin;
          optionFormState.value.hpMax = data.hpMax;
          optionFormState.value.initiativeMin = data.initiativeMin;
          optionFormState.value.initiativeMax = data.initiativeMax;
        }

        function addFighter() {
            const fighter: ICharItem = {
                name: formState.value.name,
                initiative: formState.value.initiative,
                hits: formState.value.hits,
                maxHits: formState.value.hits,
                tempDamage: 1,
                isActive: true,
                isDead: false
            }
            fightersList.value.push(fighter)
            counter++
            fightersList.value.sort((a, b) => {
                return b.initiative - a.initiative
            })
            formState.value.reset()
        }
        function dealDamage(index: number, tempDamage: number) {
            fightersList.value[index].hits -= tempDamage
            if (fightersList.value[index].hits <= 0) {
                fightersList.value[index].isDead = true
                fightersList.value[index].isActive = false
            }
        }

        function healDamage(index: number, tempHealing: number) {
          if (fightersList.value[index].hits <= 0) {
            fightersList.value[index].hits = tempHealing
            fightersList.value[index].isDead = false
            fightersList.value[index].isActive = true
          } else {
            fightersList.value[index].hits += tempHealing
          }
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
            const fighter: ICharItem = {
                name: formState.value.name,
                initiative: getRange( optionFormState.value.initiativeMin, optionFormState.value.initiativeMax) ,
                hits: HP,
                maxHits: HP,
                tempDamage: 1,
                isActive: true,
                isDead: false
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
          saveOptions,
          healDamage
        }
    }
}
