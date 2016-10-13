export default class MessageDto {
    private _id: String;
    private _name: String;
    private _type: String;
    private _payload: Object;
    private _success: Boolean;
    private _error: String;

    constructor (id: String, type: String, name: String, success: Boolean, payload: Object, error: String) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._success = success;
        this._payload = payload;
        this._error = error;
    }

    public static create (id: String, type: String, name: String, success: Boolean, payload?: Object, error?: String) {
        return new MessageDto(id, type, name, success, payload || {}, error || '');
    }

    public get id (): String {
        return this._id;
    }

    public get type (): String {
        return this._type;
    }

    public get name (): String {
        return this._name;
    }

    public get payload (): Object {
        return this._payload;
    }

    public get success (): Boolean {
        return this._success;
    }

    public get error (): String {
        return this._error;
    }
}
