import type { Status, User } from '@/apollo/types/types';

export function toggleStatusId(
  currentStatus: Status,
  user: User | null
): number {
  if (currentStatus.key !== 'done') {
    return 3; // 3 - done
  } else {
    return user?.id ? 2 : 1; // 1 - todo, 2 - in progress
  }
}
