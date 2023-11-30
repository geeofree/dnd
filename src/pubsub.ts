export class PubSub {
  private topics: Record<string, Array<(...args: any[]) => void>>;

  constructor() {
    this.topics = {};
  }

  publish(name: string, ...args: any[]) {
    if (name in this.topics) {
      this.topics[name].forEach((subscriber) => subscriber(...args));
    }
  }

  subscribe(name: string, cb: (...args: any[]) => void) {
    if (name in this.topics) {
      this.topics[name].push(cb);
    } else {
      this.topics[name] = [cb]
    }
  }
}
