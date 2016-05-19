/*
 * Contains a group of functions to handle operating on DOM elements
 */
export class ElementLib {
    /*
 * Helper function to retrieve an HTMLElement object from an object that 
 * corresponds to the Element interface or a selector
 * 
 * @el Element or selector string
 */
    public static selectHtmlElement(el: string): HTMLElement;
    public static selectHtmlElement(el: Element): HTMLElement;
    public static selectHtmlElement(el: any): HTMLElement {
        var htmlEl: HTMLElement;
        if (el instanceof HTMLElement) { // Don't re-query the dom if we already have an HTMLElement instance
            return el;
        }

        if (typeof el === "string") {
            htmlEl = <HTMLElement>document.querySelector(el);
        } else {
            htmlEl = <HTMLElement>el;
        }

        return htmlEl;
    }  
    /*
     * Determine if the passed element has a given class
     * 
     * @el Selected element to check
     * @className class name to check for
     */
    public static hasClass(el: Element, className: string): boolean;
    public static hasClass(el: string, className: string): boolean;
    public static hasClass(el: any, className: string): boolean {
        var htmlEl = ElementLib.selectHtmlElement(el);
        if (htmlEl.classList) {
            return htmlEl.classList.contains(className);
        } else {
            return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
        }
    }

    /*
     * Thin wrapper over innerHTML to emulate jQuery's .html()
     */
    public static html(el: Element, newHtml?: Element): string;
    public static html(el: string, newHtml?: Element): string;
    public static html(el: Element, newHtml?: string): string;
    public static html(el: string, newHtml?: string): string;
    public static html(el: any, newHtml?: any): string {
        var htmlEl = ElementLib.selectHtmlElement(el);        
        if (newHtml) { // Setting
            if (newHtml instanceof Element) {
                var newElement = document.createElement("div");
                newElement.appendChild(newHtml.cloneNode(true));
                newHtml = newElement.innerHTML;                
            }
            htmlEl.innerHTML = newHtml;
        }
        else if (newHtml === "") {
            htmlEl.innerHTML = newHtml;
        }
        return htmlEl.innerHTML;
    } 

    public static attr(el: Element, attrib: string, newValue?: string): string;
    public static attr(el: string, attrib: string, newValue?: string): string;
    public static attr(el: any, attrib: string, newValue?: string): string {
        var htmlEl = ElementLib.selectHtmlElement(el);
        if (newValue) { // Setting attributes
            htmlEl.setAttribute(attrib, newValue);
        }

        return htmlEl.getAttribute(attrib);
    }

    public static append(el: Element, content: string): void;
    public static append(el: Element, content: Node): void;
    public static append(el: string, content: string): void;
    public static append(el: string, content: Node): void;
    public static append(el: any, content: any): void {        
        var htmlEl = ElementLib.selectHtmlElement(el);
        if (typeof content === "string") { // Appending HTML string
            htmlEl.insertAdjacentHTML('beforeend', content);
        } else {
            htmlEl.appendChild(content);
        }
    }

    public static remove(el: Element): void;
    public static remove(el: string): void;
    public static remove(el: any): void {
        var htmlEl = ElementLib.selectHtmlElement(el);
        htmlEl.parentNode.removeChild(htmlEl);
    }

    public static val(el: Element, newVal?: string): string;
    public static val(el: string, newVal?: string): string;
    public static val(el: any, newVal?: string): string {
        var inputEl = <HTMLInputElement>ElementLib.selectHtmlElement(el);
        if (inputEl === undefined) {
            return undefined;
        }
        if (newVal !== undefined) {
            inputEl.value = newVal;
        }
        return inputEl.value;
    } 

    public static text(el: Element, newText?: string): string;
    public static text(el: string, newText?: string): string;
    public static text(el: any, newText?: string): string {
        var htmlEl = <HTMLElement>ElementLib.selectHtmlElement(el);
        if (htmlEl === undefined) {
            return undefined;
        }
        if (newText !== undefined) {
            htmlEl.textContent = newText;
        }
        return htmlEl.textContent;
    }

    public static addEventListener(el: Element, event: string, cb: Function): void;
    public static addEventListener(el: string, event: string, cb: Function): void;
    public static addEventListener(el: any, event: string, cb: Function): void {
        var htmlEl = ElementLib.selectHtmlElement(el);
        htmlEl.addEventListener(event, cb as EventListener);
    }
}

