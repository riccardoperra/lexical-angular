import {Directive, forwardRef, Inject} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {distinctUntilChanged, map, takeUntil} from 'rxjs';
import {$getRoot} from 'lexical';
import {LexicalController} from '../../lexical.controller';

@Directive({
  selector:
    '[lexicalComposer][formControl], [lexicalComposer][formControlName], [lexicalComposer][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LexicalControlValueAccessorDirective),
      multi: true,
    },
  ],
})
export class LexicalControlValueAccessorDirective
  implements ControlValueAccessor
{
  value: string = '';
  onChange: (value: string) => void = (value: string) => void 0;
  onTouched: () => void = () => void 0;

  constructor(
    @Inject(LexicalController)
    private readonly controller: LexicalController
  ) {}

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;

    this.controller.onUpdate$
      .pipe(
        map(({editorState}) =>
          editorState.read(() => $getRoot().getTextContent())
        ),
        distinctUntilChanged(),
        takeUntil(this.controller.destroy$)
      )
      .subscribe(content => {
        this.value = content;
        this.onChange(content);
      });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
}
