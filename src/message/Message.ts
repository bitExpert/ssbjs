import MessageDto from './MessageDto';

class Message {
    protected _id: String;
    protected _type: String;
    protected _name: String;
    protected _payload: Object;

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

    get id (): String {
        return this._id;
    }

    get type (): String {
        return this._type;
    }

    get name (): String {
        return this._name;
    }

    get payload () {
        return Object.assign({}, this._payload);
    }

    public toDto (): MessageDto {
        // @TODO: Change this as soon as we introduce results for other message
        // types than query
        let dto = MessageDto.create(
            this._id,
            this._type,
            this._name,
            true,
            this._payload,
            ''
        );

        return dto;
    }
}

export default Message;
