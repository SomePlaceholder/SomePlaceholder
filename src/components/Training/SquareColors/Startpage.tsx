import React, { ReactElement, useState } from 'react';
import { Button } from 'react-bootstrap';
import { SquareColors } from './SquareColors';

export const SquareColorStart: React.FC = (): ReactElement => {
  const [start, setStart] = useState(false);

  return (
    <div>
      {start ? (
        <SquareColors amount={3} />
      ) : (
        <Button variant="primary" onClick={() => setStart(true)}>
          Start ?
        </Button>
      )}
    </div>
  );
};
