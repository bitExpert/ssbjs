import { Message } from './Message';

class MessageListener {
    private _messageName;
    private _fn;
    private _scope;
    private _once;

    constructor (messageName: String, fn: Function, scope?: Object, once?: Boolean) {
        this._messageName = messageName;
        this._fn = fn;
        this._scope = scope;
        this._once = once;
    }

    get messageName () : String {
        return this._messageName;
    }

    get once () : Boolean {
        return this._once;
    }

    execute (messagePayload?: Object, resolve?: Function, reject?: Function) {
        return this._fn.call(this._scope, messagePayload, resolve, reject);
    }
}

class MessageBus {
    protected _listeners : Map<String, Set<MessageListener>>;

    constructor () {
        this._listeners = new Map<String, Set<MessageListener>>();
    }

    register (messageName: String, fn: Function, scope:Object, once?:Boolean) : MessageListener {
        let listener = new MessageListener(messageName, fn, scope, once);
        this.addListener(listener);
        return listener;
    }

    unregister (listener: MessageListener) {
        if (!this._listeners.has(listener.messageName)) {
            return;
        }

        this._listeners.get(listener.messageName).delete(listener);
    }

    unregisterAllFor (messageName) {
        if (!this._listeners.has(messageName)) {
            return;
        }

        this._listeners.delete(messageName);
    }

    addListener (listener: MessageListener) {
        let messageName = listener.messageName;

        if (!this._listeners.has(messageName)) {
            this._listeners.set(messageName, new Set<MessageListener>());
        }

        this._listeners.get(messageName).add(listener);
    }
}

class EventBus extends MessageBus {
    dispatch (message: Message) {
        if (!this._listeners.has(message.name)) {
            return false;
        }

        let collection = this._listeners.get(message.name);

        for (let listener of collection) {
            if (listener.once) {
                this.unregister(listener);
            }
            listener.execute(message.payload);
        }
    }
}

class CommandBus extends MessageBus {
    dispatch (message: Message) {
        if (!this._listeners.has(message.name)) {
            return false;
        }

        let collection = this._listeners.get(message.name);

        for (let listener of collection) {
            listener.execute(message.payload);
        }
    }

    addListener (listener: MessageListener) {
        let commandName = listener.messageName;

        if (this._listeners.has(commandName) && this._listeners.get(commandName).size) {
            throw new Error('A command only may have registered one handler');
        }

        super.addListener(listener);
    }
}

class QueryBus extends MessageBus {
    dispatch (message: Message) {
        let promise;

        if (!this._listeners.has(message.name)) {
            return Promise.reject('No finder registered for query "' + message.name + '"');
        }

        let collection = this._listeners.get(message.name);

        for (let listener of collection) {
            promise = new Promise(function (resolve, reject) {
                listener.execute(message.payload, resolve, reject);
            });
        }

        return promise;
    }

    addListener (listener: MessageListener) {
        let queryName = listener.messageName;

        if (this._listeners.has(queryName) && this._listeners.get(queryName).size) {
            throw new Error('A query only may have registered one finder');
        }

        super.addListener(listener);
    }
}

export {EventBus, CommandBus, QueryBus, MessageListener};
