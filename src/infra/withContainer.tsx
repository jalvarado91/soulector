import React from "react";

export const withContainer = <P extends object>(
  Component: React.FunctionComponent<P>,
  Container: React.FunctionComponent<any>
): React.FC<P> => (props: P) => {
  return (
    <Container>
      <Component {...props} />
    </Container>
  );
};