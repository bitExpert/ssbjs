import Message from '../Message';
import MessageBus from './MessageBus';
import MessageListener from './MessageListener';

class CommandBus extends MessageBus {
    public dispatch (message: Message) {
        if (!this.listeners.has(message.name)) {
            return false;
        }

        let collection = this.listeners.get(message.name);

        for (let listener of collection) {
            listener.execute(message.payload);
        }
    }

    public addListener (listener: MessageListener) {
        let commandName = listener.messageName;

        if (this.listeners.has(commandName) && this.listeners.get(commandName).size) {
            throw new Error('A command only may have registered one handler');
        }

        super.addListener(listener);
    }
}

export default CommandBus;
