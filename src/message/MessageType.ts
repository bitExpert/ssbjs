export default class MessageType {
    public static get QUERY(): String {
        return 'QUERY';
    }

    public static get QUERYRESULT(): String {
        return 'QUERYRESULT';
    }

    public static get EVENT(): String {
        return 'EVENT';
    }

    public static get COMMAND(): String {
        return 'COMMAND';
    }
}
