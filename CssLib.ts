import ElementLibClass = require("./ElementLib");
// ReSharper disable once InconsistentNaming
var ElementLib = ElementLibClass.ElementLib;

/*
 * Collection of functions to modify or retrieve style properties of elements
 */
export class CssLib {
    /*
     * Hide the selected element
     */
    public static hide(el: Element): void;
    public static hide(el: string): void;
    public static hide(el: any) {
        var htmlEl: HTMLElement = ElementLib.selectHtmlElement(el);
        if(!(htmlEl.style.display === "none"))
            htmlEl.style.display = 'none';
    }

    /*
     * Display the selected element
     */
    public static show(el: Element): void;
    public static show(el: string): void;
    public static show(el: any): void
    {
        var htmlEl: HTMLElement = ElementLib.selectHtmlElement(el);
        if(!(htmlEl.style.display === ""))
            htmlEl.style.display = '';
    }     

    /**
     * Get the current vertical position of the scroll bar for the selected element, or window if no element is passed
     * 
     * @el Optional: Element or Selector to get vertical position of
     */
    public static scrollTop(el?: Element): number;
    public static scrollTop(el?: string): number;
    public static scrollTop(el?: any): number {
        if (el === null) {
            if (window.pageYOffset !== undefined) {
                return window.pageYOffset;
            } else {
                var documentRef: HTMLElement = document.documentElement || <HTMLElement>document.body.parentNode || document.body;
                return documentRef.scrollTop;
            }
        } else {
            return ElementLib.selectHtmlElement(el).scrollTop;
        }
    }

    public static outerHeight(el: Element, includeMargin: boolean): number;
    public static outerHeight(el: string, includeMargin: boolean): number;
    public static outerHeight(el: any, includeMargin = false): number {
        var htmlEl = ElementLib.selectHtmlElement(el);
        if (!includeMargin) {
            return htmlEl.offsetHeight;
        } else {
            var height = htmlEl.offsetHeight;
            var style = getComputedStyle(htmlEl);
            height += parseInt(style.marginTop) + parseInt(style.marginBottom);
            return height;
        }
    }

    public static addClass(el: Element, className: string): void;
    public static addClass(el: string, className: string): void;
    public static addClass(el: any, className: string) {
        var htmlEl = ElementLib.selectHtmlElement(el);
        if (htmlEl.classList) {
            htmlEl.classList.add(className);
        } else {
            htmlEl.className += ' ' + className;
        }        
    }

    public static removeClass(el: Element, className: string): void;
    public static removeClass(el: string, className: string): void;
    public static removeClass(el: any, className: string) {
        var htmlEl = ElementLib.selectHtmlElement(el);
        if (htmlEl.classList) {
            htmlEl.classList.remove(className);
        } else {
            htmlEl.className = htmlEl.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    
}

