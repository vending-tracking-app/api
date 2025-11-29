import { ClsService, ClsStore } from 'nestjs-cls';

export interface ContextStore extends ClsStore {
  userId: string;
}

export class ContextService extends ClsService<ContextStore> {}
