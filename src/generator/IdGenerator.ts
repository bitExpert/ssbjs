export default class IdGenerator implements Iterator<String>{
    private _current = 1;
    public next() : IteratorResult<String> {
        return {
            done: false,
            value: '_' + Math.random().toString(36).substr(2, 9) + '-' + this._current++
        };
    }

    [Symbol.iterator](): IterableIterator<String> {
        return this;
    }
}
