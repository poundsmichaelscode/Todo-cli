
//=============== 📌 TO-DO LIST APP (Node.js CLI)================


// Import built-in Node.js modules
const readline = require ("readline"); // Used for CLI input/output
const fs = require ("fs");             // Used to save/load tasks to a JSON file

// Create readline interface (this allows user input in the terminal)
const rl = readline.createInterface({
  input: process.stdin,   // Read from keyboard
  output: process.stdout  // Display output in terminal
});


// Main storage for tasks (in memory)
let todos = [];

// ----------------- START APP -----------------
loadTasks();      // Load saved tasks from file (if exists)
checkOverdue();   // Check for overdue tasks immediately when app starts
showMenu();       // Show the main menu

// ----------------- FILE OPERATIONS -----------------

// Load tasks from tasks.json into memory
function loadTasks() {
  if (fs.existsSync("tasks.json")) { 
    todos = JSON.parse(fs.readFileSync("tasks.json")); 
  }
}

// Save tasks array into tasks.json file
function saveTasks() {
  fs.writeFileSync("tasks.json", JSON.stringify(todos, null, 2));
}

// ----------------- TASK OPERATIONS -----------------

// 1. Add Task
function addTask() {
  rl.question("\n🆕 Enter new task: ", (task) => {
    if (task.trim() === "") { // Prevent empty task
      console.log("⚠️ Task cannot be empty.");
      return showMenu();
    }

    // Ask user for additional task details
    rl.question("📂 Enter category (Work/Personal/Study): ", (category) => {
      rl.question("📅 Enter deadline (YYYY-MM-DD): ", (deadline) => {
        rl.question("⚡ Enter priority (High/Medium/Low): ", (priority) => {
          rl.question("🔁 Recurring? (daily/weekly/monthly/none): ", (repeat) => {

            // Push a new task object into todos array
            todos.push({
              text: task,
              done: false,                  // new tasks are incomplete by default
              category: category || "General",
              deadline: deadline || "No deadline",
              priority: priority || "Medium",
              repeat: repeat.toLowerCase() === "none" ? null : repeat.toLowerCase()
            });

            saveTasks(); // Save updated task list to file
            console.log("✅ Task added successfully!");
            showMenu();
          });
        });
      });
    });
  });
}

//============== 2. View Tasks ================= //
function viewTasks() {
  console.log("\n📋 Your To-Do List:");

  if (todos.length === 0) {
    console.log("⚠️ No tasks yet.");
  } else {
    //================
    //  Print all tasks with details =====================//
     
    todos.forEach((t, i) => {
      const overdue = isOverdue(t.deadline) && !t.done ? " ⏰OVERDUE" : "";
      console.log(
        `${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} ` +
        `(Category: ${t.category}, Deadline: ${t.deadline}, Priority: ${t.priority}${t.repeat ? `, Repeat: ${t.repeat}` : ""})${overdue}`
      );
    });
  }

  showMenu();
}

//============= 3. Toggle Task Done/Undone =====================//
function toggleTask() {
  rl.question("\n🔄 Enter task number to toggle: ", (num) => {
    const index = parseInt(num) - 1;

    // Validate task number
    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }

    // Flip done status
    todos[index].done = !todos[index].done;

    // 🔁 Handle recurring tasks:
    // If the task is marked done AND has a repeat value, create a new future task
    if (todos[index].done && todos[index].repeat) {
      let nextDate = new Date(todos[index].deadline);

      switch (todos[index].repeat) {
        case "daily": nextDate.setDate(nextDate.getDate() + 1); break;
        case "weekly": nextDate.setDate(nextDate.getDate() + 7); break;
        case "monthly": nextDate.setMonth(nextDate.getMonth() + 1); break;
      }

      // Add the next occurrence of the recurring task
      todos.push({
        ...todos[index],               // copy all fields
        done: false,                   // reset status to undone
        deadline: nextDate.toISOString().split("T")[0] // format YYYY-MM-DD
      });

      console.log("🔁 New recurring task created.");
    }

    saveTasks();
    console.log("✅ Task status updated!");
    showMenu();
  });
}

//============= 4. Edit Task ====================//

function editTask() {
  rl.question("\n✏️ Enter task number to edit: ", (num) => {
    const index = parseInt(num) - 1;

    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }

    // Allow updating individual fields (blank keeps old value)
    rl.question("📝 Enter new task text (blank=keep): ", (newText) => {
      rl.question("📂 Enter new category (blank=keep): ", (newCat) => {
        rl.question("📅 Enter new deadline (YYYY-MM-DD, blank=keep): ", (newDeadline) => {
          rl.question("⚡ Enter new priority (blank=keep): ", (newPrio) => {

            if (newText.trim()) todos[index].text = newText;
            if (newCat.trim()) todos[index].category = newCat;
            if (newDeadline.trim()) todos[index].deadline = newDeadline;
            if (newPrio.trim()) todos[index].priority = newPrio;

            saveTasks();
            console.log("✅ Task updated!");
            showMenu();
          });
        });
      });
    });
  });
}

//================ 5. Delete Task ========================//
function deleteTask() {
  rl.question("\n🗑️ Enter task number to delete: ", (num) => {
    const index = parseInt(num) - 1;

    if (isNaN(index) || index < 0 || index >= todos.length) {
      console.log("❌ Invalid task number.");
      return showMenu();
    }

    todos.splice(index, 1); // remove one task
    saveTasks();
    console.log("✅ Task deleted!");
    showMenu();
  });
}



// ===================== NEW FEATURES ===================

//================ 6. Search Tasks (by keyword in description)=============//

function searchTasks() {
  rl.question("\n🔎 Enter keyword to search: ", (kw) => {
    const filtered = todos.filter(t => t.text.toLowerCase().includes(kw.toLowerCase()));

    if (filtered.length === 0) {
      console.log("⚠️ No tasks found.");
    } else {
      filtered.forEach((t, i) => {
        console.log(`${i + 1}. ${t.done ? "✔" : "✖"} ${t.text} (Category: ${t.category}, Deadline: ${t.deadline})`);
      });
    }
    showMenu();
  });
}


//==================== 7. Sort Tasks (deadline, category, status, priority)=================//
function sortTasks() {
  console.log("\n🔽 Sort by: 1.Deadline  2.Category  3.Status  4.Priority");
  rl.question("👉 Choose: ", (opt) => {
    switch (opt) {
      case "1": // sort by deadline (earliest first)
        todos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "2": // sort alphabetically by category
        todos.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "3": // done first
        todos.sort((a, b) => b.done - a.done);
        break;
      case "4": // priority order High > Medium > Low
        const order = { High: 1, Medium: 2, Low: 3 };
        todos.sort((a, b) => order[a.priority] - order[b.priority]);
        break;
      default:
        console.log("❌ Invalid option.");
    }
    viewTasks(); // after sorting, show tasks
  });
}

//============ 8. Overdue Task Warning  =================//
function checkOverdue() {
  const overdue = todos.filter(t => isOverdue(t.deadline) && !t.done);

  if (overdue.length > 0) {
    console.log("\n⏰ WARNING! You have overdue tasks:");
    overdue.forEach(t => console.log(`- ${t.text} (Deadline: ${t.deadline})`));
  }
}

// Helper: checks if a given deadline date is before today
function isOverdue(deadline) {
  if (!deadline || deadline === "No deadline") return false;
  return new Date(deadline) < new Date();
}

// -----------------=========== MENU SYSTEM ==============-----------------//

// ===========Main menu with options====================
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
 8. Search Tasks 🔎
 9. Sort Tasks 🔽
 0. Exit
 --------------------------  
 `);

  rl.question("👉 Choose an option: ", (choice) => {
    switch (choice) {
      case "1": addTask(); break;
      case "2": viewTasks(); break;
      case "3": toggleTask(); break;
      case "4": editTask(); break;
      case "5": deleteTask(); break;
      case "6": filterByCategory(); break;
      case "7": filterByDeadline(); break;
      case "8": searchTasks(); break;
      case "9": sortTasks(); break;
      case "0": console.log("👋 Goodbye!"); rl.close(); break;
      default: console.log("❌ Invalid option."); showMenu();
    }
  });
}
