class MessageType {
    public static get QUERY():string { return 'QUERY'; }
    public static get QUERYRESULT():string { return 'QUERYRESULT'; }
    public static get EVENT():string { return 'EVENT'; }
    public static get COMMAND():string { return 'COMMAND'; }
}

abstract class Message {
    private _id: String;
    private _type: String;
    private _name: String;
    private _payload: Object;

    constructor (id: String, type: String , name: String, payload?: Object) {
        let me = this;

        if (!name.length) {
            throw new Error('A name has to be a non-empty string');
        }

        payload = payload || {};

        me._id = id;
        me._type = type;
        me._name = name;
        me._payload = payload;
    }

    get id () {
        return this._id;
    }

    get type () {
        return this._type;
    }

    get payload () {
        return Object.assign({}, this._payload);
    }

    get name () {
        return this._name;
    }

    toDto () {
        //@TODO: Change this as soon as we introduce results for other message
        // types than query
        return MessageDto.create(
            this._id,
            this._type,
            this._name,
            true,
            this._payload,
            ''
        );
    }
}

class MessageDto {
    private _id : String;
    private _name : String;
    private _type : String;
    private _payload : Object;
    private _success : Boolean;
    private _error : String;

    constructor (id: String, type: String, name: String, success: Boolean, payload: Object, error: String) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._success = success;
        this._payload = payload;
        this._error = error;
    }

    static create (id: String, type: String, name: String, success: Boolean, payload?: Object, error?: String) {
        return new MessageDto(id, type, name, success, payload || {}, error || '');
    }

    get id () : String {
      return this._id;
    }

    get type () : String {
      return this._type;
    }

    get name () : String {
      return this._name;
    }

    get payload () : Object {
      return this._payload;
    }

    get success () : Boolean {
      return this._success;
    }

    get error () : String {
      return this._error;
    }
}

class Command extends Message {
    constructor (id: String, name: String, payload?: Object) {
        super(id, MessageType.COMMAND, name, payload);
    }
}

class Event extends Message {
    constructor (id: String, name: String, payload?: Object) {
        super(id, MessageType.EVENT, name, payload);
    }
}

class Query extends Message {
    constructor (id: String, name: String, payload?: Object) {
        super(id, MessageType.QUERY, name, payload);
    }
}

class QueryResult extends Message {
    private _success: Boolean;
    private _error: String;

    constructor (id : String, name : String, success: Boolean, payload?: Object,  error?: String) {
        super(id, MessageType.QUERYRESULT, name, payload);
        let me = this;

        me._success = success;
        me._error = error || '';
    }

    get success () : Boolean {
        return this._success;
    }

    get error () : String {
        return this._error;
    }

    toDto () : MessageDto {
      //@TODO: Change this as soon as we introduce results for other message
      // types than query
        return MessageDto.create(
            this.id,
            this.type,
            this.name,
            this.success,
            this.payload,
            this.error
        );
    }
}

class MessageFactory {
    static createFromDto(dto: MessageDto): Message {
        let id = dto.id,
            type = dto.type,
            name = dto.name,
            payload = dto.payload,
            success = dto.success,
            error = dto.error;

        switch (type) {
            case MessageType.COMMAND:
                return new Command(id, name, payload);
            case MessageType.QUERY:
                return new Query(id, name, payload);
            case MessageType.QUERYRESULT:
                return new QueryResult(id, name, success, payload, error);
            case MessageType.EVENT:
                return new Event(id, name, payload);
            default:
                throw new Error('Message type "' + type + '" is not valid');
        }
    }
}

export {Message, Command, Query, QueryResult, Event, MessageFactory, MessageDto, MessageType};
