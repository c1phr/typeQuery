import ElementLibClass = require("./ElementLib");
var ElementLib = ElementLibClass.ElementLib;

export class AnimationsLib
{
    public static fadeIn(el: Element, duration?: number);
    public static fadeIn(el: string, duration?: number);
    public static fadeIn(el: any, duration = 400) {
        var htmlEl: HTMLElement = ElementLib.selectHtmlElement(el);
        htmlEl.style.opacity = "0";
        var last = +new Date();
        var tick = function() {
            htmlEl.style.opacity = String(+htmlEl.style.opacity + (+new Date() - last) / duration);
            last = + new Date();
            if (+htmlEl.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };

        tick();
    }

    public static fadeOut(el: Element, duration?: number);
    public static fadeOut(el: string, duration?: number);
    public static fadeOut(el: any, duration = 400) {
        var htmlEl: HTMLElement = ElementLib.selectHtmlElement(el);        
        var last = +new Date();
        var tick = function () {
            htmlEl.style.opacity = String(+htmlEl.style.opacity - (+new Date() - last) / duration);
            last = + new Date();
            if (+htmlEl.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };

        tick();
    }
}