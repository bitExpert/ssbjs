import Message from '../message/Message';
import AbstractAdapter from './AbstractAdapter';

export default class LoopbackAdapter extends AbstractAdapter {
    public send (message: Message) {
        this._messageHandler(message);
    }

    public open () {
        return;
    }

    public close () {
        return;
    }
}
