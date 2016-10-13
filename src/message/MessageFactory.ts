import Command from './Command';
import Event from './Event';
import Message from './Message';
import MessageDto from './MessageDto';
import MessageType from './MessageType';
import Query from './Query';
import QueryResult from './QueryResult';

export default class MessageFactory {
    public static createFromDto(dto: MessageDto): Message {
        let id = dto.id,
            type = dto.type,
            name = dto.name,
            payload = dto.payload,
            success = dto.success,
            error = dto.error;

        switch (type) {
            case MessageType.COMMAND:
                return new Command(id, name, payload);
            case MessageType.QUERY:
                return new Query(id, name, payload);
            case MessageType.QUERYRESULT:
                return new QueryResult(id, name, success, payload, error);
            case MessageType.EVENT:
                return new Event(id, name, payload);
            default:
                throw new Error('Message _type "' + type + '" is not valid');
        }
    }
}
