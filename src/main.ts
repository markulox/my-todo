import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// นี่คือ จุดเริ่มต้นของทุกอย่าง มันคงจะเปล่าประโยชน์ ถ้าเรา Setup component ไว้หมดแล้ว แต่ไม่เรียก 
// start ขึ้นมา
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
