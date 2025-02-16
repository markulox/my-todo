export interface Task {
    id: string,
    detail: string,
    is_complete: boolean
}

// สร้าง Class TaskModel เอาไว้ ซึ่งมี property ตาม Interface Task
export class TaskModel implements Task {
    // สำหรับเก็บ id
    id: string = "0000000000000";
    // เก็บชื่อข้อความใน Task
    detail: string = "";
    // เก็บค่าว่า complete แล้วหรือยัง, ถ้า true แปลว่า complete แล้ว ถ้า false แปลว่า Incomplete
    is_complete: boolean = false;
}