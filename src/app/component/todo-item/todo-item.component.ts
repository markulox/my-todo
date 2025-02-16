import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../service/task/task-model';
import { TaskManagementService } from '../../service/task/task-management.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  isCompleted: boolean = false;
  @Input() task!: Task;

  constructor(
    private taskManagementService: TaskManagementService
  ){}

  // method สำหรับเปลี่ยนสถานะ is_complete ของ task นั้นๆซึ่ง คนที่เปลี่ยนสถานะจริงๆ คือ TaskManagementService
  toggleIsComplete(): void {
    this.taskManagementService.toggleComplete(this.task.id);
  }

  // method สำหรับลบ task นั้นๆซึ่ง คนที่ลบจริงๆ คือ TaskManagementService โดยส่ง task id เข้าไปด้วย
  removeTask(): void {
    this.taskManagementService.removeTask(this.task.id);
  }
}
