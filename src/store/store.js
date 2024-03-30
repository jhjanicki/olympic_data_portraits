import { writable, derived, readable } from 'svelte/store';
import {questionsData}  from "../assets/data/questionsData";


export const selectedQuestion = writable("");
export const data = readable(questionsData);
export const selectedAnswers = writable([]);
export const selectedAnswer = writable([]);
export const shapeClicked = writable(false);
export const shapeClickedOnce = writable(false);
export const questions = derived(data,$data =>{
    return $data.map(d=>d.question)
});

export const currentQuestionID = writable(0)
