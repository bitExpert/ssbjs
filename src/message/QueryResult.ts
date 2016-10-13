import Message from './Message';
import MessageDto from './MessageDto';
import MessageType from './MessageType';

export default class QueryResult extends Message {
    private _success: Boolean;
    private _error: String;

    constructor (id: String, name: String, success: Boolean, payload?: Object,  error?: String) {
        super(id, MessageType.QUERYRESULT, name, payload);
        let me = this;

        me._success = success;
        me._error = error || '';
    }

    public get success (): Boolean {
        return this._success;
    }

    public get error (): String {
        return this._error;
    }

    public toDto (): MessageDto {
        // @TODO: Change this as soon as we introduce results for other message
        // types than query
        return MessageDto.create(
            this._id,
            this._type,
            this._name,
            this._success,
            this._payload,
            this._error
        );
    }
}
