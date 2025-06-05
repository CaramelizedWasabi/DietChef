// src/__mocks__/react-router-dom.js

export const useNavigate = () => jest.fn();

export const Link = ({ children, to, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);
