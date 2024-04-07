// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));


// Generate a unique task id
function generateTaskId() {
  nextId++;
  return nextId;
}

// Render tasks in appropriate lanes
function createTaskCard(task) {
  // Create a new card
  const newTaskCard = $("<div>");
  newTaskCard.addClass("card my-2 task-card todo-card");
  newTaskCard.attr("id", task.id);

  // Create a card header
  const newTaskCardHeader = $("<div>");
  newTaskCardHeader.addClass("card-header");
  newTaskCardHeader.text(task.name);

  // append the due date to the card
  const newTaskCardDueDate = $("<div>");
  newTaskCardDueDate.addClass("card-header");
  newTaskCardDueDate.text(task.dueDate);

  // Create a card body
  const newTaskCardBody = $("<div>");
  newTaskCardBody.addClass("card-body");
  newTaskCardBody.text(task.description);

  // Create a delete button
  const taskCardDeleteButton = $("<button>");
  taskCardDeleteButton.addClass("btn btn-danger");
  taskCardDeleteButton.text("Delete");
  taskCardDeleteButton.click(handleDeleteTask);

  // Append the card header and body to the card
  newTaskCard.append(newTaskCardHeader);
  newTaskCard.append(newTaskCardDueDate);
  newTaskCard.append(newTaskCardBody);
  newTaskCard.append(taskCardDeleteButton);

  // Append the card to the appropriate lane
    $(`#${task.lane}`).append(newTaskCard);


}

// Function to render the task list and make cards sortable
function renderTaskList() {
  if (taskList) {
    taskList.forEach((task) => {
      createTaskCard(task);
    });
  }

  // make cards sortable
  $(".lane").sortable({
    placeholder: "ui-state-highlight",
    connectWith: ".lane3",
    receive: handleDrop,
  });
}

// Update the task status in local storage when a card is dropped into a new lane
function handleDrop(event, ui) {
    const task = ui.item;
    const lane = task.parent().attr("id");

    // Update the task lane in the task list
    const taskId = task.attr("id");
    console.log(taskId);
    const taskIndex = taskList.findIndex((task) => task.id == taskId);
    taskList[taskIndex].lane = lane;
    console.log(taskList[taskIndex].lane);
    localStorage.setItem("tasks", JSON.stringify(taskList));

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  // Get form data
  const taskName = $("#taskName").val();
  const taskDueDate = $("#taskDueDate").val();
  const taskDescription = $("#taskDescription").val();

  // create a task object
  const task = {
    id: generateTaskId(),
    name: taskName,
    dueDate: taskDueDate,
    description: taskDescription,
    lane: "todo-lane",
  };
  console.log(task);
  // Add the new task to your task list
  
  createTaskCard(task);

  // If no tasks exist, set the task list to an empty array and set nextId to 1
  if (!taskList) {
    taskList = [];
    nextId = 1;
  }
  // Add the new task to the task list and update localStorage
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  // Close the dialog
  $("#addTaskModal").dialog("close");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Render the task list from localStorage
  renderTaskList();

  //Initialise the add task modal
  $("#addTaskModal").dialog({
    autoOpen: false,
    modal: true,
  });

  // Add event listener for the add task button
  $("#addTaskButton").click(function (event) {
    event.preventDefault();
    $("#addTaskModal").dialog("open");
    $("#taskDueDate").datepicker(
        {
            dateFormat: "dd-mm-yy",
        }
    );
  });

  // Add listener for the form submission
  $("#taskForm").on("submit", handleAddTask);

  // Handle delete task button click

});
