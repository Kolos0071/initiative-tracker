import {BTOptions} from "../../main/data-service";

export type CommonFormState = {
  isOpen: boolean
  toggler(): void
}

export interface IFormState extends CommonFormState {
  name: string;
  initiative: number;
  hits: number;
  armor: number;
  showArmor: boolean;
  reset(): void;
}

export type ICharItem = {
  name: string;
  initiative: number;
  hits: number;
  maxHits: number;
  tempDamage: number;
  isActive: boolean;
  isDead: boolean;
  armor: number;
};

export type IOptionsFormState = CommonFormState & BTOptions;
