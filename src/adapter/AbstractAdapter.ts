import Message from '../message/Message';
import Adapter from './Adapter';

abstract class AbstractAdapter implements Adapter {
    protected _messageHandler;

    public abstract send(message: Message);

    public abstract open();

    public abstract close();

    public registerMessageHandler (handler: Function) {
        let me = this;
        me._messageHandler = handler;
    }
}

export default AbstractAdapter;
