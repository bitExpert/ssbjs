import Message from '../Message';
import MessageBus from './MessageBus';
import MessageListener from './MessageListener';

class QueryBus extends MessageBus {
   public dispatch (message: Message) {
        let promise;

        if (!this.listeners.has(message.name)) {
            return Promise.reject('No finder registered for query "' + message.name + '"');
        }

        let collection = this.listeners.get(message.name);

        for (let listener of collection) {
            promise = new Promise((resolve, reject) => {
                listener.execute(message.payload, resolve, reject);
            });
        }

        return promise;
    }

    public addListener (listener: MessageListener) {
        let queryName = listener.messageName;

        if (this.listeners.has(queryName) && this.listeners.get(queryName).size) {
            throw new Error('A query only may have registered one finder');
        }

        super.addListener(listener);
    }
}

export default QueryBus;
