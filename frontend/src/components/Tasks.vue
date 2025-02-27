<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const tasks = ref<{ id: number; title: string; category: string; completed: boolean }[]>([])
const newTask = ref('')
const selectedCategory = ref('General')
const filterCategory = ref('All')
const filterStatus = ref('All')

const categoryColors: Record<string, string> = {
    Work: '#4A90E2',
    Personal: '#50E3C2',
    Urgent: '#D0021B',
    General: '#9B9B9B',
}

const fetchTasks = async () => {
    try {
        const response = await axios.get('http://localhost:3000/tasks')
        tasks.value = response.data
    } catch (error) {
        console.error('Error fetching tasks:', error)
    }
}

onMounted(fetchTasks)

const addTask = async () => {
    if (!newTask.value.trim() || !selectedCategory.value) return

    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.value, category: selectedCategory.value }),
    })

    const task = await response.json()
    tasks.value.push(task)
    newTask.value = ""
}

const toggleTask = async (task: { id: number; completed: boolean; category: string }) => {
    try {
        console.log('Toggling task:', task.id, 'Current completed status:', task.completed); 
        const response = await axios.put(`http://localhost:3000/tasks/${task.id}`, { 
            completed: !task.completed 
        });
        console.log('Response:', response.data); 
        if (response.status === 200) {
            task.completed = !task.completed;  
            tasks.value = [...tasks.value]; 
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

const deleteTask = async (id: number) => {
    try {
        await axios.delete(`http://localhost:3000/tasks/${id}`)
        tasks.value = tasks.value.filter(task => task.id !== id)
    } catch (error) {
        console.error('Error deleting task:', error)
    }
}

const filteredTasks = ref(tasks.value)

watch([tasks, filterCategory, filterStatus], () => {
    filteredTasks.value = tasks.value.filter(task => {
        const categoryMatch = filterCategory.value === 'All' || task.category === filterCategory.value;
        const statusMatch =
            filterStatus.value === 'All' ||
            (filterStatus.value === 'Completed' && task.completed) ||
            (filterStatus.value === 'Not Completed' && !task.completed);
        return categoryMatch && statusMatch;
    });

    console.log("Filtered Tasks:", filteredTasks.value);
}, { deep: true, immediate: true });

</script>

<template>
    <div class="container">
        <h1>Task Manager</h1>

        <div class="task-input">
            <input type="text" v-model="newTask" placeholder="Enter a task..." />
            <select v-model="selectedCategory">
                <option value="">Select Category</option>
                <option v-for="(color, cat) in categoryColors" :key="cat" :value="cat">
                    {{ cat }}
                </option>
            </select>
        </div>

        <button class="add-task-btn" @click="addTask">Add Task</button>

        <div class="filters">
            <select v-model="filterCategory">
                <option value="All">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
                <option value="General">General</option>
            </select>

            <select v-model="filterStatus">
                <option value="All">All Tasks</option>
                <option value="Completed">Completed</option>
                <option value="Not Completed">Not Completed</option>
            </select>
        </div>

        <ul class="task-list">
            <li
                v-for="task in filteredTasks"
                :key="task.id"
                class="task-item"
                :class="{ completed: task.completed }"
                :style="{ borderLeft: '6px solid ' + (task.completed ? 'green' : categoryColors[task.category] || '#ccc') }"
            >
                <span class="task-title">
                    <span v-if="task.completed" class="checkmark">✔</span>
                    {{ task.title }} <strong>({{ task.category || 'No Category' }})</strong>
                </span>

                <div class="task-actions">
                    <button @click="toggleTask(task)" class="check-btn">✔</button>
                    <button @click="deleteTask(task.id)" class="delete-btn">✖</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    font-size: 24px;
    color: #333;
}

.task-input {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.task-input input,
.task-input select {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: 0.3s;
    text-align: center;
}

.task-input input:focus,
.task-input select:focus {
    border-color: #4A90E2;
}

.add-task-btn {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background: #4A90E2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
}

.add-task-btn:hover {
    background: #357ABD;
}

.filters {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.filters select {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: 0.3s;
}

.task-list {
    list-style: none;
    padding: 0;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9f9f9;
    padding: 12px;
    border-radius: 5px;
    margin: 8px 0;
    font-size: 16px;
    transition: 0.3s;
}

.task-item.completed {
    background: #e8e8e8;
    text-decoration: line-through;
    color: #888;
}

.task-title {
    display: flex;
    align-items: center;
    gap: 10px;
}

.checkmark {
    color: green;
    font-size: 18px;
    font-weight: bold;
}

.task-actions {
    display: flex;
    gap: 5px;
}

.check-btn {
    background: green;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
}

.check-btn:hover {
    background: darkgreen;
}

.delete-btn {
    background: red;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
}

.delete-btn:hover {
    background: darkred;
}
</style>