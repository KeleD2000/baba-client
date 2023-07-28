import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class HtmlconvertService {

  constructor(private sanitizer: DomSanitizer) { }

  convertToHtml(text: string): SafeHtml {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = text;
    const htmlElement = wrapper as HTMLElement;
    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlElement.outerHTML);
    return safeHtml;
  }
}
