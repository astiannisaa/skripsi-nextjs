import Link from "next/link";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useUser } from "../../../stores/user";

export default function Index() {
  const app = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
  function registerHandler() {
    setError(0);
    setLoading(true);
    app.session
      .register({
        name: name,
        email: email,
        phonenumber: phoneNumber,
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
          <h5>Register to start learning</h5>
        </div>
        <hr />
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
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
                This email is already used
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="number"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          <Button
            block
            disabled={
              loading ||
              name === "" ||
              email === "" ||
              phoneNumber === "" ||
              password === ""
            }
            onClick={() => registerHandler()}
          >
            Register
          </Button>
        </Form>
        <hr />
        <div style={{ textAlign: "center" }}>
          Already have an account? <Link href="/user/login">Login</Link>
        </div>
      </div>
    </Container>
  );
}
