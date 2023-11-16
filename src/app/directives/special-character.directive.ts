import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appSpecialCharacter]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SpecialCharacterDirective, multi: true }]
})
export class SpecialCharacterDirective implements Validator {
  @Input('appSpecialCharacter') isSpecial: string = 'true';

  validate(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (this.isSpecial === 'true' && !hasSpecialCharacter) {
      return { 'specialCharacter': true };
    }

    return null;
  }
}
