import {Injectable} from "@angular/core";

@Injectable()
export class UtilsService {

    splitNum( v, delim ): string {
        var buf = parseFloat(v).toFixed(5).split(''), out=[];
        var left = parseInt(buf.splice(-6).slice(1).join(''));
        while(buf.length) {
            out.unshift(buf.splice(-3).join(''));
        }
        return out.join(delim)+(left>0?'.'+left:'');
    }

    insertScript( src ): void {
        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }

    insertCss( src ): void {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = src;
        document.head.appendChild(link);
    }

    copyToClipboard(text: string): boolean {
        if (window['clipboardData'] && window['clipboardData'].setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return window['clipboardData'].setData("Text", text);
        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
}