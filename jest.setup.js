require("@testing-library/jest-dom");

const { TextDecoder, TextEncoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("next/font/google", () => {
  const createFont = () => () => ({
    className: "",
    style: {},
    variable: "",
  });

  return new Proxy(
    {},
    {
      get: () => createFont,
    },
  );
});

jest.mock("next/image", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: ({ alt, ...props }) =>
      React.createElement("img", { alt, ...props }),
  };
});
