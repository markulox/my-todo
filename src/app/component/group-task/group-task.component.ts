import { Component, Input } from '@angular/core';
import { TaskManagementService } from '../../service/task/task-management.service';
import { Task } from '../../service/task/task-model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-group-task',
  standalone: true,
  imports: [TodoItemComponent],
  templateUrl: './group-task.component.html',
  styleUrl: './group-task.component.scss'
})
export class GroupTaskComponent {
  
  // ใช้รับ Input จาก app.component.html
  @Input() title: string = "GroupHeader";
  @Input() tasks: Task[] = [];

  isExpanded = true;

  // function สำหรับตอนที่ click header เพื่อหุบหรือกาง
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    console.log("Expanding is toggled!: ", this.isExpanded)
  }
  
  constructor(){}

}
