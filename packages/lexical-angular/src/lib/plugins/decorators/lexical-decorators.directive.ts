import {
  Directive,
  OnDestroy,
  OnInit,
  Inject,
  ViewContainerRef,
  Type,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  ComponentRef,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {Subject, Subscription} from 'rxjs';
import {AngularNode} from '../common/angular-node';

@Directive({selector: '[lexicalDecorators]'})
export class LexicalDecoratorsDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private subscriptions = new Subscription();
  private decoratedcomponentRef: ComponentRef<AngularNode>[] = [];

  constructor(
    private readonly controller: LexicalController,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private app: ApplicationRef,
    @Inject(ViewContainerRef)
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    const {editor} = this.controller;

    const unsubscribe = editor.registerDecoratorListener<Type<AngularNode>>(
      nextDecorators => {
        const decoratedcomponentRef = [];
        const decoratorKeys = Object.keys(nextDecorators);

        for (let i = 0; i < decoratorKeys.length; i++) {
          const nodeKey = decoratorKeys[i];
          const angularDecorator = nextDecorators[nodeKey];
          const element = editor.getElementByKey(nodeKey);

          if (element !== null) {
            this.viewContainerRef.clear();
            const factory =
              this.resolver.resolveComponentFactory(angularDecorator);

            const componentRef = factory.create(this.injector, [], element);
            componentRef.instance.nodeKey = nodeKey;
            this.app.attachView(componentRef.hostView);

            decoratedcomponentRef.push(componentRef);
          }
        }

        this.decoratedcomponentRef.forEach(it => it.destroy());
        this.decoratedcomponentRef = decoratedcomponentRef;
      }
    );

    this.subscriptions.add(unsubscribe);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.unsubscribe();
  }
}
