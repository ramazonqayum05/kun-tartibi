document.getElementById('themeToggle').addEventListener('change', function () {
    document.body.classList.toggle('dark');
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  
  // Sahifa yuklanganda holatni tiklash
  window.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.getElementById("themeToggle").checked = true;
    }
    
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => renderTask(task.text, task.time, task.status));
  });
  
  function addTask() {
    const input = document.getElementById("taskInput");
    const time = document.getElementById("taskTime");
    if (!input.value || !time.value) return;
  
    renderTask(input.value, time.value, "pending");
    input.value = "";
    time.value = "";
    saveTasksToStorage();
  }
  
  function renderTask(text, time, status = "pending") {
    const list = document.getElementById("taskList");
    const li = document.createElement("li");
    li.className = "task";
  
    const statusSpan = document.createElement("span");
    statusSpan.className = "status";
    if (status === "done") {
      li.classList.add("bajarildi");
      statusSpan.innerHTML = `<span class="done">✅ Bajarildi</span>`;
    } else if (status === "failed") {
      statusSpan.innerHTML = `<span class="failed">❗ Bajarilmadi</span>`;
    } else {
      statusSpan.innerHTML = `<span class="done">⏳ Kutilyapti</span>`;
    }
  
    const now = new Date();
    const [hours, minutes] = time.split(":");
    const taskTime = new Date();
    taskTime.setHours(hours, minutes, 0, 0);
  
    if (status === "pending") {
      const interval = setInterval(() => {
        const currentTime = new Date();
        if (currentTime > taskTime && !li.classList.contains("bajarildi")) {
          statusSpan.innerHTML = `<span class="failed">❗ Bajarilmadi</span>`;
          saveTasksToStorage();
          clearInterval(interval);
        }
      }, 60000);
    }
  
    li.innerHTML = `<span class="time">${time}</span> ${text}`;
    li.appendChild(statusSpan);
  
    const btn = document.createElement("button");
    btn.className = "delete-btn";
    btn.innerHTML = "✖";
    btn.onclick = () => {
      li.remove();
      saveTasksToStorage();
    };
    li.appendChild(btn);
  
    li.addEventListener("click", () => {
      li.classList.toggle("bajarildi");
      if (li.classList.contains("bajarildi")) {
        statusSpan.innerHTML = `<span class="done">✅ Bajarildi</span>`;
      } else {
        const current = new Date();
        if (current > taskTime) {
          statusSpan.innerHTML = `<span class="failed">❗ Bajarilmadi</span>`;
        } else {
          statusSpan.innerHTML = `<span class="done">⏳ Kutilyapti</span>`;
        }
      }
      saveTasksToStorage();
    });
  
    list.appendChild(li);
    saveTasksToStorage();
  }
  
  function saveTasksToStorage() {
    const tasks = [];
    document.querySelectorAll(".task").forEach(li => {
      const time = li.querySelector(".time").textContent;
      const text = li.childNodes[1].nodeValue.trim();
      let status = "pending";
      if (li.classList.contains("bajarildi")) {
        status = "done";
      } else if (li.innerHTML.includes("Bajarilmadi")) {
        status = "failed";
      }
      tasks.push({ text, time, status });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  