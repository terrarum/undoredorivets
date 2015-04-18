rivets.components['todo-item'] = {
    template: function() {
        return '<div class="input-group task js-task">' +
            '<span class="input-group-btn">' +
                '<button class="btn btn-default js-delete" type="button" rv-data-id="todo.id">Delete</button>' +
            '</span>' +
            '<input type="text" class="form-control js-task" rv-value="todo.task">' +
            '<span class="input-group-addon">' +
                '<input type="checkbox" rv-checked="task.done">' +
            '</span>' +
            '</div>';
    },
    initialize: function(el, data) {
        return data;
    }
};