import ElementLibClass = require("./ElementLib");
import CssLibClass = require("./CssLib");
import AnimationsLibClass = require("./AnimationsLib");
import EventsLibClass = require("./EventsLib");

// ReSharper disable InconsistentNaming
var CssLib = CssLibClass.CssLib;
var ElementLib = ElementLibClass.ElementLib;
var AnimationsLib = AnimationsLibClass.AnimationsLib;
// ReSharper restore InconsistentNaming

export class HtmlQueryElement {
    private internalEl: HTMLElement;
    private internalElArray: HtmlQueryElement[]; // Store multiple elements returned by broad selectors
    private multiElement(): Boolean {
        return this.internalElArray.length > 1;
    }    

    public constructor(el: string);
    public constructor(el: HTMLElement);
    public constructor(el: Element);
    public constructor(el: any) {
        this.internalElArray = [];
        if (el instanceof HTMLElement) {
            this.internalEl = el;
        } else {
            if (typeof el === "string") { // Determine which selector to use for minor performance
                if (el.indexOf("#") === 0 && el.indexOf(" ") < 0) {
                    this.internalEl = <HTMLElement>document.querySelector(el);
                } else {
                    var elements = document.querySelectorAll(el);
                    if (elements.length > 1) { // If the selector returned many elements, keep track of them all
                        for (var i = 0; i < elements.length; i++) {
                            this.internalElArray.push(new HtmlQueryElement(elements[i]));
                        }
                    } else { // queryAll still returned a single element
                        this.internalEl = <HTMLElement>elements[0];
                    }
                }                                
            } else { // Guaranteed to only get a single element
                this.internalEl = <HTMLElement>el;                
            }
        }
    }        

    public siblings(): HtmlQueryElement {
        if (this.internalEl === undefined || this.internalEl === null) {
            return this;
        }
        var nodeList = Array.prototype.filter.call((this.getInternal() as any).parentNode.children, (child) => child !== this.getInternal());
        return new HtmlQueryElement(nodeList);
    }

    public index(): number {
        var i = 1;
        var node = this.internalEl as Element;
        while (node = node.previousElementSibling) {
            if (node.nodeType === 1) {
                i++;
            }
        }
        return i;
    }

    public eq(index: number): HtmlQueryElement {
        if (this.multiElement()) {
            return this.internalElArray[index];
        }
        return null;
    }

    // CssLib
    public addClass(className: string): void {
        return this.invoke(CssLib.addClass, className);        
    }

    public removeClass(className: string): void {
        return this.invoke(CssLib.removeClass, className);  
    }

    public show(): void {
        return this.invoke(CssLib.show);
    }

    public hide(): void {
        return this.invoke(CssLib.hide);        
    }

    public scrollTop(): number {
        return CssLib.scrollTop(this.internalEl);
    }

    public outerHeight(includeMargin = false): number {
        return CssLib.outerHeight(this.internalEl, includeMargin);
    }

    // ElementLib
    public hasClass(className: string): boolean {
        return ElementLib.hasClass(this.internalEl, className);
    }

    public html(newHtml?: any): string {
        return this.invoke(ElementLib.html, newHtml);        
    }

    public attr(attrib: string, newValue?: string): string {
        return this.invoke(ElementLib.attr, attrib, newValue);        
    }

    public append(content: Node): void;
    public append(content: string): void;
    public append(content: any): void {
        return this.invoke(ElementLib.append, content);        
    }

    public remove(): void {
        return this.invoke(ElementLib.remove);        
    }
    
    public val(newVal?: string): string {        
        return ElementLib.val(this.internalEl, newVal);
    }

    public text(newText?: string): string {
        return ElementLib.text(this.internalEl, newText);
    }

    public addEventListener(event: string, cb: Function) {
        return this.invoke(ElementLib.addEventListener, event, cb);
    }

    // AnimationsLib
    public fadeIn(duration?: number) {
        return this.invoke(AnimationsLib.fadeIn, duration);        
    }

    public fadeOut(duration?: number) {
        return this.invoke(AnimationsLib.fadeOut, duration);        
    }

    public data(key: string = null, val: any = null):any {
        if (key === null && val === null)
            return this.internalEl.dataset;
        if (val === null)
            return this.internalEl.dataset[key];
        else
            this.internalEl.dataset[key] = val;
    }


    //EventsLib

    //Helpers
    /*
     * Emulates jQuery's .each() and implements a form of ES6's for...of loops that work in ES5
     */    
    public each(callback: Function) {
        if (!this.multiElement()) {
            callback(this);
        } else {
            for (var i = 0; i < this.internalElArray.length; i++) {
                callback(this.internalElArray[i]);
            }            
        }
        return this;
    }

    /*
     * Expose the internal HTMLElement to call methods like .focus()
     */
    public getInternal(): HTMLElement {
        return this.internalEl;
    }

    /*
     * Expose the element array outside this class
     */
    public getElements(): HtmlQueryElement[] {
        if (this.multiElement()) {
            return this.internalElArray;
        } else {
            return [this];
        }
    }

    /*
     * Invoke will handle running a method for each element selected in the case where a selector returns multiple DOM elements
     */
    private invoke(func: Function, ...params: any[]): any {        
        if (this.multiElement()) {
            for (var i = 0; i < this.internalElArray.length; i++) {
                if (params) {
                    func.apply(this, [this.internalElArray[i].internalEl].concat(params));
                } else {
                    func.apply(this, this.internalElArray[i].internalEl);
                }
            }
        } else {
            if (this.internalEl === undefined || this.internalEl === null) {
                return undefined;
            }
            if (params) {                
                return func.apply(this, [this.internalEl].concat(params));
            } else {
                return func.apply(this, [this.internalEl]);
            }            
        }
    }
}

