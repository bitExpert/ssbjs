import Message from './Message';
import MessageType from './MessageType';

export default class Event extends Message {
    constructor (id: String, name: String, payload?: Object) {
        super(id, MessageType.EVENT, name, payload);
    }
}
