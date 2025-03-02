import { element, Element, attribute } from '@lume/element';
import type { StencilElementAttributes } from '@lume/element/dist/stencil.js';
import { onCleanup } from 'solid-js';
import html from 'solid-js/html';

type KitchenSinkAttributes = 'count' | 'name' | 'color' | 'doingSomething' | 'onawesomeness';

export type KitchenSink = InstanceType<typeof KitchenSink>;

export const KitchenSink = element('kitchen-sink')(
  class extends Element {
    // In a Stencil we use this observedAttributeHandlers instead of Lume
    // Element's field decorators because Stencil's tsconfig use legacy decorators,
    // and Lume Element's decorators are new standard decorators.
    // See other examples like kitchen-sink-react to see the KitchenSink class
    // defined with decorators.
    static observedAttributeHandlers = {
      count: attribute.number(),
      name: attribute.string(),
      color: attribute.string(),
      doingSomething: attribute.boolean(),
    };

    count = 0;
    name = 'Baby Yoda';
    color: 'red' | 'green' | 'blue' = 'red';

    // Defines a reactive property "doingSomething" that corresponds to a
    // same-name but dashed-cased attribute "doing-something".
    doingSomething = false;

    static events = ['awesomeness'];

    onawesomeness: EventListener | null = null;

    connectedCallback() {
      super.connectedCallback();

      // Dispatch an 'awesomeness' event after 1 second.
      setTimeout(() => {
        this.dispatchEvent(new Event('awesomeness'));
      }, 1000);

      this.createEffect(() => {
        // Re-runs any time any of the attributes/properties change.
        console.log('values inside the element: ', this.count, this.name, this.doingSomething);
      });

      this.createEffect(() => {
        const interval = setInterval(() => this.count++, 1000);

        onCleanup(() => clearInterval(interval));
      });

      this.createEffect(() => {
        const timeout = setTimeout(() => {
          this.removeAttribute('count');
          console.log(' ------------------------ JS prop after attribute removed:', this.count);
        }, 5000);

        onCleanup(() => clearTimeout(timeout));
      });
    }

    // We're writing the template with Solid `html` to avoid conflicts with
    // Stencil JSX types and Solid JSX in the same project. Lume Elements support
    // only templates written with Solid JSX (or `html`), not Stencil JSX.
    // Normally, you'd put the element definitions in a separate location
    // compiled with Solid JSX rules (f.e. a separate package), and a Stencil app
    // consuming the element would be using only Stencil JSX and would not to know the
    // element is built with Solid JSX. But, for sake of example, we're keeping
    // things simple, and using `html` here to avoid dealing with Solid JSX
    // types alongside Stencil JSX types in the same project.
    template = () => html`
      <div>
        <h1>Count: ${() => this.count}</h1>
        <h1 style=${() => `color: ${this.color};`}>Name: ${() => this.name}</h1>
        <h1>Doing something? ${() => (this.doingSomething ? 'true' : 'false')}</h1>
        <slot>
          <!-- This is the default location where children of the element
				are slotted to by default if a slot is not specified. -->

          <!-- This is fallback content if there are no default nodes to distribute. -->
          <p>default slot's default content</p>
        </slot>
        <hr />
        <slot name="foo">
          <!-- This is a named slot where children of this element are
				slotted to if those children have a slot="foo" attribute
				specifying the slot to slotted to. -->

          <!-- This is fallback content if there are no nodes to distribute to this particular slot. -->
          <p>"foo" slot's default content</p>
        </slot>
      </div>
    `;

    /**
     * Static styles get instantiated once per DOM root (Document or ShadowRoot)
     * for all instances of the element. Interpoalting instance variables here
     * won't work, but this is more performant than the css instance property.
     */
    static css = /*css*/ `
      :host {
        margin: 20px;
      }

      div {
        border: 3px solid deeppink;
      }
    `;

    bgColor = 'skyblue';

    /**
     * This style is on the instances, instantiated once per instance and
     * instance properties can be interpolated for unique styles per instance,
     * but is less performant than the css property.
     */
    css = /*css*/ `
      div {
        border-radius: 10px;
        background: ${this.bgColor};
        padding: 10px 20px;
      }
    `;
  },
);

// Hook up type for use in DOM APIs
declare global {
  interface HTMLElementTagNameMap {
    'kitchen-sink': InstanceType<typeof KitchenSink>;
  }
}

// Hook up the type for use in Stencil JSX
declare module '@stencil/core' {
  export namespace JSX {
    interface IntrinsicElements {
      'kitchen-sink': StencilElementAttributes<InstanceType<typeof KitchenSink>, KitchenSinkAttributes>;
    }
  }
}
