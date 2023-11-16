import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appFullName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FullNameDirective, multi: true }]
})
export class FullNameDirective implements Validator {
  @Input('appFullName') isFullName: string = 'true';

  validate(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const hasSpace = /\s/.test(value);

    if (this.isFullName === 'true' && !hasSpace) {
      return { 'fullName': true };
    }

    return null;
  }
}
