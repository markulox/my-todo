import { Injectable, signal, WritableSignal } from '@angular/core';
import axios from 'axios';
import { Task } from './task-model';
import { from } from 'rxjs';

// สร้างเป็นตัวแปร BASE_URL เอาไว้ เผื่อเปลี่ยน Host หรือ Port ของ JsonServer ก็มาแก้ที่นี่ที่เดียว
const BASE_URL = "http://localhost:3000/"

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  // สำหรับเก็บรายการ Task ทั้งหมดที่ได้มาจาก Server
  taskList: WritableSignal<Task[]> = signal([]);

  // Constructor จะถูกเรียกเมื่อ Service ถูกสร้างขึ้น 
  constructor() {
    // ซึ่งภายใน ได้สั่งให้ไป get task ทั้งหมดจาก json server
    from(axios.get(BASE_URL + "task")).subscribe(resp => {
      this.taskList.set(resp.data);
      console.log(this.taskList())
    })
    /*
    เพิ่มเติม: โดยปกติแล้ว axios จะมีรูปแบบการเขียนของมัน เช่น ถ้าจะยิง GET จะเขียนว่า 
    axios.get(<URL ของ API ที่จะยิง>).then( <ชื่อตัวแปรที่รับ response มาจาก server> => {
      อยากทำอะไรก็เชิญเลย();
    });
    แต่ถ้าเขียนแบบนี้ จะทำให้ Angular ไม่สามารถมองเห็นการเปลี่ยนแปลงของตัวแปร taskList ที่ผูกกับการแสดงรายการ Task ได้ 
    ทำให้ไม่มีรายการ Task โผล่ขึ้นมาเมื่อไป get ข้อมูลจาก API มาแล้ว
    
    ทางแก้คือ ใช้ from() มาครอบ axios เพื่อแปลงเป็น Observable ที่ Angular สามารถติดตามการเปลี่ยนแปลงค่าของตัวแปร
    แล้วต่อด้วย 
    .subscribe( <ชื่อตัวแปรที่รับ response มาจาก server> => {
      อยากทำอะไรก็เชิญเลย();
    }); 
    (มีสอนใน tour of heroes) เพื่อทำการเปลี่ยนค่าตัวแปร
    */
  }

  // function สำหรับเพิ่ม task เข้าไปใน App โดย จะทำการยิงขึ้น Json server ไปก่อน ถ้าเพิ่มได้จริงๆ
  // ก็ค่อยเพิ่ม Task เข้าไปใน App เพื่อแสดงเป็น Feedback ให้กับ User ว่าเพิ่ม Task ได้แล้วจริงๆ
  addTask(taskDetail: string, taskID?: string): void {
    // ถ้า taskID ไม่ได้ถูกใส่เข้ามา จะสร้าง default ID
    if (!taskID) { // Generate default ID
      taskID = String(Date.now()); 
    }
    // อันนี้ขอเก็บไว้สำหรับตอน debug
    console.log("Adding " + taskDetail + " :ID: " + taskID);

    // สร้าง object Task ขึ้นมาสำหรับเตรียมยิง post ขึ้น JsonServer
    let newTask: Task = {
      id: taskID,
      detail: taskDetail,
      is_complete: false
    }
    // ยิง post ขึ้น JsonServer
    from(axios.post(BASE_URL + "task", newTask)).subscribe(response => {
      // ถ้าสร้างได้จริงๆ ก็ค่อยเพิ่ม Task เข้าไปในตัวแปร taskList
      if (response.status === 201) {
        this.taskList().push(newTask);
        console.log("Successfully adding a task!")
      }
    });
  }

  // function สำหรับลบ task จาก App โดย จะทำการยิงขึ้น Json server ไปก่อน ถ้าลบได้จริงๆ
  // ก็ค่อยลบ Task
  removeTask(taskID: string): void {
    console.log("Removing task ID=[%d]", taskID);
    // ยิง delete ขึ้น JsonServer
    from(axios.delete(BASE_URL + "task/" + taskID)).subscribe(response => {
      if (response.status === 200) { // ถ้าสำเร็จก็ค่อยลบ
        let tIdx = this.taskList().findIndex(t => t.id === taskID);
        this.taskList().splice(tIdx, 1);
        console.log("Successfully remove a task ID=[%d]", taskID)
      } else { // ถ้าล้มเหลวก็ console.log debug ออกมาดู
        console.error("Cannot remove task ID=[%d]", taskID)
        console.error(response)
      }
    })
  }

  // สำหรับเปลี่ยนสถานะ isComplete ของ task นั้นๆให้เป็นสถานะตรงข้าม เช่น จาก true เป็น false, จาก false เป็น true
  // จริงๆแล้ว มันสามารถเขียนได้สั้นกว่านี้อยู่ (โดยรับ object Task เข้ามาผ่าน parameter แล้วเปลี่ยนค่าใน object นั้นเลย) 
  // แต่ว่ายังไม่ได้ทดสอบการทำงาน เลยยังไม่ติดสินใจเปลี่ยน
  toggleComplete(id: string): void{
    console.log("Attempting to update ID=[%d]", id);
    // หา index ของ Task ที่จะเปลี่ยนสถานะ
    let tIdx = this.taskList().findIndex(
      t => t.id === id
    )
    let t = this.taskList()[tIdx];
    // แล้วก็เปลี่ยนค่า is_complete ของ Task นั้นๆ
    t.is_complete = !t.is_complete;
    console.log(this.taskList())
    // เปลี่ยนเสร็จ ก็ยิง Put ไปที่ JsonServer ได้เลย
    from(axios.put(BASE_URL + "task/" + t.id, t)).subscribe(response => {
      console.log("Successfully toggle complete state of task [%d]", id);
    })

    // this.taskList()[tIdx].isComplete = !this.taskList()[tIdx].isComplete;
  }

  // สำหรับ return เฉพาะ Task ที่เสร็จแล้ว
  getIncompleteTask(): Task[] {
    /* 
    เราจะใช้คำสั่ง filter โดยรูปแบบการเขียนของมันคือ
    someList.filter( <item แต่ละอันที่อยู่ใน list> => <เงื่อนไขที่เราจะเอาหรือไม่เอา (ต้องเป็นค่า boolean)> )
    ทีนี้ลองมาเทียบกับ code ด้านล่าง
    ถ้าจากด้านล่างคือ <item แต่ละอันที่อยู่ใน list> เป็น t ดังนั้น t ก็จะเป็น Task แต่ละตัว
    <เงื่อนไขที่เราจะเอาหรือไม่เอา (ต้องเป็นค่า boolean)> ก็จะเป็น !t.is_complete
    สมมติว่า มี Task 10 อัน มันก็จะไล่เช็คไปทีละอัน เช่น
      - ถ้า Task ที่ 1 is_complete เป็น false มันก็จะเก็บไว้
      - ถ้า Task ที่ 2 is_complete เป็น true มันก็จะไม่เอามา
    แปลเป็นภาษาคนคือ จาก taskList ให้เอาเฉพาะ Task ที่ยังไม่เสร็จ 
    */
    return this.taskList().filter( 
      t => !t.is_complete
    )
  }

  // โอเค เหมือนข้างบนเลย แค่ทำตรงข้าม
  getCompleteTask(): Task[] {
    return this.taskList().filter(
      t => t.is_complete
    )
  }

  // อันนี้เป็น function ปัญญาอ่อนที่นั่งเสียเวลา ชม. นึงไปกับการทำ ห อะไรก็ไม่รู้ ไม่ต้องสนใจ
  getPreviewStrings(): string[] {
    let finalStrings: string[] = [];
    this.taskList().forEach( (elm, idx) => {
      if (idx == 0) {
        finalStrings.push("\xa0\xa0\xa0\xa0\xa0" + elm.detail.replace(/\s/g,"") + ",then->")
      } else {
        finalStrings.push(elm.detail.replace(/\s/g,"") + ",then->")
      }
    });
    return finalStrings;
  }
}
