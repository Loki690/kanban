import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'; // Import DragDropModule
import confetti from 'canvas-confetti';
import { CommonModule } from '@angular/common';
// Import other necessary modules/components

// Define the structure for a task (Moved outside the class)
interface Task {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true, // Make sure standalone is true
  imports: [
    RouterOutlet,
    DragDropModule, // Add DragDropModule here
    CommonModule,
    // Add other imports like CommonModule if needed for *ngFor etc.
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Kanban';

  // Arrays to hold tasks for each column
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  // IDs for the drop lists (used in the template)
  todoListId = 'todoList';
  inProgressListId = 'inProgressList';
  doneListId = 'doneList';

  // Counter for generating unique task IDs
  private taskIdCounter = 0;

  ngOnInit() {
    // Initialize with some sample tasks
    this.addTask('dasdsadsa');
    this.addTask('test');
    this.addTask('ivan');
    this.addTask('jerecho');
    // Move one task to inProgress for demo
    if (this.todo.length > 2) {
       transferArrayItem(this.todo, this.inProgress, 2, 0); // Move 3rd task
    }
  }

  /**
   * Adds a new task to the 'To Do' list.
   * @param title - The title of the task.
   * @param description - Optional description for the task.
   */
  addTask(title: string, description: string = '') {
    const newTask: Task = {
      id: this.taskIdCounter++,
      title: title,
      description: description
    };
    this.todo.push(newTask);
  }

  /**
   * Handles the drop event when a task is moved within or between lists.
   * @param event - The CdkDragDrop event containing information about the drag operation.
   */
  drop(event: CdkDragDrop<Task[]>) {
    // If the item was dropped in the same list, move it within the list
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // If the item was dropped into a different list, transfer it
      const previousContainerId = event.previousContainer.id;
      const currentContainerId = event.container.id;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Check if the task was moved to the 'Done' list
      if (currentContainerId === this.doneListId) {
        this.triggerConfetti(); // Yay! Task completed!
      }
    }
  }

  /**
   * Triggers the confetti animation.
   */
  triggerConfetti() {
    // Basic confetti burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 } // Start confetti from slightly above center
    });

    // You can customize the confetti effect further
    // Example: A more celebratory burst
    const duration = 2 * 1000; // 2 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  // --- Helper Methods (Optional: For adding tasks via UI later) ---
  // You could add input fields and a button in the HTML
  // to call a method like this:
  /*
  addNewTaskFromInput(titleInput: HTMLInputElement, descInput: HTMLInputElement) {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    if (title) {
      this.addTask(title, description);
      titleInput.value = ''; // Clear input
      descInput.value = ''; // Clear input
    }
  }
  */
}