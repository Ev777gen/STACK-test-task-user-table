import { reactive } from 'vue';
import type { User } from '../types';

const users: User[] = reactive([]);

export function useUsers() {

  return {
    users,
  }
}
