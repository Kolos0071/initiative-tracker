export type CommonFormState = {
  isOpen: boolean
  toggler(): void

}

export interface IFormState extends CommonFormState {
  name: string
  initiative: number
  hits: number
  reset(): void
}

export type ICharItem = {
  name: string
  initiative: number
  hits: number
  maxHits: number
  tempDamage: number
  isActive: boolean
  isDead: boolean
}

export interface IOptionsFormState extends CommonFormState{
  initiativeMax: number
  initiativeMin: number
  hpMax: number
  hpMin: number
}
