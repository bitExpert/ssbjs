import Message from '../message/Message';
import MessageDto from '../message/MessageDto';
import MessageFactory from '../message/MessageFactory';
import AbstractAdapter from './AbstractAdapter';

export default class PostMessageAPIAdapter extends AbstractAdapter {
    private _element: Window;
    private _origin: string;
    private _listener: EventListenerOrEventListenerObject;

    constructor (element, origin: string) {
        super();
        let me = this;

        me._element = element;
        me._origin = origin;
    }

    public open () {
        let me = this;

        if (me._listener) {
            return;
        }

        me._listener = (event: MessageEvent) => {
            me._messageHandler(me.messageFromEvent(event));
        };

        window.addEventListener('message', me._listener);
    }

    public close () {
        let me = this;

        if (me._listener) {
            window.removeEventListener('message', me._listener);
            me._listener = null;
        }

    }

    public send (message: Message) {
        let me = this;
        me._element.postMessage(message.toDto(), me._origin);
    }

    protected messageFromEvent(event: MessageEvent) {
        let data = event.data,
            dto = MessageDto.create(
                data._id,
                data._type,
                data._name,
                data._success,
                data._payload,
                data._error
            );

        return MessageFactory.createFromDto(dto);
    }
}
