// qa_smoke/fakes/fakeStore.ts - A trivial in-memory "Firestore-like" store
export interface FakeTask {
  id: string;
  title: string;
  subject: string;
  price: number;
  deadlineISO: string;
  status: 'open' | 'reserved' | 'claimed' | 'submitted' | 'completed';
  ownerId: string;
  expertId?: string;
  reservedBy?: string | null;
  reservedUntil?: number | null;
  matching?: {
    invitedNow: number;
    nextWaveAt: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface FakeUser {
  uid: string;
  displayName: string;
  subjects: string[];
  minPrice?: number;
  maxPrice?: number;
  level: 'HS' | 'UG' | 'Grad';
  ratingAvg: number;
  ratingCount: number;
  acceptRate: number;
  medianResponseMins: number;
  completedBySubject: Record<string, number>;
}

export interface FakeInvite {
  inviteId: string;
  taskId: string;
  expertId: string;
  sentAt: number;
  respondedAt?: number | null;
  status: 'sent' | 'accepted' | 'declined';
  lastScore: number;
}

export class FakeStore {
  private tasks = new Map<string, FakeTask>();
  private users = new Map<string, FakeUser>();
  private invites = new Map<string, FakeInvite>();
  private locks = new Set<string>();

  // CRUD operations
  putTask(task: FakeTask): void {
    this.tasks.set(task.id, { ...task, updatedAt: this.now() });
  }

  getTask(id: string): FakeTask | undefined {
    return this.tasks.get(id);
  }

  updateTask(id: string, updates: Partial<FakeTask>): void {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.set(id, { ...task, ...updates, updatedAt: this.now() });
    }
  }

  putUser(user: FakeUser): void {
    this.users.set(user.uid, user);
  }

  getUser(uid: string): FakeUser | undefined {
    return this.users.get(uid);
  }

  listEligibleExperts(subject: string): FakeUser[] {
    return Array.from(this.users.values()).filter(user => 
      user.subjects.includes(subject) && 
      user.ratingAvg >= 3.0 && 
      user.ratingCount >= 3
    );
  }

  putInvite(invite: FakeInvite): void {
    this.invites.set(invite.inviteId, invite);
  }

  listInvitesByTask(taskId: string): FakeInvite[] {
    return Array.from(this.invites.values()).filter(invite => invite.taskId === taskId);
  }

  listInvitesByExpert(expertId: string): FakeInvite[] {
    return Array.from(this.invites.values()).filter(invite => invite.expertId === expertId);
  }

  // Time utilities
  now(): number {
    return Date.now();
  }

  // Transaction support
  async runTransaction<T>(fn: (transaction: any) => Promise<T>): Promise<T> {
    // Simple implementation - just run the function
    // In a real implementation, this would handle rollback on error
    try {
      return await fn({
        get: async (ref: any) => {
          const id = ref.path.split('/').pop();
          const collection = ref.path.split('/')[0];
          
          if (collection === 'tasks') {
            const task = this.getTask(id);
            return { exists: !!task, data: () => task, ref: { path: ref.path } };
          }
          if (collection === 'users') {
            const user = this.getUser(id);
            return { exists: !!user, data: () => user, ref: { path: ref.path } };
          }
          if (collection === 'invites') {
            const invite = this.invites.get(id);
            return { exists: !!invite, data: () => invite, ref: { path: ref.path } };
          }
          
          return { exists: false, data: () => null, ref: { path: ref.path } };
        },
        update: async (ref: any, data: any) => {
          const id = ref.path.split('/').pop();
          const collection = ref.path.split('/')[0];
          
          if (collection === 'tasks') {
            this.updateTask(id, data);
          }
        },
        set: async (ref: any, data: any) => {
          const id = ref.path.split('/').pop();
          const collection = ref.path.split('/')[0];
          
          if (collection === 'invites') {
            this.putInvite({ ...data, inviteId: id });
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Utility methods for testing
  clear(): void {
    this.tasks.clear();
    this.users.clear();
    this.invites.clear();
    this.locks.clear();
  }

  getStats(): { tasks: number; users: number; invites: number } {
    return {
      tasks: this.tasks.size,
      users: this.users.size,
      invites: this.invites.size
    };
  }
}

export default FakeStore;
