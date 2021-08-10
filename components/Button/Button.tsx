import * as React from 'react';

import * as S from './button.styles';

interface IButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode;
}

function Button({ children, ...props }: IButtonProps): JSX.Element {
  return <S.Button {...props}>{children}</S.Button>;
}

export default Button;
