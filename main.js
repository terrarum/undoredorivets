// List of tasks.
var tasks = [];

var view;

var GUID = function() {
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return id;
};

// Return the requested task.
var getTask = function(id) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return tasks[i];
        }
    }
};

// Task model.
var taskModel = function(task, id) {
  return {
      id: id,
      task: task,
      done: false
  }
};

// Create a task.
var createTask = function(task) {
    return taskModel(task, GUID());
}

// Add a task.
var addTask = function(command) {
    var task = command.data;
    if (command.meta !== undefined) {
        if (command.meta.position !== undefined) {
            tasks.splice(command.meta.position, 0, task);
        }
        else {
            tasks.push(task);
        }
    }
    else {
        tasks.push(task);
    }
};

// Remove a task from the array.
var deleteTask = function(command) {
    var id = command.data.id;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks.splice(i, 1)
            return;
        }
    }
};

// Returns a command object containing the intended task and the data required.
var createCommand = function(action, data, meta) {
    var command = {
        action: action,
        data: data,
        meta: meta
    }

    // Store a clone of the command rather than a reference.
    undoQueue.push(clone(command));

    // Execute the command. Parent function is badly named, deal with it.
    executeCommand(command);
};

// Deep clone an object.
var clone = function(obj) {
    return $.extend(true, {}, obj)
};

// Invert the commands operation.
var invertCommand = function(command) {
    switch(command.action) {
        case 'addTask':
            command.action = 'deleteTask';
            break;
        case 'deleteTask':
            command.action = 'addTask';
            break;
    }
}

// Execute a given command.
var executeCommand = function(command, inverse) {
    if (inverse) {
        invertCommand(command);
    }
    switch(command.action) {
        case 'addTask':
            addTask(command);
            break;

        case 'deleteTask':
            deleteTask(command);
            break;

        default:
            console.log('Task "' + command.action + '" unsupported.');
    }
};

// The list of commands performed.
undoQueue = [];
redoQueue = [];

// Let's go!
$(function() {

    createCommand("addTask", createTask("Walk Dogs"));
    createCommand("addTask", createTask("Buy Milk"));
    createCommand("addTask", createTask("Call Mum"));
    createCommand("addTask", createTask("Find Nemo"));
    createCommand("addTask", createTask("Eat Pizza"));

    // Add task when New Task form is submitted.
    $('.js-add-task').on("submit", function(ev) {
        ev.preventDefault();
        var task = $('.js-new-task').val();
        // Don't add blank tasks.
        if (task !== "" && task !== undefined) {
            $('.js-new-task').val("");

            // Create the task and add it to the command.
            createCommand("addTask", createTask(task));
        }
    });

    // Delete a task by its id.
    $('.js-todos').on('click', '.js-delete', function(ev) {
        ev.preventDefault();
        var taskId = $(this).attr('data-id');

        var task = getTask(taskId);

        var meta = {
            position: $(".js-delete").index(this)
        }

        createCommand("deleteTask", task, meta);
    });

    // Bind tasks array to view. Stores view in case we need to unbind it later.
    view = rivets.bind($('.js-todos'), {tasks: tasks});

    // Listen for Undo and Redo events.
    $('body').on('undo', function() {
        // Get last command.
        var command = undoQueue.pop();
        if (command !== undefined) {
            redoQueue.push(command);

            // Perform opposite action.
            executeCommand(command, true);
        }
    });
    $('body').on('redo', function() {
        var command = redoQueue.pop();
        if (command !== undefined) {
            undoQueue.push(command);

            executeCommand(command);
        }
    });

    // Listen for Undo and Redo clicks.
    $('.js-undo').on('click', function() {
        $('body').trigger('undo');
    });
    $('.js-redo').on('click', function() {
        $('body').trigger('redo');
    });
});