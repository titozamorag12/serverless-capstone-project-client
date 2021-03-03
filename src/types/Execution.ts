export interface Execution {
  executionId: string;
  createdAt: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;
}
