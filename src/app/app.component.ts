import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoItemComponent } from "./component/todo-item/todo-item.component";
import { TaskManagementService } from './service/task/task-management.service';
import { FormsModule } from '@angular/forms';
import { GroupTaskComponent } from "./component/group-task/group-task.component";
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, GroupTaskComponent, UpperCasePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-todo';
  // ตัวแปรสำหรับเก็บข้อความที่พิมพ์ไว้ใน Input 
  pendingTask: string = "";

  constructor(
    // Service ตรงกลางที่จะคอยติดต่อกับ Database
    public taskManagementService: TaskManagementService
  ) {}

  // method เพิ่ม Task ซึ่งจะทำงานตอน click ปุ่ม ADD
  addPendingTask(): void{
    // เรียก method addTask ของ service TaskManagementService ซึ่งถูกเขียนไว้ในไฟล์ service/task/task-management.service.ts
    this.taskManagementService.addTask(this.pendingTask)
    // เมื่อเพิ่ม Task แล้ว ก็จะล้างค่า pendingTask ซึ่งเชื่อมกับ Input Text ในไฟล์ app.component.html
    this.pendingTask = "";
  }

}
