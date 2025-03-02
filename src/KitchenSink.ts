// Example of writing a custom element with Lume Element in the non-decorator format
// (buildless), and adding the JSX type definitions for use in Stencil JSX.

import { Element, element, attribute } from '@lume/element';
import type { StencilElementAttributes } from '@lume/element/dist/stencil.js';
import html from 'solid-js/html';

type KitchenSinkAttributes = 'foo' | 'bar' | 'baz' | 'onwhatever';

export const KitchenSink = element('kitchen-sink')(
  class KitchenSink extends Element {
    static observedAttributeHandlers = {
      foo: attribute.string(),
      bar: attribute.number(),
      baz: attribute.boolean(),
    };
    foo = 'blah';
    bar = 123;
    baz = false;

    static events = ['whatever'];
    onwhatever: EventListener | null = null;

    connectedCallback() {
      super.connectedCallback();
      console.log('<kitch-sink> connected');
      this.dispatchEvent(new Event('whatever'));
    }

    template = () => html`
      <h1>foo: ${() => this.foo}</h1>
      <h2>bar: ${() => this.bar}</h2>
      <h2>baz: ${() => String(this.baz)}</h2>

      <slot></slot>

      <style>
        ${() => `
          :host {
            border: 8px solid #${this.bar};
            padding: 10px;
            display: block;
          }
        `}
      </style>
    `;
  },
);

export type KitchenSink = InstanceType<typeof KitchenSink>;

// Hook up type for use in DOM APIs
declare global {
  interface HTMLElementTagNameMap {
    'kitchen-sink': KitchenSink;
  }
}

// Hook up the type for use in Stencil JSX
declare module '@stencil/core' {
  export namespace JSX {
    interface IntrinsicElements {
      'kitchen-sink': StencilElementAttributes<KitchenSink, KitchenSinkAttributes>;
    }
  }
}
