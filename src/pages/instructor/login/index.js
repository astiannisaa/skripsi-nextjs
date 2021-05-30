import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useInstructor } from "../../../stores/instructor";

export default function Index() {
  const app = useInstructor();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (app.session.data._id === undefined) {
      Router.push("/instructor/login");
    } else {
      Router.push("/instructor/class");
    }
  }, [app.session.data._id]);
  function loginHandler() {
    setError(0);
    setLoading(true);
    app.session
      .login({
        email: email,
        password: password,
      })
      .catch((result) => {
        setError(result);
        setLoading(false);
      });
  }
  return (
    <Container>
      <div
        style={{
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: "translate(-55%, -55%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>PT. Lambda Solusi Informatika</h1>
          <h5>Log in to manage your classes and students</h5>
        </div>
        <hr />
        <Form>
          <Form.Group>
            <Form.Control
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {error === 1 && (
              <Form.Text className="text-danger">
                This email is does not exist on our database
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {error === 2 && (
              <Form.Text className="text-danger">Incorrect password</Form.Text>
            )}
          </Form.Group>
          <Button
            block
            disabled={loading || email === "" || password === ""}
            onClick={() => loginHandler()}
          >
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}
