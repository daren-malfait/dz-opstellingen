import tw, { css, styled } from 'twin.macro';

export const ButtonStyles = css`
  --color: #2376fc;

  ${tw`
  inline-block
  relative
  padding[.5rem 1.25rem]
  background-color[var(--color)]
  border[1px solid]
  text-white
  border-color[var(--color)]
  rounded-lg
  cursor-pointer
  `};

  &.inverted {
    ${tw`
    bg-white
    border-color[var(--color)]
    color[var(--color)]
    `}
  }
`;

export const Button = styled.button`
  ${ButtonStyles}
`;
