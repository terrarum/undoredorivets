# Undo/Redo and RivetsJS

This is a demonstration of the Command pattern (sort-of) using RivetsJS.

## So what's going on?

My goal was to learn how to implement undo and redo in a basic todo app. This is achieved by separating intent and action.

For example: Let's say we have an array containing the list of tasks, and a text input that you use to write your new tasks in. You write 'Buy Milk' in the text input and hit enter.
 
 The simplest way to add this task to the array would be something like the following:
 
    $('.js-add-task').on('click', function() {
        tasks.push($('.task-input').val());    
    }
    
You would be better served by passing the text value into a model first that can track the completion state of the task and so on, but this is simple enough for now. What it definitely does not do is provide an easy way of undoing this action, or repeating it later.

Instead we use this information to create an object that describes what we want to happen next.
  
## What's RivetsJS got to do with it?

RivetsJS just happens to be the library I wanted to use to handle templating and data-binding. As the undo and redo is simply the manipulation of an array, and RivetsJS is great at rendering an array with a given template, it seemed like a good pairing. 




Click 'add task'.
Command object is created: addTask, taskstring.
Command is pushed into queue.
Command is also performed.


Each command is an action, and the entire task that its operation refers to
