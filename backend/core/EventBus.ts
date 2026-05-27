type Handler = (data: any) => void;

export class EventBus {
  private listeners: Map<string, Handler[]> = new Map();

  subscribe(event: string, handler: Handler) {
    const existing = this.listeners.get(event) || [];
    existing.push(handler);
    this.listeners.set(event, existing);
  }

  publish(event: string, payload: any) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.forEach((h) => h(payload));
  }
}

export default new EventBus();
