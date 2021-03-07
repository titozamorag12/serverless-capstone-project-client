export interface Execution {
  executionId: string;
  createdAt: string;
  name: string;
  executionDate: string;
  done: boolean;
  attachmentUrl?: string;
}
