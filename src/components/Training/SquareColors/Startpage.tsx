import React, { ReactElement, useState } from 'react';
import { Button } from 'react-bootstrap';
import { SquareColors } from './SquareColors';
import { NavbarMod } from '../../layout';
import { Stats } from './Stats';

export const SquareColorStart: React.FC = (): ReactElement => {
  const [start, setStart] = useState(false);
  return (
    <div>
      <NavbarMod />
      {start ? (
        <SquareColors amount={3} />
      ) : (
        <div>
          <Stats />
          <Button variant="primary" onClick={() => setStart(true)}>
            Start ?
          </Button>
        </div>
      )}
    </div>
  );
};
