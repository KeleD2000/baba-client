import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import { Letters } from 'src/app/models/Letters';
import { MailchimpService } from 'src/app/services/mailchimp.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  faFB = faFacebook;
  showModal: boolean = false;
  showModal2: boolean = false;
  faCopy = faCopyright;
  fatikTok = faTiktok;
  faInsta= faInstagram;
  modalTitle: string = '';
  modalContent: string = '';
  emailForm: FormGroup;

  constructor(private renderer: Renderer2, private mailchimpService: MailchimpService){
    this.emailForm = new FormGroup(
      {
        email: new FormControl(''),
        first_name: new FormControl(''),
        last_name: new FormControl('')
      }
    )
  }

  sentEmail(){
    if(this.emailForm.valid){
      const datas : Letters = {
        email_address : this.emailForm.get('email')?.value,
        status: "subscribed",
        merge_fields: {
          FNAME: this.emailForm.get('first_name')?.value,
          LNAME: this.emailForm.get('last_name')?.value,
        }
      }
      this.mailchimpService.addEmailToMailChimp(datas).subscribe( l => {
        console.log(l)
      });
    }
  }

  openMessage() {
    const modal2 = document.getElementById('exampleModal2');

    if (modal2) {
      modal2.style.display = 'block';
      modal2.classList.add('show');
    }

    this.showModal2 = true; // Módosítás itt

    this.renderer.addClass(document.body, 'no-scroll');

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


  

  closeModal(modalNumber: number) {
    const modal = document.getElementById('exampleModal');
    const modal2 = document.getElementById('exampleModal2');
    if (modal && modal2) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal2.style.display = 'none';
      modal2.classList.remove('show');
    }
    this.showModal = false;
    this.showModal2 = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

}
