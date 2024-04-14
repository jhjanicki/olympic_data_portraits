# Olympic data portraits

WIP

Phase 1 deadline: April 27
Phase 2 deadline: May 27

## Notes to Jeremy

all data files in **src/assets/data**

1. prepare JSON with list of questions and answers for each shape (refer to **questionsData.js**), with the following attributes, this is for the interactive part of the logo and also for the make your own portrait part: **(TODO)** For April 27
      - id: currently I'm using the color of the shape i.e. pink, blue, etc (keep the same id as the one in logoData so I can link the shape to the question)
      - question: the question associated with a color / shape
      - question_id: give each question an id so later on can filter the athlete's shapes by it, i.e. "question1"
      - answers: currently it's an array of the list of possible answers to show up in the dropdown menu, but I think we should make it an array of objects, with each object having an "answer" attribute showing the text, and a "path" or "paths" attribute that stores the svg path of the associated answer

      [{"id":"", "question":"", "question_id":"", "answers":[{"answer":"","paths":[]},{"answer":"","paths":[]},{"answer":"","paths":[]}]},
       {"id":"", "question":"", "question_id":"", "answers":[{"answer":"","paths":[]},{"answer":"","paths":[]},{"answer":"","paths":[]}]},
       {"id":"", "question":"", "question_id":"", "answers":[{"answer":"","paths":[]},{"answer":"","paths":[]},{"answer":"","paths":[]}]}]
        
3. Update logo JSON data (refer to **logoData.js**).  It's mainly prepared but you need to add a "text" attribute for each object.  Here are all the attributes:
      - text: the text to show up by the shape, i.e. hobbies **(TODO)** For April 27
      - id: currently I'm using the color of the shape i.e. pink, blue, etc 
      - color: the hex color to use as the fill of the paths
      - paths: array with the paths in a shape (only the orange shape has two paths)
        
4. For the make your own portrait section:
      - let me know the final list of questions and answers, if it's the same as the athletes we can just use the questionsData.js
      - I need a general layout of where each shape will go, and a json file of all the questions with all possible answers and the associated path(s) (maybe we can call it **yourPortrait.js**) **(TODO)** For April 27

        [{"question":"","question_id":"","anwsers":[{"answer":"", "paths":[], "answer_id":""},{"answer":"", "paths":[], "answer_id":""}]},
        {"question":"","question_id":"","anwsers":[{"answer":"", "paths":[], "answer_id":""},{"answer":"", "paths":[], "answer_id":""}]},
        {"question":"","question_id":"","anwsers":[{"answer":"", "paths":[], "answer_id":""},{"answer":"", "paths":[], "answer_id":""}]}]

5. For the athlete's data portrait section, a JSON file similar to questionsData.js would need to be prepared that includes the svg paths for each athlete (**portraits.js**) **(TODO)** For May 27
      - name: name of athlete
      - sport: sport of athele
      - class: to link all the shapes associated to the same question (i.e. all the orange shapes) across all athletes.  i.e. "orange"
      - questions: list of all questions, and for each question the athlete's answer and the shape's paths
  
        [{"name":"","sport":"","class":"", "questions": [{"question":"","answer":"","paths":[]},{"question":"","answer":"","paths":[]},{"question":"","answer":"","paths":[]}]},
        {"name":"","sport":"","class":"", "questions": [{"question":"","answer":"","paths":[]},{"question":"","answer":"","paths":[]},{"question":"","answer":"","paths":[]}]},
        {"name":"","sport":"","class":"", "questions": [{"question":"","answer":"","paths":[]},{"question":"","answer":"","paths":[]},{"question":"","answer":"","paths":[]}]}]
    
