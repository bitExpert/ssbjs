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

    public get messageName (): String {
        return this._messageName;
    }

    public get once (): Boolean {
        return this._once;
    }

    public execute (messagePayload?: Object, resolve?: Function, reject?: Function) {
        let me = this;
        return me._fn.call(me._scope, messagePayload, resolve, reject);
    }
}

export default MessageListener;
