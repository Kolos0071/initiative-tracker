export type IFormState = {
    isOpen: boolean;
    name: string;
    initiative: number;
    hits: number;
    reset(): void;
}

export type ICharItem = {
    name: string;
    initiative: number;
    hits: number;
    tempDamage: number;
}
