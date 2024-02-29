export type IFormState = {
    isOpen: boolean;
    name: string;
    initiative: number;
    hits: number;
    reset(): void;
    toggler(): void
}

export type ICharItem = {
    name: string;
    initiative: number;
    hits: number;
    maxHits: number;
    tempDamage: number;
    isActive: boolean;
    isDead: boolean;
}
