---
title: We rewrote our Rust WASM parser in TypeScript and it got faster
date: 2026-03-21T05:45:50.277Z
description: Blog about We rewrote our Rust WASM parser in TypeScript and it got faster
---

# Why We Rewrote Our Rust WASM Parser in TypeScript—and It Got Faster

The prevailing narrative in modern web development is clear: if you want performance, you move your compute-heavy logic to Rust and compile it to WebAssembly (WASM). For years, we followed this mantra religiously. Rust is memory-safe, predictably fast, and its ecosystem for WASM is second to none.

However, a few months ago, we did the unthinkable. We took our core parsing engine—originally written in Rust for its perceived speed—and rewrote the entire thing in pure TypeScript. 

The result? A 30% reduction in total execution time and a significantly smaller bundle size.

This wasn't because Rust is slow—far from it. It was because the cost of the bridge between the JavaScript engine and the WASM runtime was higher than the speed gains the Rust code provided. This post explores the "WASM boundary tax," why V8’s JIT (Just-In-Time) compiler is more capable than we often give it credit for, and when you should actually stick to TypeScript.

---

## The Illusion of the Silver Bullet

When developers think of WebAssembly, they often think of it as a "turbocharger" for the browser. The logic goes like this: JavaScript is high-level and garbage-collected; Rust is low-level and compiled to machine-like instructions; therefore, Rust-in-WASM must be faster.

In isolation, this is true. If you are calculating Fibonacci numbers or running a physics simulation that stays entirely within the WASM memory space, Rust will beat TypeScript every single time. 

However, real-world web applications are rarely isolated computational silos. They are interactive systems where data constantly flows between the user interface (JavaScript/DOM) and the processing engine (WASM). 

Our parser was responsible for taking large streams of telemetry data (JSON and custom binary formats) and turning them into rich JavaScript objects for visualization. This meant we were constantly moving data back and forth across the "FFI (Foreign Function Interface) Boundary." We soon discovered that the overhead of this boundary was cannibalizing our performance gains.

---

## The Hidden Cost: The "Boundary Tax"

The primary reason our Rust implementation struggled wasn't the execution of the code itself, but the data Marshalling. 

WebAssembly operates on a linear memory model—essentially a giant array of raw bytes. JavaScript, on the other hand, operates on high-level objects, strings, and garbage-collected references. To move a string from JavaScript into Rust, you cannot simply pass a pointer. You have to:

1.  **Encode** the JavaScript string into UTF-8 bytes.
2.  **Allocate** space within the WASM linear memory.
3.  **Copy** those bytes into the allocated space.
4.  **Process** the data in Rust.
5.  **Decode** the results back into JavaScript objects.

If your parser is designed to handle thousands of small tokens or frequently interacts with JavaScript strings, you end up spending more time in `TextEncoder.encode()` and `TextDecoder.decode()` than you do actually parsing the data. 

In our case, the parser was extremely "chatty." It was making thousands of small calls across the boundary per second. Each call carried a micro-latency that, when aggregated, created a massive bottleneck that no amount of Rust optimization could overcome.

---

## The Power of V8’s JIT and Monomorphism

While we were struggling with WASM boundaries, we began profiling what a highly optimized TypeScript version would look like. We discovered that modern engines like V8 (Chrome/Edge/Node.js) and SpiderMonkey (Firefox) are incredibly good at optimizing JavaScript that "looks like" C code.

When you write TypeScript that avoids dynamic shape changes and keeps objects consistent, the JIT compiler generates machine code that is surprisingly competitive with compiled languages. This is achieved through:

*   **Hidden Classes:** If you always create objects with the same properties in the same order, V8 treats them as having a fixed "class," allowing for optimized property access.
*   **Inline Caching:** The engine remembers where properties are located in memory, skipping the expensive hash-map lookup usually associated with JS objects.
*   **Speculative Optimization:** The JIT observes your code. If it sees that a function is always called with integers, it compiles a version of that function specifically for integers.

By rewriting our parser to use typed arrays (`Uint8Array`) and avoiding object allocation in the hot loop, we allowed the JIT to produce extremely efficient machine code that resided in the same memory space as the rest of our application.

### Example: Optimized Hot-Path Scanning

The following code illustrates the pattern we used to ensure the JIT compiler could optimize our TypeScript parser. Note the use of integer-based indexing and the avoidance of string slicing inside the loop.

```javascript
/**
 * A simplified example of a high-performance scanner in TypeScript.
 * By keeping the logic monomorphic and avoiding allocations, 
 * we stay in the JIT's "fast path."
 */
class ParserState {
    constructor(
        public buffer: Uint8Array,
        public pos: number = 0,
        public length: number = buffer.length
    ) {}

    // Using numeric codes instead of string comparisons avoids
    // constant UTF-8 decoding overhead.
    scanUntil(targetByte) {
        const { buffer, length } = this;
        let i = this.pos;

        while (i < length) {
            if (buffer[i] === targetByte) {
                const foundPos = i;
                this.pos = i + 1;
                return foundPos;
            }
            i++;
        }
        this.pos = length;
        return -1;
    }
}
```

By staying within a single language, we eliminated the encoding/decoding step entirely. The `Uint8Array` was already in the JavaScript heap, and the logic was simple enough for V8 to inline.

---

## Real-World Use Cases: When to Choose Which

Our experience taught us that the choice between TypeScript and Rust/WASM isn't about which language is "faster" in a vacuum, but where the data lives.

### When to Use TypeScript
*   **DOM-Heavy Logic:** If you are manipulating the DOM or responding to frequent UI events.
*   **Small, Frequent Tasks:** Parsers that handle many small strings or objects where the overhead of WASM initialization and data copying exceeds the compute time.
*   **JSON-Adjacent Workflows:** If your data is already coming in as JSON, sticking with JS is often faster due to the highly optimized native `JSON.parse()`.

### When to Use Rust/WASM
*   **Computationally Intensive Tasks:** Video encoding, image processing, or heavy mathematical simulations (e.g., cryptography).
*   **Long-Running Processes:** Tasks that run for several seconds without needing to send data back to the JavaScript main thread.
*   **Existing Libraries:** When you need to leverage a mature C++ or Rust ecosystem (e.g., FFmpeg, SQLite, or specialized physics engines).

---

## Best Practices for High-Performance TypeScript

If you decide to stick with TypeScript for performance-critical code, follow these "mechanical sympathy" rules to help the JIT compiler:

1.  **Avoid Object Allocations in Hot Loops:** Re-use objects or use typed arrays. Garbage collection pauses are the enemy of performance.
2.  **Stay Monomorphic:** Ensure your functions are always called with the same "shape" of objects. Don't pass an object with `{x, y}` to a function and then later pass `{x, y, z}`.
3.  **Use Typed Arrays for Binary Data:** `Uint8Array` and `DataView` allow you to manipulate memory directly, similar to how you would in Rust, but without the boundary tax.
4.  **Avoid "Delete":** Using the `delete` keyword on an object changes its hidden class and can drop it into "dictionary mode," which is significantly slower.
5.  **Profile with Real Data:** Always use Chrome DevTools or `node --inspect` to find where the actual bottlenecks are before reaching for WASM.

---

## Conclusion: Tooling Should Fit the Task

Moving our parser back to TypeScript felt like an admission of failure at first. We had spent weeks perfecting our Rust logic, only to find it underperforming. But the engineering reality is that **latency is not just execution speed; it is the sum of execution, communication, and memory management.**

In the web ecosystem, JavaScript is the "home team." It has an unfair advantage: it lives inside the engine, shares memory with the UI, and is managed by a JIT compiler that has seen billions of dollars in R&D investment. 

As we look toward the future, features like **WASM-GC** (WebAssembly Garbage Collection) and **Interface Types** may eventually lower the boundary tax, making Rust-to-WASM interop much cheaper. But for today, if your application involves high-frequency data exchange between the logic and the UI, don't sleep on TypeScript. 

Sometimes, the fastest code is the code that doesn't have to leave the room.
