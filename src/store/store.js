import { writable } from 'svelte/store';

export const modalOpen = writable(false);
export const selectedAthlete = writable("");
export const language = writable("french");
