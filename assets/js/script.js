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
    const newTaskCard = $("<div>")
        .addClass("card my-2 task-card todo-card")
        .attr("id", task.id);

  // Create a card header
    const newTaskCardHeader = $("<h4>")
        .addClass("card-header")
        .text(task.name);

  // use Day.js to calculate the number of days until the due date
    const today = dayjs();

  //convert the due date to a dayjs object
    const dueDate = dayjs(task.dueDate);

  //calculate the difference between the due date and today
    const daysUntilDue = dueDate.diff(today, "day");

  // Apply bootstrap classes based on the number of days until the due date
    if (daysUntilDue < 0) {
        newTaskCard.addClass("bg-danger text-white");
    } else if (daysUntilDue < 7) {
        newTaskCard.addClass("bg-warning");
    } 

  // append the due date to the card
    const newTaskCardDueDate = $("<p>")
        .addClass("card-body")
        .text(`Due: ${dueDate.format("DD-MM-YYYY")} - Days left: ${daysUntilDue}`
    );

  // Create a card body
    const newTaskCardBody = $("<p>")
        .addClass("card-body")
        .text(task.description);

  // Create a delete button
    const taskCardDeleteButton = $("<button>")
        .addClass("btn btn-danger delete-button")
        .text("Delete");
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

// Function to handle adding a new task
    function handleAddTask(event) {
  event.preventDefault();

  // Get form data
  const taskName = $("#taskName").val();
  const taskDueDate = $("#taskDueDate").val();
  const taskDescription = $("#taskDescription").val();

  // Check if all fields have been completed
  if (!taskName || !taskDueDate || !taskDescription) {
    alert("Please complete all input fields.");
    return;
  }

  // create a task object and generate a unique task id
  const task = {
    id: generateTaskId(),
    name: taskName,
    dueDate: taskDueDate,
    description: taskDescription,
    lane: "todo-lane",
  };

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

  // Clear the input fields
  $("#taskName").val("");
  $("#taskDueDate").val("");
  $("#taskDescription").val("");

  // Close the dialog
  $("#addTaskModal").dialog("close");
}

// Function to handle deleting a task
    function handleDeleteTask(event) {
    // get the delete button parent
        const taskCardToDelete = $(event.target).closest(".task-card");
    // get the parent id
        const taskId = taskCardToDelete.attr("id");
    // Find the task index in the task list
        const taskIndex = taskList.findIndex((task) => task.id == taskId);
    // Remove the task from the task list
        taskList.splice(taskIndex, 1);
    // Delete the task card from the DOM
        taskCardToDelete.remove();
    // Update localStorage
        localStorage.setItem("tasks", JSON.stringify(taskList));
}

// On page load
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
    $("#taskDueDate").datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });

  // Add listener for the form submission
    $("#taskForm").on("submit", handleAddTask);
});
