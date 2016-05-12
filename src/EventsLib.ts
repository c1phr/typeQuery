export class EventsLib
{
    /*
     * Provides an interface to throttle the emission of an event that is raised more often than invocation is needed.
     * This is important for things like scroll events where processing each time the event is raised can cause slow scrolling.
     * To use this helper, call eventThrottle(stringEventToThrottle, stringNewThrottledEventName), and then add an event listener for the new event.
     * Ex: eventThrottle("scroll", "optimizedScroll"); window.addEventListener("optimizedScroll", ...)
     */
    public static eventThrottle(eventType, name, obj?) {
        obj = obj || window;
        var running = false;
        var func = function () {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function () {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(eventType, func);
    }
} 