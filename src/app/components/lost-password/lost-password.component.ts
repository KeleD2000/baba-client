import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})
export class LostPasswordComponent {
  showModal: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  passwordMessage: string = '';
  lostpw: FormGroup;

  constructor(private authService: AuthService, private route: Router, private userService: UserService, private renderer: Renderer2) {
    this.lostpw = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
      }
    )
  }

  lostPw() {
    if (this.lostpw.valid) {
      console.log(this.lostpw.get('email')?.value);
      const resetPw = {
        "mail": this.lostpw.get('email')?.value
      }
      this.authService.lostPassword(resetPw).subscribe(pw => {
        console.log(pw);
        for(const [key, value] of Object.entries(pw)){
          if(key === 'message'){
            this.passwordMessage = value;
          }
        }
        this.openModal();
      });
    }
  }

  openModal() {
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
    this.modalTitle = 'Sikeres email küldés.';
    this.modalContent = this.passwordMessage;

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
