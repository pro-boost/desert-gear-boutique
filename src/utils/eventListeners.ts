/**
 * Adds a passive event listener to an element
 * @param element The element to add the listener to
 * @param eventName The event name (e.g., 'touchstart', 'wheel')
 * @param handler The event handler function
 * @param options Additional options for the event listener
 */
export const addPassiveEventListener = (
  element: HTMLElement | Window | Document,
  eventName: string,
  handler: EventListenerOrEventListenerObject,
  options: AddEventListenerOptions = {}
) => {
  const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
  
  if (passiveEvents.includes(eventName)) {
    element.addEventListener(eventName, handler, {
      ...options,
      passive: true,
    });
  } else {
    element.addEventListener(eventName, handler, options);
  }
};

/**
 * Removes an event listener from an element
 * @param element The element to remove the listener from
 * @param eventName The event name
 * @param handler The event handler function
 * @param options Additional options for the event listener
 */
export const removeEventListener = (
  element: HTMLElement | Window | Document,
  eventName: string,
  handler: EventListenerOrEventListenerObject,
  options: AddEventListenerOptions = {}
) => {
  element.removeEventListener(eventName, handler, options);
}; 