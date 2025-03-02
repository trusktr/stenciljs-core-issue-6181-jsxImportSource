import {
  Component,
  //
  h,
  Element,
} from '@stencil/core';
import '../../KitchenSink.js';
import type { KitchenSink } from '../../KitchenSink.js';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  sink!: KitchenSink;
  sink2!: KitchenSink;

  @Element() self!: HTMLElement;

  componentDidLoad() {
    // TODO: currently with jsxFactory:h refs work, but with
    // jsxImportSource:stencil the refs are undefined.
    console.assert(this.sink && this.sink2, 'refs should exist');

    // TODO: With jsxFactory:h key attributes are not set onto the DOM, but with
    // jsxImportSource:stencil they current are.
    const sink = this.self.shadowRoot!.querySelector('kitchen-sink');
    console.assert(!sink.getAttribute('key'), 'key attributes should not be set on DOM');
  }

  render() {
    const res = (
      <div>
        <span>
          <i></i>
        </span>

        <kitchen-sink ref={e => (this.sink2 = e)}></kitchen-sink>

        <kitchen-sink
          ref={e => (this.sink = e)}
          foo={'yeah'}
          bar={456}
          baz={true}
          onwhatever={() => {
            console.log('whatever event');
          }}
        >
          <p>slotted content</p>
        </kitchen-sink>
      </div>
    );

    console.log(res);

    // TODO: currently with jsxFactory:h keys are set correctly, but not with
    // jsxImportSource:stencil.
    console.assert((res as any).$key$, 'vnode $key$ should be set');

    return res;
  }
}

const test2 = h(
  'div',
  { id: 'foo' },
  'bar',

  // @ts-expect-error https://github.com/stenciljs/core/issues/6181
  h('img', { src: 'foo.png' }),
  h('span', { id: 'bar' }, h('img', { src: 'bar.png' })),
);

console.log('test2', test2);
