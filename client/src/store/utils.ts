// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Returned<T> = T extends (...args: any[]) => any ? ReturnType<T> : T

export type AppDispatch = <T>(action: T) => Returned<T>
