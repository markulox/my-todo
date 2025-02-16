import { TestBed } from '@angular/core/testing';

import { TaskManagementService } from './task-management.service';

// ชิบหาย ลืมเขียนเทสอ่ะ
describe('TaskManagementService', () => {
  let service: TaskManagementService;

  beforeEach(() => {
    service = new TaskManagementService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add new task', () => {
    service.addTask("The simple task has been added!");
  })
});
