export class Registry {
  private agents = new Map<string, any>();

  register(name: string, agent: any) {
    this.agents.set(name, agent);
  }

  get(name: string) {
    return this.agents.get(name);
  }

  all() {
    return Array.from(this.agents.values());
  }

  names() {
    return Array.from(this.agents.keys());
  }
}

const registry = new Registry();
export default registry;
