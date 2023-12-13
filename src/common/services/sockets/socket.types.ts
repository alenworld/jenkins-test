type eventEmitPrefix = 'new' | 'updated' | 'subscribed' | 'unsubscribed';
type eventEmitSuffix = 'file' | 'mention';
type eventEmitActions = 'error' | 'message' | 'pong';

type eventPrefix = 'subscribe' | 'unsubscribe';
type eventSuffix = 'file' | 'mention';
type eventActions = 'error' | 'message' | 'ping';

export type SocketRoom = `file-${string}` | `user-${string}`;

type SocketEvent = `${eventPrefix}-${eventSuffix}` | eventActions;
export type SocketEmitEvent = `${eventEmitPrefix}-${eventEmitSuffix}` | eventEmitActions;

export default SocketEvent;
