
# 📝 To-Do List CLI App

A simple **command-line To-Do List application** built with **Node.js**.
This app allows you to manage tasks directly from your terminal with features like adding, editing, deleting, toggling, and filtering tasks.
All tasks are stored in a `tasks.json` file so your progress is saved between sessions.


## 🚀 Features

✅ Add tasks with category & deadline
✅ View all tasks
✅ Mark tasks as done/undone
✅ Edit existing tasks
✅ Delete tasks
✅ Filter tasks by category
✅ Filter tasks by deadline
✅ Persistent storage in `tasks.json`


## 🛠️ Tech Stack

* **Node.js** (Core modules: `fs`, `readline`)
* **JavaScript (ES6)**



## 📂 Project Structure

📦 todo-cli
 ┣ 📜 tasks.json      # Stores your saved tasks
 ┣ 📜 index.js        # Main CLI app (your code)
 ┣ 📜 README.md       # Documentation


## ⚙️ Installation & Setup

1. **Clone this repo**


[git clone https://github.com/your-username/todo-cli.git](https://github.com/poundsmichaelscode/Todo-cli)
cd todo-cli


2. **Run the app**


node index.js

3. **Follow the menu** displayed in the terminal.


## 📖 Usage Example

When you run the app:


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
 👉 Choose an option: 

* **Add Task** → Enter task description, category, and deadline
* **View Tasks** → Lists all tasks with their status
* **Toggle Task** → Mark task ✔ done or ✖ undone
* **Edit Task** → Update description, category, or deadline
* **Delete Task** → Remove a task permanently
* **Filter** → Show tasks by category or deadline


## 🗄️ Data Persistence

* Tasks are saved inside `tasks.json`.
* Example:

```json
[
  {
    "text": "Finish Node.js project",
    "done": false,
    "category": "Work",
    "deadline": "2025-09-25"
  },
  {
    "text": "Read a book",
    "done": true,
    "category": "Personal",
    "deadline": "No deadline"
  }
]


## 🔮 Future Improvements

* Add priority levels (High/Medium/Low)
* Search tasks by keyword
* Sort tasks by deadline
* Export tasks to `.csv`

---

## 👨‍💻 Author

OLAYENIKAN MICHAEL

 💼 Full-Stack Developer | Cybersecurity Analyst | Digital Marketer
🎻 Afro-pop & Afro-soul Artist Violinist/poet
🌍 From Nigeria


