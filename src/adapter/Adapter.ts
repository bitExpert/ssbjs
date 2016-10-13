import Message from '../message/Message';

interface Adapter {
    open ();
    close ();
    send (message: Message);
    registerMessageHandler (listener: Function);
}

export default Adapter;
