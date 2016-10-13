import Adapter from './adapter/Adapter';
import LoopbackAdapter from './adapter/LoopbackAdapter';
import PostMessageAPIAdapter from './adapter/PostMessageAPIAdapter';

import Command from './message/Command';
import Event from './message/Event';
import Message from './message/Message';
import Query from './message/Query';
import QueryResult from './message/QueryResult';

import CommandBus from './message/bus/CommandBus';
import EventBus from './message/bus/EventBus';
import QueryBus from './message/bus/QueryBus';
import MessageListener from './message/bus/MessageListener';

import IdGenerator from './generator/IdGenerator';

class PromiseHandle {
    private _resolveCallback;
    private _rejectCallback;

    constructor (resolveCallback: Function, rejectCallback: Function) {
        this._resolveCallback = resolveCallback;
        this._rejectCallback = rejectCallback;
    }

    public resolve (data) {
        return this._resolveCallback(data);
    }

    public reject (data) {
        return this._rejectCallback(data);
    }
}

export default class ServiceBus {
    private _adapter: Adapter;
    private _queryBus: QueryBus;
    private _commandBus: CommandBus;
    private _eventBus: EventBus;
    private _queryHandles: Map<String, PromiseHandle>;
    private _idGenerator: IdGenerator;

    constructor (adapter?: Adapter) {
        let me = this;

        me._adapter = adapter || new LoopbackAdapter();
        me._queryBus = new QueryBus();
        me._commandBus = new CommandBus();
        me._eventBus = new EventBus();
        me._queryHandles = new Map<String, PromiseHandle>();
        me._idGenerator = new IdGenerator();

        me._adapter.registerMessageHandler(me.handleIncomingMessage.bind(me));
        me._adapter.open();
    }

    public static get Adapter(): Object {
        return {
            Loopback: LoopbackAdapter,
            PostMessageAPI: PostMessageAPIAdapter
        };
    };

    public static open (adapter?: Adapter): ServiceBus {
        return new ServiceBus(adapter);
    }

    public close () {
        this._adapter.close();
    }

    public handle (commandName: String, handler: Function, scope?: Object): MessageListener {
        return this._commandBus.register(commandName, handler, scope);
    }

    public on (eventName: String, listener: Function, scope?: Object): MessageListener {
        return this._eventBus.register(eventName, listener, scope);
    }

    public once (eventName: String, listener: Function, scope?: Object): MessageListener {
        return this._eventBus.register(eventName, listener, scope, true);
    }

    public off (listener: MessageListener) {
        this._eventBus.unregister(listener);
    }

    public allOff (eventName: String) {
        this._eventBus.unregisterAllFor(eventName);
    }

    public find (queryName: String, finder: Function, scope?: Object): MessageListener {
        let me = this;
        return me._queryBus.register(queryName, finder, scope);
    }

    public command (commandName: String, payload: Object) {
        let me = this,
            id = me._idGenerator.next().value,
            command = new Command(id, commandName, payload);

        me._adapter.send(command);
    }

    public occur (eventName: String, payload?: Object) {
        let me = this,
            id = me._idGenerator.next().value,
            event = new Event(id, eventName, payload);

        me._adapter.send(event);
    }

    public query (queryName: String, payload?: Object) {
        let me = this,
            id = me._idGenerator.next().value,
            query = new Query(id, queryName, payload),
            promise;

        promise = new Promise((resolve, reject) => {
            me._queryHandles.set(query.id, new PromiseHandle(resolve, reject));
        });

        me._adapter.send(query);
        return promise;
    }

    private handleIncomingMessage (message: Message) {
        let me = this;

        if (message instanceof Command) {
            me._commandBus.dispatch(message);
        }  else if (message instanceof Event) {
            me._eventBus.dispatch(message);
        } else if (message instanceof Query) {
            let result = me._queryBus.dispatch(message);

            result.then((data) => {
                me._adapter.send(new QueryResult(message.id, message.name, true, data));
            }, (reason) => {
                me._adapter.send(new QueryResult(message.id, message.name, false, {}, reason));
            });

        } else if (message instanceof QueryResult) {
            let handle = me._queryHandles.get(message.id);
            if (!handle) {
                throw new Error('No handle found for message with _id ' + message.id + '(' + message.name + ')');
            }

            if (message.success) {
                handle.resolve(message.payload);
            } else {
                handle.reject(message.error);
            }

            me._queryHandles.delete(message.id);
        }
    }

};
