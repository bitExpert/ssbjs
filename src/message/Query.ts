import Message from './Message';
import MessageType from './MessageType';

export default class Query extends Message {
    constructor (id: String, name: String, payload?: Object) {
        super(id, MessageType.QUERY, name, payload);
    }
}
