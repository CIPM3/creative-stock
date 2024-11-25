export type StoreState = {
    bears: number;
    increasePopulation: () => void;
    decreasePopulation: () => void;
    removeAllBears: () => void;
    updateBears: (newBears: number) => void;
};