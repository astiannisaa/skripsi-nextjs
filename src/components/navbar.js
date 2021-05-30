import Link from "next/link";
import Router from "next/router";
import React, { Fragment } from "react";
import { Button, Container, Dropdown, Navbar } from "react-bootstrap";
import { useUser } from "../stores/user";

export default function Index() {
  const app = useUser();
  return (
    <Fragment>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Link href="/">
            <Navbar.Brand>PT. Lambda Solusi Informatika</Navbar.Brand>
          </Link>
          {app.session.data._id === undefined ? (
            <Link href="/user/login">
              <Button variant="outline-light">Log In</Button>
            </Link>
          ) : (
            <Dropdown>
              <Dropdown.Toggle variant="outline-light">
                {app.session.data.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => Router.push("/user/learn/class")}>
                  Learn
                </Dropdown.Item>
                <Dropdown.Item onClick={() => Router.push("/user/profile")}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => app.session.logout()}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Container>
      </Navbar>
    </Fragment>
  );
}
