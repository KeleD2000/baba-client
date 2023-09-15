import { Component, Renderer2 } from '@angular/core';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  faFB = faFacebook;
  showModal: boolean = false;
  faCopy = faCopyright

  constructor(private renderer: Renderer2){

  }

  openModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
    this.showModal = true;
    this.renderer.addClass(document.body, 'no-scroll');
  }

  closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
    this.showModal = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

}
