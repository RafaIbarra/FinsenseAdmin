let listeners = []

export const onSessionExpired = (callback) => {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((cb) => cb !== callback)
  }
}

export const emitSessionExpired = () => {
  listeners.forEach((cb) => cb())
}