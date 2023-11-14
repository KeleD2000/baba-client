import { Component, Renderer2 } from '@angular/core';
import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  faFB = faFacebook;
  showModal: boolean = false;
  faCopy = faCopyright;
  fatikTok = faTiktok;
  faInsta= faInstagram;
  modalTitle: string = '';
  modalContent: string = '';

  constructor(private renderer: Renderer2){

  }

  openModal(platform: string) {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
    }
    this.showModal = true;
    this.renderer.addClass(document.body, 'no-scroll');
  
    // Az adott platformnak megfelelő tartalom beállítása
    this.modalTitle = '';
    this.modalContent = '';
    switch (platform) {
      case 'fb':
        this.modalTitle = 'Facebook';
        this.modalContent = 'Fontos adataid védelme, ezért tudatosan nincs összekötve a Babafészkelő oldal és videotár a Facebookkal, vagy más közösségi platformmal. Szerintem nem tartozik az algoritmusra sem az, hogy kisbabát szeretnél, sem az, hogy éppen hol tartasz a ciklusodban.';
        break;
      case 'tiktok':
        this.modalTitle = 'TikTok';
        this.modalContent = 'Fontos adataid védelme, ezért tudatosan nincs összekötve a Babafészkelő oldal és videotár a TikTokkal, vagy más közösségi platformmal. Szerintem nem tartozik az algoritmusra sem az, hogy kisbabát szeretnél, sem az, hogy éppen hol tartasz a ciklusodban.';
        break;
      case 'insta':
        this.modalTitle = 'Instagram';
        this.modalContent = 'Fontos adataid védelme, ezért tudatosan nincs összekötve a Babafészkelő oldal és videotár a Instagrammal, vagy más közösségi platformmal. Szerintem nem tartozik az algoritmusra sem az, hogy kisbabát szeretnél, sem az, hogy éppen hol tartasz a ciklusodban.';
        break;
      // Egyéb platformok esetén további case-ek hozzáadása
    }
  
    // A popup tartalom és cím beállítása
    const modalTitleElement = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    if (modalTitleElement && modalBody) {
      modalTitleElement.innerHTML = this.modalTitle;
      modalBody.innerHTML = this.modalContent;
    }
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
