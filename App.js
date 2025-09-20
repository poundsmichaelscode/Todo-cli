// ===============================
// 📌 TO-DO LIST APP (Node.js CLI)
// ===============================

// Import built-in Node.js modules
const readline = require("readline"); // For reading user input/output in the terminal
const fs = require("fs");             // For saving/loading tasks from a file

// Create readline interface (handles user input/output)
const rl = readline.createInterface({
  input: process.stdin,   // Read from keyboard
  output: process.stdout  // Write to terminal
});

// Store tasks in an array (in memory)
let todos = [];

// ----------------- START APP -----------------
loadTasks();   // Load saved tasks from file if available
showMenu();    // Show the main menu when app starts

// ----------------- FILE OPERATIONS -----------------

// Load tasks from tasks.json (if it exists)
function loadTasks() {
  if (fs.existsSync("tasks.json")) { // Check if file exists
    todos = JSON.parse(fs.readFileSync("tasks.json")); // Read file, parse JSON into array
  }
}

// Save tasks into tasks.json
function saveTasks() {
  const text = JSON.stringify(todos, null, 2); // Convert array to formatted JSON text
  fs.writeFileSync("tasks.json", text);        // Save JSON string into file
}

// ----------------- TASK OPERATIONS -----------------

// 1. Add Task
function addTask() {
  rl.question("\n🆕 Enter new task: ", (task) => { // Ask for task description
    if (task.trim() === "") {                     // Prevent empty tasks
      console.log("⚠️ Task cannot be empty.");
      return showMenu(); // Go back to menu
    }

    rl.question("📂 Enter category (Work/Personal/Study): ", (category) => {
      rl.question("📅 Enter deadline (YYYY-MM-DD): ", (deadline) => {
        
        // Create new task object and add to array
        todos.push({
          text: task,
          done: false, // New tasks are not completed by default
          category: category || "General",  // Default if blank
          deadline: deadline || "No deadline" // Default if blank
        });

        saveTasks(); // Save updated list
        console.log("✅ Task added successfully!");
        showMenu();  // Return to menu
      });
    });
  });
}

// 2. View Tasks
function viewTasks() {
  console.log("\n📋 Your To-Do List:");

  if (todos.length === 0) { // If no tasks
    console.log("⚠️ No tasks yet.");
  } else {
    // Loop through each task and print details
    todos.forEach((t, i) => {
      console.log(
        `${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} ` +
        `(Category: ${t.category}, Deadline: ${t.deadline})`
      );
    });
  }

  showMenu(); // Back to menu
}

// 3. Toggle Done/Undone
function toggleTask() {
  rl.question("\n🔄 Enter task number to toggle: ", (num) => {
    const index = parseInt(num) - 1; // Convert user input to array index (1 → 0)

    // Validate input
    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }

    todos[index].done = !todos[index].done; // Flip status true <-> false
    saveTasks(); // Save changes
    console.log("✅ Task status updated!");
    showMenu();
  });
}

// 4. Edit Task
function editTask() {
  rl.question("\n✏️ Enter task number to edit: ", (num) => {
    const index = parseInt(num) - 1;

    // Validate input
    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }

    // Ask for new values (leave blank = keep old value)
    rl.question("📝 Enter new task text (leave blank to keep same): ", (newText) => {
      rl.question("📂 Enter new category (leave blank to keep same): ", (newCat) => {
        rl.question("📅 Enter new deadline (YYYY-MM-DD, leave blank to keep same): ", (newDeadline) => {
          
          // Only update if user typed something
          if (newText.trim() !== "") todos[index].text = newText;
          if (newCat.trim() !== "") todos[index].category = newCat;
          if (newDeadline.trim() !== "") todos[index].deadline = newDeadline;

          saveTasks(); // Save changes
          console.log("✅ Task updated!");
          showMenu();
        });
      });
    });
  });
}

// 5. Delete Task
function deleteTask() {
  rl.question("\n🗑️ Enter task number to delete: ", (num) => {
    const index = parseInt(num) - 1;

    // Validate input
    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }

    todos.splice(index, 1); // Remove 1 task at position "index"
    saveTasks();            // Save updated list
    console.log("✅ Task deleted!");
    showMenu();
  });
}

// 6. Filter by Category
function filterByCategory() {
  rl.question("\n📂 Enter category to filter: ", (cat) => {
    // Keep only tasks where category matches (case-insensitive)
    const filtered = todos.filter(t => t.category.toLowerCase() === cat.toLowerCase());

    if (filtered.length === 0) {
      console.log(`⚠️ No tasks found in category: ${cat}`);
    } else {
      filtered.forEach((t, i) => {
        console.log(
          `${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} ` +
          `(Category: ${t.category}, Deadline: ${t.deadline})`
        );
      });
    }
    showMenu(); // Back to menu
  });
}

// 7. Filter by Deadline
function filterByDeadline() {
  rl.question("\n📅 Enter deadline (YYYY-MM-DD): ", (date) => {
    // Select tasks due on or before given date
    const filtered = todos.filter(t => new Date(t.deadline) <= new Date(date));

    if (filtered.length === 0) {
      console.log(`⚠️ No tasks due on/before ${date}`);
    } else {
      filtered.forEach((t, i) => {
        console.log(
          `${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} ` +
          `(Category: ${t.category}, Deadline: ${t.deadline})`
        );
      });
    }
    showMenu();
  });
}

// ----------------- MENU SYSTEM -----------------

// Show options menu
function showMenu() {
  console.log(`
 ==========================
   📌 TO-DO LIST (CLI APP)
 ==========================
 1. Add Task
 2. View Tasks
 3. Toggle Task Done/Undone
 4. Edit Task
 5. Delete Task
 6. Filter by Category
 7. Filter by Deadline
 0. Exit
 --------------------------  
 `);

  // Ask user to choose option
  rl.question("👉 Choose an option: ", (choice) => {
    switch (choice) {
      case "1": addTask(); break;
      case "2": viewTasks(); break;
      case "3": toggleTask(); break;
      case "4": editTask(); break;
      case "5": deleteTask(); break;
      case "6": filterByCategory(); break;
      case "7": filterByDeadline(); break;
      case "0": // Exit
        console.log("👋 Goodbye!");
        rl.close(); // Close readline interface
        break;
      default: // Handle invalid input
        console.log("❌ Invalid option. Try again.");
        showMenu(); // Show menu again
    }
  });
}
