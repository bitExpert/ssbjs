import Message from './Message';
import MessageType from './MessageType';

export default class Command extends Message {
    constructor (id: String, name: String, payload?: Object) {
        super(id, MessageType.COMMAND, name, payload);
    }
}
