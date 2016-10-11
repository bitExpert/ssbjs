import {Message, Command, Query, QueryResult, Event} from './message/Message';
import {CommandBus, QueryBus, EventBus, MessageListener} from './message/MessageBus';
import {Adapter, Adapters} from './adapter/Adapter';
import IdGenerator from './generator/IdGenerator';

class PromiseHandle {
    private _resolveCallback;
    private _rejectCallback;

    constructor(resolveCallback: Function, rejectCallback: Function) {
        this._resolveCallback = resolveCallback;
        this._rejectCallback = rejectCallback;
    }

    resolve(data) {
        return this._resolveCallback(data);
    }

    reject(data) {
        return this._rejectCallback(data);
    }
}

export default class ServiceBus {
    private _queryBus: QueryBus;
    private _commandBus: CommandBus;
    private _eventBus: EventBus;
    private _queryHandles: Map<String, PromiseHandle>;
    private _adapter: Adapter;
    private _idGenerator: IdGenerator;

    constructor (adapter? : Adapter) {
        let me = this;

        me._adapter = adapter || new Adapters.Loopback();
        me._queryBus = new QueryBus();
        me._commandBus = new CommandBus();
        me._eventBus = new EventBus();
        me._queryHandles = new Map<String, PromiseHandle>();
        me._idGenerator = new IdGenerator();

        me._adapter.registerMessageHandler(me.handleIncomingMessage.bind(me));
    }

    public static get Adapter(): Adapters { return Adapters };

    static open (adapter?: Adapter): ServiceBus {
        return new ServiceBus(adapter);
    }

    close () {

    }

    private handleIncomingMessage(message: Message) {
        let me = this;

        if (message instanceof Command) {
            me._commandBus.dispatch(message);
        }  else if (message instanceof Event) {
            me._eventBus.dispatch(message);
        } else if (message instanceof Query) {
            let result = me._queryBus.dispatch(message);

            result.then(function (data) {
                me._adapter.send(new QueryResult(message.id, message.name, true, data));
            }, function (reason) {
                me._adapter.send(new QueryResult(message.id, message.name, false, {}, reason));
            });

        } else if (message instanceof QueryResult) {
            let handle = me._queryHandles.get(message.id);
            if (!handle) {
                throw new Error('No handle found for message with id ' + message.id + '(' + message.name + ')');
            }

            if (message.success) {
                handle.resolve(message.payload);
            } else {
                handle.reject(message.error);
            }

            me._queryHandles.delete(message.id);
        }
    }

    handle (commandName: String, handler: Function, scope?: Object) : MessageListener {
        let me = this;
        return me._commandBus.register(commandName, handler, scope);
    }

    on (eventName: String, listener: Function, scope?: Object) : MessageListener {
        let me = this;
        return me._eventBus.register(eventName, listener, scope);
    }

    once (eventName:String, listener: Function, scope?: Object) : MessageListener {
        let me = this;
        return me._eventBus.register(eventName, listener, scope, true);
    }

    off (listener: MessageListener) {
        let me = this;
        me._eventBus.unregister(listener);
    }

    allOff (eventName : String) {
        var me = this;
        me._eventBus.unregisterAllFor(eventName);
    }

    find (queryName: String, finder: Function, scope?: Object) : MessageListener {
        let me = this;
        return me._queryBus.register(queryName, finder, scope);
    }

    command (commandName: String, payload: Object) {
        let me = this,
            id = me._idGenerator.next().value,
            command = new Command(id, commandName, payload);

        me._adapter.send(command);
    }

    occur (eventName: String, payload?: Object) {
        let me = this,
            id = me._idGenerator.next().value,
            event = new Event(id, eventName, payload);

        me._adapter.send(event);
    }

    query (queryName: String, payload?: Object) {
        let me = this,
            id = me._idGenerator.next().value,
            query = new Query(id, queryName, payload),
            promise;

        promise = new Promise(function (resolve, reject) {
            me._queryHandles.set(query.id, new PromiseHandle(resolve, reject));
        });

        me._adapter.send(query);
        return promise;
    }
};
