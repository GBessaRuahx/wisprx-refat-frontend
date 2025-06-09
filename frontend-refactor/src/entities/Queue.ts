export interface Queue {
  id: number;
  name: string;
  color?: string;
  greetingMessage?: string;
  outOfHoursMessage?: string;
  orderQueue?: number | null;
  integrationId?: number | null;
  promptId?: number | null;
}

export default Queue;
