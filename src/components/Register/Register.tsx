import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as ROUTES from '../../constants/routes';
import styles from './Register.module.css';
import { createUser, useAuth } from '../Firebase';
import { NavbarMod } from '../layout';

const schema = yup.object().shape({
  Username: yup
    .string()
    .required()
    .min(2, 'Username has to be at minimum 2 Characters long')
    .max(8, 'Username can be at most 8 characters long')
    .required("Username can't be empty"),
  terms: yup.bool().isTrue('You have to accept the terms'),
});

function RegisterForm() {
  const history = useHistory();
  return (
    <Formik
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={async (values, actions) => {
        await createUser(values.Username)
          .then((result) => {
            actions.resetForm();
            actions.setSubmitting(false);
            result.user?.updateProfile({
              displayName: values.Username,
            });
            history.push(ROUTES.HOME);
          })
          .catch((error) => {
            actions.resetForm();
            actions.setFieldError('Username', error.code);
            actions.setSubmitting(false);
          });
      }}
      initialValues={{
        Username: '',
        terms: false,
      }}
    >
      {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="Username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              name="Username"
              placeholder="Enter your Username"
              value={values.Username}
              isInvalid={!!errors.Username}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.Username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Check
              required
              type="checkbox"
              name="terms"
              checked={values.terms}
              label="Ich spiele keine Ehrenlosen"
              onChange={handleChange}
              isInvalid={!!errors.terms}
              feedback={errors.terms}
            />
          </Form.Group>
          <Button className="w-100" type="submit" disabled={isSubmitting}>
            Sign Up
          </Button>
        </Form>
      )}
    </Formik>
  );
}

const RegisterPage = () => {
  return (
    <div className={styles.Container}>
      <NavbarMod />
      <Card bg="Light" text="dark" className={styles.CardContainer}>
        <Card.Body>
          <h2 className={styles.CardText}>Sign Up</h2>
          <RegisterForm />
        </Card.Body>
        <div className={styles.CardText}>
          Already have an Account? <Link to={ROUTES.LOG_IN}>Log In</Link>
        </div>
      </Card>
    </div>
  );
};

export const Register = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Redirect to={ROUTES.HOME} /> : <RegisterPage />;
};
