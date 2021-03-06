import Link from "next/link";
import Router from "next/router";
import React, { Fragment } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Container,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import SortArray from "sort-objects-array";
import Administrator from "../../../../../components/administrator";
import Fetch from "../../../../../libraries/fetch";

export async function getServerSideProps(ctx) {
  /* eslint-disable */
  const results = await Fetch(`{
    courseById(_id: "` + ctx.params.course + `") {
      _id
      title
      quiz {
        _id
        order
        title
      }
    }
  }`).then(result => {
    /* eslint-enable */
    const course = {
      _id: result.data.courseById._id,
      title: result.data.courseById.title,
      quiz: result.data.courseById.quiz,
    };
    return {
      course: course,
    };
  });
  return {
    props: {
      course: results.course,
    },
  };
}

export default function Index({ course }) {
  const styles = {
    container: { paddingTop: 12.5, paddingBottom: 12.5 },
    breadcrumb: { marginTop: -1.25 },
  };
  return (
    <Fragment>
      <Administrator />
      <Container style={styles.container}>
        <Breadcrumb>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() => Router.push("/administrator")}
          >
            Administrator
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() => Router.push("/administrator/course")}
          >
            Course
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push("/administrator/course/quiz/" + course._id)
            }
          >
            {course.title}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push("/administrator/course/quiz/" + course._id)
            }
          >
            Quiz
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <b>Quiz List</b>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <Button
                  onClick={() =>
                    Router.push(
                      "/administrator/course/quiz/" + course._id + "/add"
                    )
                  }
                >
                  Add Quiz
                </Button>
              </div>
              <div>
                <FormControl placeholder="Search..." />
              </div>
            </div>
          </Card.Body>
          {course.quiz.length !== 0 && (
            <ListGroup variant="flush">
              {SortArray(course.quiz, "order").map((item) => {
                return (
                  <ListGroup.Item action key={item._id}>
                    <div>
                      <b>{item.order + ". " + item.title}</b>
                    </div>
                    <small>
                      <Link
                        href="/administrator/course/quiz/[course]/edit/[quiz]"
                        as={
                          "/administrator/course/quiz/" +
                          course._id +
                          "/edit/" +
                          item._id
                        }
                      >
                        Click here to edit
                      </Link>
                    </small>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Card>
      </Container>
    </Fragment>
  );
}
