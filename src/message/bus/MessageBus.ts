import MessageListener from './MessageListener';

class MessageBus {
    protected listeners: Map<String, Set<MessageListener>>;

    constructor () {
        this.listeners = new Map<String, Set<MessageListener>>();
    }

    public register (messageName: String, fn: Function, scope: Object, once?: Boolean): MessageListener {
        let listener = new MessageListener(messageName, fn, scope, once);
        this.addListener(listener);
        return listener;
    }

    public unregister (listener: MessageListener) {
        if (!this.listeners.has(listener.messageName)) {
            return;
        }

        this.listeners.get(listener.messageName).delete(listener);
    }

    public unregisterAllFor (messageName) {
        if (!this.listeners.has(messageName)) {
            return;
        }

        this.listeners.delete(messageName);
    }

    public addListener (listener: MessageListener) {
        let messageName = listener.messageName;

        if (!this.listeners.has(messageName)) {
            this.listeners.set(messageName, new Set<MessageListener>());
        }

        this.listeners.get(messageName).add(listener);
    }
}

export default MessageBus;
