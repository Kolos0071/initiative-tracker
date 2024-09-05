import Form from './components/Form.vue'
import type { IFormState, ICharItem } from './internal'
import { ref, Ref, onMounted } from 'vue'

export default {
    components: {
        Form: Form
    },

    setup() {


        let counter: number = 1
        const roundCounter: Ref<number> = ref(1)

        const optionFormState = ref({
            isOpen: false,
            toggler() {
                this.isOpen = !this.isOpen
            }
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

        const fightersList: Ref<ICharItem[]> = ref([])

        const data = async () => {
            const data = await window.api.getData()

            console.log(data)
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
                return a.initiative - b.initiative
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

        function deleteFighters() {
            fightersList.value = []
            counter = 1
            roundCounter.value = 1
            formState.value.reset()
        }
        function addRandomFighter() {
            data()
            const fighter: ICharItem = {
                name: formState.value.name,
                initiative: Math.round(Math.random() * 18 + 2),
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
            document.addEventListener('keydown', (e) => {
                if (e.code === 'KeyA') {
                    formState.value.toggler()
                }

                if (e.code === 'KeyO') {
                    optionFormState.value.toggler()
                }

                if (e.key === 'Escape') {
                    formState.value.isOpen = false
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
            roundCounter
        }
    }
}
