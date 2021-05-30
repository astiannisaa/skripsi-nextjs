import Link from "next/link";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useUser } from "../../../stores/user";

export default function Index() {
  const app = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
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
          <h5>Log in to continue learning</h5>
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
        <hr />
        <div style={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/user/register">Register</Link>
        </div>
      </div>
    </Container>
  );
}
