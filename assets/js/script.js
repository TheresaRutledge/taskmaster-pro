var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function (list, arr) {
    // then loop over sub-array
    arr.forEach(function (task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//listens for click on list item text and saves text in variable
$(".list-group").on("click","p",function (){
  console.log(this);
  var text=$(this)
  .text()
  .trim();
  var textInput = $('<textarea>')
  .addClass('form-control')
  .val(text);
  $(this).replaceWith(textInput);
  textInput.trigger('focus');
});
$('.list-group').on('blur','textarea', function () {
  //textareas current value
  var text = $(this)
  .val()
  .trim();

  //parent ul's id attribute
  var status = $(this)
  .closest('.list-group')
  .attr('id')
  .replace('list-','');

  //tasks position in the list
  var index = $(this)
  .closest('.list-group-item')
  .index();

  tasks[status][index].text = text;
  saveTasks();

  //recreate p element
  var taskP = $('<p>')
  .addClass('m-1')
  .text(text);

  //repace textarea with p element
  $(this).replaceWith(taskP);
})

//listens for click on due date to edit
$('.list-group').on('click','span',function () {
  //current text
  var date = $(this)
  .text()
  .trim();

  //create new input element
  var dateInput = $('<input>')
  .attr('type', 'text')
  .addClass('form-control')
  .val(date);

  //swap element
  $(this).replaceWith(dateInput);

  //focus on new element
  dateInput.trigger('focus');

})

//when value of date is changes
$('.list-group').on('blur', "input[type='text']",function () {
  var date = $(this)
  .val()
  .trim();

  // parent ul's id
  var status = $(this)
  .closest('.list-group')
  .attr('id')
  .replace('list-','');

  // get position of task
  var index = $(this)
  .closest('.list-group-item')
  .index();

  //update task in array and resave
  tasks[status][index].date = date;
  saveTasks();

  //recreate element with bootstrap classes
  var taskSpan = $('<span>')
  .addClass('badge badge-primary badge-pill')
  .text(date);

  //replace input with span
  $(this).replaceWith(taskSpan)
})




// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function () {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function () {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


