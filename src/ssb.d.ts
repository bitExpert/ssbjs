declare module 'ssbjs/src/message/MessageDto' {
	export default class MessageDto {
	    private _id;
	    private _name;
	    private _type;
	    private _payload;
	    private _success;
	    private _error;
	    constructor(id: String, type: String, name: String, success: Boolean, payload: Object, error: String);
	    static create(id: String, type: String, name: String, success: Boolean, payload?: Object, error?: String): MessageDto;
	    id: String;
	    type: String;
	    name: String;
	    payload: Object;
	    success: Boolean;
	    error: String;
	}

}
declare module 'ssbjs/src/message/Message' {
	import MessageDto from 'ssbjs/src/message/MessageDto'; class Message {
	    protected _id: String;
	    protected _type: String;
	    protected _name: String;
	    protected _payload: Object;
	    constructor(id: String, type: String, name: String, payload?: Object);
	    id: String;
	    type: String;
	    name: String;
	    payload: {} & Object;
	    toDto(): MessageDto;
	}
	export default Message;

}
declare module 'ssbjs/src/adapter/Adapter' {
	import Message from 'ssbjs/src/message/Message';
	interface Adapter {
	    open(): any;
	    close(): any;
	    send(message: Message): any;
	    registerMessageHandler(listener: Function): any;
	}
	export default Adapter;

}
declare module 'ssbjs/src/adapter/AbstractAdapter' {
	import Message from 'ssbjs/src/message/Message';
	import Adapter from 'ssbjs/src/adapter/Adapter'; abstract class AbstractAdapter implements Adapter {
	    protected _messageHandler: any;
	    abstract send(message: Message): any;
	    abstract open(): any;
	    abstract close(): any;
	    registerMessageHandler(handler: Function): void;
	}
	export default AbstractAdapter;

}
declare module 'ssbjs/src/adapter/LoopbackAdapter' {
	import Message from 'ssbjs/src/message/Message';
	import AbstractAdapter from 'ssbjs/src/adapter/AbstractAdapter';
	export default class LoopbackAdapter extends AbstractAdapter {
	    send(message: Message): void;
	    open(): void;
	    close(): void;
	}

}
declare module 'ssbjs/src/message/MessageType' {
	export default class MessageType {
	    static QUERY: String;
	    static QUERYRESULT: String;
	    static EVENT: String;
	    static COMMAND: String;
	}

}
declare module 'ssbjs/src/message/Command' {
	import Message from 'ssbjs/src/message/Message';
	export default class Command extends Message {
	    constructor(id: String, name: String, payload?: Object);
	}

}
declare module 'ssbjs/src/message/Event' {
	import Message from 'ssbjs/src/message/Message';
	export default class Event extends Message {
	    constructor(id: String, name: String, payload?: Object);
	}

}
declare module 'ssbjs/src/message/Query' {
	import Message from 'ssbjs/src/message/Message';
	export default class Query extends Message {
	    constructor(id: String, name: String, payload?: Object);
	}

}
declare module 'ssbjs/src/message/QueryResult' {
	import Message from 'ssbjs/src/message/Message';
	import MessageDto from 'ssbjs/src/message/MessageDto';
	export default class QueryResult extends Message {
	    private _success;
	    private _error;
	    constructor(id: String, name: String, success: Boolean, payload?: Object, error?: String);
	    success: Boolean;
	    error: String;
	    toDto(): MessageDto;
	}

}
declare module 'ssbjs/src/message/MessageFactory' {
	import Message from 'ssbjs/src/message/Message';
	import MessageDto from 'ssbjs/src/message/MessageDto';
	export default class MessageFactory {
	    static createFromDto(dto: MessageDto): Message;
	}

}
declare module 'ssbjs/src/adapter/PostMessageAPIAdapter' {
	import Message from 'ssbjs/src/message/Message';
	import AbstractAdapter from 'ssbjs/src/adapter/AbstractAdapter';
	export default class PostMessageAPIAdapter extends AbstractAdapter {
	    private _element;
	    private _origin;
	    private _listener;
	    constructor(element: any, origin: string);
	    open(): void;
	    close(): void;
	    send(message: Message): void;
	    protected messageFromEvent(event: MessageEvent): Message;
	}

}
declare module 'ssbjs/src/message/bus/MessageListener' {
	 class MessageListener {
	    private _messageName;
	    private _fn;
	    private _scope;
	    private _once;
	    constructor(messageName: String, fn: Function, scope?: Object, once?: Boolean);
	    messageName: String;
	    once: Boolean;
	    execute(messagePayload?: Object, resolve?: Function, reject?: Function): any;
	}
	export default MessageListener;

}
declare module 'ssbjs/src/message/bus/MessageBus' {
	import MessageListener from 'ssbjs/src/message/bus/MessageListener'; class MessageBus {
	    protected listeners: Map<String, Set<MessageListener>>;
	    constructor();
	    register(messageName: String, fn: Function, scope: Object, once?: Boolean): MessageListener;
	    unregister(listener: MessageListener): void;
	    unregisterAllFor(messageName: any): void;
	    addListener(listener: MessageListener): void;
	}
	export default MessageBus;

}
declare module 'ssbjs/src/message/bus/CommandBus' {
	import Message from 'ssbjs/src/message/Message';
	import MessageBus from 'ssbjs/src/message/bus/MessageBus';
	import MessageListener from 'ssbjs/src/message/bus/MessageListener'; class CommandBus extends MessageBus {
	    dispatch(message: Message): boolean;
	    addListener(listener: MessageListener): void;
	}
	export default CommandBus;

}
declare module 'ssbjs/src/message/bus/EventBus' {
	import Message from 'ssbjs/src/message/Message';
	import MessageBus from 'ssbjs/src/message/bus/MessageBus'; class EventBus extends MessageBus {
	    dispatch(message: Message): boolean;
	}
	export default EventBus;

}
declare module 'ssbjs/src/message/bus/QueryBus' {
	import Message from 'ssbjs/src/message/Message';
	import MessageBus from 'ssbjs/src/message/bus/MessageBus';
	import MessageListener from 'ssbjs/src/message/bus/MessageListener'; class QueryBus extends MessageBus {
	    dispatch(message: Message): any;
	    addListener(listener: MessageListener): void;
	}
	export default QueryBus;

}
declare module 'ssbjs/src/generator/IdGenerator' {
	export default class IdGenerator implements Iterator<String> {
	    private current;
	    next(): IteratorResult<String>;
	    [Symbol.iterator](): IterableIterator<String>;
	}

}
declare module 'ssbjs/src/ServiceBus' {
	import Adapter from 'ssbjs/src/adapter/Adapter';
	import MessageListener from 'ssbjs/src/message/bus/MessageListener';
	export default class ServiceBus {
	    private _adapter;
	    private _queryBus;
	    private _commandBus;
	    private _eventBus;
	    private _queryHandles;
	    private _idGenerator;
	    constructor(adapter?: Adapter);
	    static Adapter: Object;
	    static open(adapter?: Adapter): ServiceBus;
	    close(): void;
	    handle(commandName: String, handler: Function, scope?: Object): MessageListener;
	    on(eventName: String, listener: Function, scope?: Object): MessageListener;
	    once(eventName: String, listener: Function, scope?: Object): MessageListener;
	    off(listener: MessageListener): void;
	    allOff(eventName: String): void;
	    find(queryName: String, finder: Function, scope?: Object): MessageListener;
	    command(commandName: String, payload: Object): void;
	    occur(eventName: String, payload?: Object): void;
	    query(queryName: String, payload?: Object): any;
	    private handleIncomingMessage(message);
	}

}
