import { Message, MessageDto, MessageFactory } from '../message/Message';

interface Adapter {
    send(message: Message);
    registerMessageHandler(listener: Function);
}

abstract class AbstractAdapter implements Adapter {
    protected _messageHandler;

    abstract send(message: Message);

    registerMessageHandler (handler: Function) {
        var me = this;
        me._messageHandler = handler;
    }
}

class PostMessageAPIAdapter extends AbstractAdapter {
    private _element : Window;
    private _origin: string;

    constructor (element, origin: string) {
        super();
        var me = this;

        me._element = element;
        me._origin = origin;

        window.addEventListener('message', function (event: MessageEvent) {
            me._messageHandler(me.messageFromEvent(event));
        });
    }

    send (message : Message) {
        var me = this;
        me._element.postMessage(message.toDto(), me._origin);
    }

    protected messageFromEvent(event : MessageEvent) {
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

class LoopbackAdapter extends AbstractAdapter {
    send (message : Message) {
        var me = this;
        me._messageHandler(message);
    }
}

class Adapters {
    public static get PostMessageAPI() { return PostMessageAPIAdapter };
    public static get Loopback() { return LoopbackAdapter };
}

export { Adapter, Adapters, LoopbackAdapter, PostMessageAPIAdapter };
