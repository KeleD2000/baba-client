import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetpw: FormGroup;
  user: string | null = null;
  token: string | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.resetpw = new FormGroup(
      {
        new_password: new FormControl('', [Validators.required]),
      }
    )
  }

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      this.user = params['user'];
      this.token = params['token'];
    });
  }

  resetPw() {
    if (this.resetpw.valid) {
      console.log(this.resetpw.get('new_password')?.value);
      const resetPw = {
        "name" : this.user,
        "temp_pass" : this.token,
        "new_pass" : this.resetpw.get('new_password')?.value
      }
      this.authService.resetPassword(resetPw).subscribe( pw => {
        console.log(pw);
        this.router.navigate(['/signin']);
      });
    }
  }



}
