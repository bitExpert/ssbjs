import Message from '../Message';
import MessageBus from './MessageBus';

class EventBus extends MessageBus {
    public dispatch (message: Message) {
        if (!this.listeners.has(message.name)) {
            return false;
        }

        let collection = this.listeners.get(message.name);

        for (let listener of collection) {
            if (listener.once) {
                this.unregister(listener);
            }
            listener.execute(message.payload);
        }
    }
}

export default EventBus;
