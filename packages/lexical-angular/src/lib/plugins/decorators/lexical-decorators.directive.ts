import {
  Directive,
  OnDestroy,
  OnInit,
  Inject,
  ViewContainerRef,
  Type,
  Injector,
  ApplicationRef,
  ComponentRef,
  createComponent,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {Subscription} from 'rxjs';
import {AngularNode} from '../common/angular-node';
import {NODE_KEY_TOKEN} from '../../lexical.module';

@Directive({selector: '[lexicalDecorators]'})
export class LexicalDecoratorsDirective implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private decoratedcomponentRef: ComponentRef<AngularNode>[] = [];

  constructor(
    private readonly controller: LexicalController,
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

            const injector = Injector.create({
              parent: this.injector,
              providers: [{provide: NODE_KEY_TOKEN, useValue: nodeKey}],
            });

            const environmentInjector = this.app.injector;

            const componentRef = createComponent(angularDecorator, {
              hostElement: element,
              environmentInjector: environmentInjector,
              elementInjector: injector
            });

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
    this.subscriptions.unsubscribe();
  }
}
