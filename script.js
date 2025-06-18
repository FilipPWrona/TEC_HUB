// Global state
let currentSection = 'all';
let projects = {
    blue: { status: 'red', progress: 0, tasks: [] },
    green: { status: 'red', progress: 0, tasks: [] },
    black: { status: 'red', progress: 0, tasks: [] },
    yellow: { status: 'red', progress: 0, tasks: [] },
    pink: { status: 'red', progress: 0, tasks: [] },
    purple: { status: 'red', progress: 0, tasks: [] },
    red: { status: 'red', progress: 0, tasks: [] },
    orange: { status: 'red', progress: 0, tasks: [] },
    gods: { status: 'red', progress: 0, tasks: [] }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateStats();
    initializeEventListeners();
});

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the correct nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(`'${sectionName}'`)) {
            btn.classList.add('active');
        }
    });
    
    currentSection = sectionName;
    
    // Add visual transition effect
    const activeSection = document.getElementById(sectionName + '-section');
    if (activeSection) {
        activeSection.style.opacity = '0';
        activeSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            activeSection.style.transition = 'all 0.3s ease';
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateY(0)';
        }, 50);
    }
}

function enterProject(projectName) {
    showSection(projectName);
    
    // Add immersive effect
    const section = document.getElementById(projectName + '-section');
    if (section) {
        section.style.transform = 'scale(0.95)';
        section.style.opacity = '0';
        
        setTimeout(() => {
            section.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            section.style.transform = 'scale(1)';
            section.style.opacity = '1';
        }, 100);
    }
}

// Status management functions
function changeStatus(button, status) {
    const projectCard = button.closest('.project-card');
    const projectName = projectCard.dataset.project;
    
    // Update button states
    const statusButtons = projectCard.querySelectorAll('.status-btn');
    statusButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update project status
    projects[projectName].status = status;
    
    // Add visual feedback
    button.style.transform = 'scale(1.3)';
    setTimeout(() => {
        button.style.transform = 'scale(1.2)';
    }, 150);
    
    // Update stats
    updateStats();
    saveData();
}

function changeTaskStatus(button, status) {
    const taskItem = button.closest('.task-item');
    
    // Update button states
    const statusButtons = taskItem.querySelectorAll('.status-btn');
    statusButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update task item border
    taskItem.dataset.status = status;
    
    // Add visual feedback
    button.style.transform = 'scale(1.3)';
    setTimeout(() => {
        button.style.transform = 'scale(1.2)';
    }, 150);
    
    // Update progress
    updateProjectProgress();
    saveData();
}

function toggleTask(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    
    if (checkbox.checked) {
        taskItem.style.opacity = '0.7';
        taskItem.style.textDecoration = 'line-through';
        
        // Auto-change status to green when checked
        const greenBtn = taskItem.querySelector('.status-btn.green');
        if (greenBtn) {
            changeTaskStatus(greenBtn, 'green');
        }
        
        // Add completion animation
        const checkboxLabel = taskItem.querySelector('label');
        checkboxLabel.style.transform = 'scale(1.2)';
        setTimeout(() => {
            checkboxLabel.style.transform = 'scale(1)';
        }, 200);
        
    } else {
        taskItem.style.opacity = '1';
        taskItem.style.textDecoration = 'none';
    }
    
    updateProjectProgress();
    saveData();
}

// Progress tracking
function updateProjectProgress() {
    const currentProjectSection = document.querySelector('.section.active.project-section');
    if (!currentProjectSection) return;
    
    const tasks = currentProjectSection.querySelectorAll('.task-item');
    const completedTasks = currentProjectSection.querySelectorAll('.task-item input[type="checkbox"]:checked');
    
    const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    
    // Update progress bar
    const progressFill = currentProjectSection.querySelector('.progress-fill');
    const progressText = currentProjectSection.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${completedTasks.length}/${tasks.length} ukończonych`;
    }
    
    // Update sidebar info
    const progressValue = currentProjectSection.querySelector('.info-value');
    if (progressValue) {
        progressValue.textContent = Math.round(progress) + '%';
    }
}

function updateStats() {
    const totalProjects = Object.keys(projects).length;
    const completedProjects = Object.values(projects).filter(p => p.status === 'green').length;
    const progressPercentage = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    
    document.getElementById('total-projects').textContent = totalProjects;
    document.getElementById('completed-projects').textContent = completedProjects;
    document.getElementById('progress-percentage').textContent = progressPercentage + '%';
    
    // Update project cards progress
    document.querySelectorAll('.project-card').forEach(card => {
        const projectName = card.dataset.project;
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        
        if (progressFill && progressText && projects[projectName]) {
            progressFill.style.width = projects[projectName].progress + '%';
        }
    });
}

// Task management
function addTask(projectName) {
    const taskTitle = prompt('Wprowadź tytuł zadania:');
    if (!taskTitle) return;
    
    const taskDescription = prompt('Wprowadź opis zadania (opcjonalnie):') || '';
    
    // Create new task element
    const tasksList = document.querySelector(`#${projectName}-section .tasks-list`);
    if (!tasksList) return;
    
    const taskId = `${projectName}-task-${Date.now()}`;
    const taskHTML = `
        <div class="task-item" data-status="red">
            <div class="task-checkbox">
                <input type="checkbox" id="${taskId}" onchange="toggleTask(this)">
                <label for="${taskId}"></label>
            </div>
            <div class="task-content">
                <h4>${taskTitle}</h4>
                <p>${taskDescription}</p>
            </div>
            <div class="task-status">
                <button class="status-btn red active" onclick="changeTaskStatus(this, 'red')"></button>
                <button class="status-btn yellow" onclick="changeTaskStatus(this, 'yellow')"></button>
                <button class="status-btn green" onclick="changeTaskStatus(this, 'green')"></button>
            </div>
        </div>
    `;
    
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
    
    // Add animation
    const newTask = tasksList.lastElementChild;
    newTask.style.opacity = '0';
    newTask.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newTask.style.transition = 'all 0.3s ease';
        newTask.style.opacity = '1';
        newTask.style.transform = 'translateY(0)';
    }, 100);
    
    updateProjectProgress();
    saveData();
}

// Modal functions
function addNewIdea() {
    document.getElementById('ideaModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function saveIdea() {
    const title = document.getElementById('ideaTitle').value;
    const description = document.getElementById('ideaDescription').value;
    const category = document.getElementById('ideaCategory').value;
    const priority = document.getElementById('ideaPriority').value;
    
    if (!title) {
        alert('Proszę wprowadzić tytuł pomysłu');
        return;
    }
    
    // Add idea as a new task to the selected category
    addTaskToCategory(category, title, description, priority);
    
    // Clear form
    document.getElementById('ideaForm').reset();
    closeModal('ideaModal');
    
    // Show success message
    showNotification('Pomysł został dodany!', 'success');
}

function addTaskToCategory(category, title, description, priority) {
    // This would add the idea to the appropriate project section
    // For now, we'll just log it
    console.log(`New idea added to ${category}: ${title}`);
}

// Floating Action Button
function toggleFabMenu() {
    const fabMenu = document.querySelector('.fab-menu');
    fabMenu.classList.toggle('active');
}

// Utility functions
function openShop(projectName) {
    if (projectName === 'blue') {
        // Open Blue Elephant shop in new tab
        window.open('../blue-elephant-shop/index.html', '_blank');
    }
}

function exportData() {
    const data = {
        projects: projects,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elephant-company-data.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('Dane zostały wyeksportowane!', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.projects) {
                    projects = data.projects;
                    updateStats();
                    saveData();
                    showNotification('Dane zostały zaimportowane!', 'success');
                }
            } catch (error) {
                showNotification('Błąd podczas importu danych!', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Data persistence
function saveData() {
    localStorage.setItem('elephantCompanyData', JSON.stringify(projects));
}

function loadData() {
    const saved = localStorage.getItem('elephantCompanyData');
    if (saved) {
        try {
            projects = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Event listeners
function initializeEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Close FAB menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.fab')) {
            document.querySelector('.fab-menu').classList.remove('active');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            
            // Close FAB menu
            document.querySelector('.fab-menu').classList.remove('active');
        }
        
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            addNewIdea();
        }
        
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveData();
            showNotification('Dane zostały zapisane!', 'success');
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
`;
document.head.appendChild(style);

