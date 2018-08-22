import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[boxDynamicComponent]'
})

export class DynamicComponent {

  constructor(
    public viewContainerRef: ViewContainerRef
  ){}



}
