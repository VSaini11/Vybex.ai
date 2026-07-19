const fs = require('fs');
const Babel = require('@babel/standalone');

const removeImportsPlugin = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        path.remove();
      }
    }
  };
};
Babel.registerPlugin('remove-imports', removeImportsPlugin);

const code = `
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import 'tailwindcss/tailwind.css';
const x = 1;
export default function App() { return <div/>; }
`;

try {
  const transformed = Babel.transform(code, {
    presets: ['typescript', 'react'],
    plugins: ['remove-imports'],
    filename: 'page.tsx'
  }).code;
  console.log(transformed);
} catch (e) {
  console.error(e);
}
