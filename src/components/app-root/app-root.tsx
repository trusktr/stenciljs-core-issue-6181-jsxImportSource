import {
  Component,
  //
  h,
} from '@stencil/core';
import '../../KitchenSink.js';
import type { KitchenSink } from '../../KitchenSink.js';
import { createEffect } from 'solid-js';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  sink!: KitchenSink;
  sink2!: KitchenSink;

  componentDidLoad() {
    createEffect(() => {
      console.log('values outside the element:', this.sink.count, this.sink.name, this.sink.doingSomething);
    });

    // Event listeners can be set on 'on*' event properties directly, as with builtin events.
    this.sink2.onawesomeness = event => {
      console.log('more awesomeness happened!', event.type);
    };
  }

  render() {
    const res = (
      <div>
        <span>
          <i></i>
        </span>
        {/* Start with an initial value of 5 */}
        <kitchen-sink
          ref={e => (this.sink = e)}
          id="sink"
          count="5"
          name="Mo"
          doingSomething
          onClick={() => {
            this.sink.count++;
            this.sink.name += 'Mo';
            // Get or set attributes (dash-case)
            this.sink.setAttribute(
              'doing-something',
              // Or get or set the same-name properties (camelCase)
              this.sink.doingSomething ? 'false' : 'true',
            );

            console.log('doingSomething after attribute change:', this.sink.doingSomething);
          }}
          onawesomeness={event => {
            // The 'on*' event properties are also available in JSX or `html` templates.
            console.log('awesomeness happened!', event.type);
          }}
        ></kitchen-sink>

        <kitchen-sink ref={e => (this.sink2 = e)} id="sink2" count="1" name="Po" doingSomething="false" color="blue">
          <p>child from light DOM, no slot specified</p>
          <p slot="foo">child from light DOM, slotted to the foo slot</p>
        </kitchen-sink>
      </div>
    );

    console.log(res);
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
