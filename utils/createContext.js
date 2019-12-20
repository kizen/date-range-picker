import * as React from 'react';

export default function createContext(defaultValue) {
  const context = {
    Provider: React.Fragment,
    Consumer: React.Fragment
  };

  const ReactContext = React.createContext
    ? React.createContext(defaultValue)
    : context;

  return ReactContext;
}
