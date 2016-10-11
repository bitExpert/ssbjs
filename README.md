# ssbjs (Simple Service Bus)

A minimalistic UMD library (~42 KB) written in TypeScript providing a simple service bus for events, commands and queries with pluggable
adapters such as PostMessageAPI for communication between iFrame and parent window.


## Message types
ssbjs differentiates between three types of messages. Every type differs from another in the count of allowed listeners, the semantic naming of their listener(s) and their return value
as described below:

### Event
An event may have **many listeners** on the receiving side and is **fire and forget** on the sender's side.
### Command
A command may have **exactly one handler** on the receiving side and is **fire and forget** on the sender's side.
### Query
A query may have **exactly one finder** on the receiving side and will **return a promise** for handling the result.

## Getting started
Simply include servicebus using:

```html
<script type="text/javascript" src="path/to/dist/ssb.min.js"></script>
```

### Usage
Since ```ServiceBus.Adapter.Loopback``` is the default adapter you simply open a bus like this:

``` let serviceBus = ServiceBus.open()```
#### Firing an event
For firing an event, you simply need to call occur() with the name of your event
and arbitrary data you like to provide with the event:

```javascript
serviceBus.occur('myevent', {
    some: 'raw',
    data: 'i send'
});
```
#### Listening to an event

```javascript
// Outputs the payload every time the event is called
serviceBus.on('myevent', function (payload) {
    console.log(payload);
});

// Outputs the payload once and deregisters the handler automatically afterwards
serviceBus.once('myevent', function (payload) {
    console.log(payload); // Outputs '{some: 'raw', data: 'I send'}'
});

```
### Removing event listeners
You may either remove a single listener for an event:
```javascript
// Will remove the listener after being called five times
let counter = 0;
let listener = serviceBus.on('myevent', function (payload) {
    // do awesome stuff
    counter += 1;
    if (counter > 5) {
        serviceBus.off(listener);
    }
});
```

or simply remove all listeners for an event by calling
```javascript
serviceBus.allOff('myevent');
```



#### Sending a command

```javascript
serviceBus.command('mycommand', {
    my: 'command',
    data: 'is awesome'
});
```

#### Handling a command

```javascript
// Outputs the payload everytime the command is send
serviceBus.handle('mycommand', function (payload) {
    console.log(payload);
});
```

#### Making a query
```
serviceBus.query('myquery', {
    data: 'the',
    query: 'needs'
});
```

#### Finding results for a query
```javascript
serviceBus.find('myquery', function (payload, resolve, reject) {
    // you may handle queries asynchrounously and call resolve afterwards

    // simulating...
    setTimeout(function () {
        let result = doStuff();
        resolve(result);
    });
});
```

### PostMessageAPI usage (iFrame)

All the functionality listed above is also available for window <-> iframe communication.
All you need is to open two servicebuses - one on the parent window and one on the iframe:

Parent window:

```javascript
<iframe id="myiframe" src="path/to/iframe/src"></iframe>

<script type="text/javascript">
    let iframe = document.getElementById('myiframe'),
        serviceBus = ServiceBus.open(
            new ServiceBus.Adapter.PostMessageAPI(
                iframe.contentWindow, // the window you want to communicate with
                '*' // the origin which is allowed the communication
            )
        );

    serviceBus.occur('myevent', {
        my: 'super',
        event: 'payload'
    });
</script>
```

iFrame:

```javascript
<script type="text/javascript">
    let iframe = document.getElementById('myiframe'),
        serviceBus = ServiceBus.open(
            new ServiceBus.Adapter.PostMessageAPI(
                parent, // the parent window
                '*' // the origin which is allowed the communication
            )
        );

    serviceBus.on('myevent', function (payload) {
        console.log(payload); // Outputs '{my: 'super', event: 'payload'}
    });
</script>
```

Since ssbjs works transparently, you may use the examples above also
for iFrame use but please note that sender and receiver always are different
windows, since this is meant for **communication between** windows.

Note: This will also work for popups.
