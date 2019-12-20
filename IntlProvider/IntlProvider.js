import * as React from 'react';
import IntlContext from './IntlContext';

const IntlProvider = ({ locale, rtl, children }) => {
  return (
    <IntlContext.Provider value={{ ...locale, rtl }}>
      {children}
    </IntlContext.Provider>
  );
};

export default IntlProvider;
