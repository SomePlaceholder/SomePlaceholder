import React, { ReactElement, useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { SquareColors } from './SquareColors';
import { NavbarMod } from '../../layout';
import { Stats } from './Stats';

import {
  useAuth,
  SquareColorFromDataSettingsRef,
  transformSquareColorFromDataSettings,
} from '../../Firebase';

import { randomSquareSettings } from './randomSquare';

import styles from './SquareColors.module.css';

export const SquareColorStart: React.FC = (): ReactElement => {
  const [start, setStart] = useState(false);
  const [amount, setAmount] = useState(3);
  const [settings, setSettings] = useState<randomSquareSettings | undefined>(
    undefined,
  );

  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser) {
      const settingsRef = SquareColorFromDataSettingsRef(currentUser.uid);
      const settingsSnapshotFunction = async () => {
        const settingsSnapshot = await settingsRef.once('value');
        setSettings({
          userId: currentUser.uid,
          settings: transformSquareColorFromDataSettings(settingsSnapshot),
        });
      };

      settingsSnapshotFunction();
    }
  }, [currentUser]);

  const settingsCallback = (
    amountNum: number,
    settingsData?: randomSquareSettings,
  ) => {
    setSettings(settingsData);
    setAmount(amountNum);
    setStart(true);
  };

  return (
    <div>
      <NavbarMod />
      {start ? (
        <SquareColors settings={settings} amount={amount} />
      ) : (
        <StartPage settings={settings} callback={settingsCallback} />
      )}
    </div>
  );
};

interface StartPageProps {
  // eslint-disable-next-line no-unused-vars
  callback: (amountNum: number, settings?: randomSquareSettings) => void;
  settings?: randomSquareSettings;
}

const StartPage: React.FC<StartPageProps> = (props): ReactElement => {
  const { callback, settings } = props;
  const [showSettings, setShowSettings] = useState(false);

  const schema = yup.object().shape({
    amount: yup
      .number()
      .required()
      .min(1, 'Minimum 1 Square')
      .max(100, 'Max of 100 Squares')
      .required('Have to specify an amount of squares'),
    numGames: yup
      .number()
      .required()
      .min(1, 'Minimum has to be 1')
      .max(90, 'Maximum of 90 allowed')
      .required('Number of Games has to be specified'),

    targetTime: yup
      .number()
      .required()
      .min(0, 'Minimum of 0 Seconds')
      .required('Time has to be specified'),

    mistakesWeight: yup
      .number()
      .required()
      .min(0, 'Minimum of 0 Weight')
      .max(999, 'Use a smaller Number')
      .required('Weight has to be specified'),

    timeWeight: yup
      .number()
      .required()
      .min(0, 'Minimum of 0 Weight')
      .max(999, 'Use a smaller Number')
      .required('Weight has to be specified'),
  });

  return (
    <div className={styles.StartPage}>
      <Stats />
      <Button
        variant="primary"
        onClick={() => {
          setShowSettings(!showSettings);
        }}
      >
        Settings
      </Button>
      <Formik
        enableReinitialize
        validationSchema={schema}
        validateOnChange={false}
        onSubmit={(values, actions) => {
          const valueAm = values.amount ? values.amount : 2;
          if (settings) {
            const settingsRef = SquareColorFromDataSettingsRef(settings.userId);
            settingsRef.update(values).then(() => {
              actions.resetForm();
              actions.setSubmitting(false);
              callback(valueAm, {
                userId: settings.userId,
                settings: values,
              });
            });
          } else {
            callback(valueAm);
          }
        }}
        initialValues={
          settings
            ? {
                amount: settings.settings.amount,
                numGames: settings.settings.numGames,
                targetTime: settings.settings.targetTime,
                mistakesWeight: settings.settings.mistakesWeight,
                timeWeight: settings.settings.timeWeight,
              }
            : {
                amount: 50,
              }
        }
      >
        {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            {showSettings ? (
              <>
                <Form.Group controlId="amount">
                  <Form.Label>Amount of Squares</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="amount"
                    placeholder="Amount of Squares"
                    value={values.amount}
                    isInvalid={!!errors.amount}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>
                {settings ? (
                  <>
                    <Form.Group controlId="numGames">
                      <Form.Label>
                        Number of previous Runs to be included
                      </Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="numGames"
                        placeholder="Num of prev. Runs"
                        value={values.numGames}
                        isInvalid={!!errors.numGames}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.numGames}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="targetTime">
                      <Form.Label>Time to be picked</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="targetTime"
                        placeholder="Target Time"
                        value={values.targetTime}
                        isInvalid={!!errors.targetTime}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.targetTime}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="mistakesWeight">
                      <Form.Label>Weight of Mistakes</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="mistakesWeight"
                        placeholder="Weight of Mistakes"
                        value={values.mistakesWeight}
                        isInvalid={!!errors.mistakesWeight}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mistakesWeight}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="timeWeight">
                      <Form.Label>Weight of Time</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="timeWeight"
                        placeholder="Weight of Time"
                        value={values.timeWeight}
                        isInvalid={!!errors.timeWeight}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.timeWeight}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                ) : null}
              </>
            ) : null}
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              Start ?
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
