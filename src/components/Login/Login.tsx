import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as ROUTES from '../../constants/routes';
import styles from './Login.module.css';
import { signInWithUsername, useAuth } from '../Firebase';
import { NavbarMod } from '../layout';

const schema = yup.object().shape({
  Username: yup
    .string()
    .required()
    .min(2, 'Username has to be at minimum 2 Characters long')
    .max(8, 'Username can be at most 8 characters long')
    .required("Username can't be empty"),
});

function LoginForm() {
  const history = useHistory();
  return (
    <Formik
      validationSchema={schema}
      validateOnChange={false}
      onSubmit={(values, actions) => {
        signInWithUsername(values.Username)
          .then(() => {
            actions.resetForm();
            actions.setSubmitting(false);
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
          <Button className="w-100" type="submit" disabled={isSubmitting}>
            Log In
          </Button>
        </Form>
      )}
    </Formik>
  );
}

const LoginPage = () => {
  return (
    <div className={styles.Container}>
      <NavbarMod />
      <Card bg="dark" text="light" className={styles.CardContainer}>
        <Card.Body>
          <h2 className={styles.CardText}>Log In</h2>
          <LoginForm />
        </Card.Body>
        <div className={styles.CardText}>
          Dont have an Account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
        </div>
      </Card>
    </div>
  );
};

export const Login = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Redirect to={ROUTES.HOME} /> : <LoginPage />;
};
