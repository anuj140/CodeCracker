export const snippets = [
  {
    word: "usestate",
    code: `import { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Count: {count}\n    </button>\n  );\n}`,
    explanation: "This React hook manages state in functional components.",
    language: "jsx",
  },
  {
    word: "function",
    code: `function greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("Alice"); // Output: Hello, Alice!`,
    explanation:
      "A basic JavaScript function that takes a parameter and logs a greeting.",
    language: "javascript",
  },
  {
    word: "loop",
    code: `for (let i = 0; i < 5; i++) {\n  console.log("Iteration: " + i);\n}`,
    explanation:
      "A simple for loop that iterates 5 times and logs the iteration number.",
    language: "javascript",
  },
];
