import Dynamic from "next/dynamic";
import Router from "next/router";
import React, { Fragment, useState } from "react";
import { Breadcrumb, Button, Card, Container, Form } from "react-bootstrap";
import { encode, decode } from "universal-base64";
import Administrator from "../../../../../../../../../components/administrator";
import Fetch from "../../../../../../../../../libraries/fetch";
import { useAdministrator } from "../../../../../../../../../stores/administrator";

const QuillClientSide = Dynamic(import("react-quill"), {
  ssr: false,
});
const quillmodules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "super" }, { script: "sub" }],
    [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["direction", { align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

export async function getServerSideProps(ctx) {
  /* eslint-disable */
  const results = await Fetch(`{
    courseById(_id: "` + ctx.params.course + `") {
      _id
      title
    }
    babById(_id:"` + ctx.params.bab + `") {
      _id
      name
    }
    materiById(_id:"` + ctx.params.materi + `") {
      _id
      name
      content
      order
    }
  }`).then(result => {
    /* eslint-enable */
    const course = {
      _id: result.data.courseById._id,
      title: result.data.courseById.title,
    };
    const bab = {
      _id: result.data.babById._id,
      name: result.data.babById.name,
    };
    const materi = {
      _id: result.data.materiById._id,
      name: result.data.materiById.name,
      content: decode(result.data.materiById.content),
      order: result.data.materiById.order,
    };
    return {
      course: course,
      bab: bab,
      materi: materi,
    };
  });
  return {
    props: {
      course: results.course,
      bab: results.bab,
      materi: results.materi,
    },
  };
}

export default function Index({ course, bab, materi }) {
  const styles = {
    container: { paddingTop: 12.5, paddingBottom: 12.5 },
    breadcrumb: { marginTop: -1.25 },
  };
  const app = useAdministrator();
  const [order, setOrder] = useState(materi.order);
  const [name, setName] = useState(materi.name);
  const [content, setContent] = useState(materi.content);
  const [loading, setLoading] = useState(false);
  function saveHandler() {
    setLoading(true);
    app.materi
      .update({
        _id: materi._id,
        name: name,
        order: order,
        content: encode(content),
      })
      .then(() => {
        Router.push(
          "/administrator/course/module/" + course._id + "/materi/" + bab._id
        );
      });
  }
  function deleteHandler() {
    setLoading(true);
    app.materi.delete(materi._id).then(() => {
      Router.push(
        "/administrator/course/module/" + course._id + "/materi/" + bab._id
      );
    });
  }
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
              Router.push("/administrator/course/module/" + course._id)
            }
          >
            {course.title}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push("/administrator/course/module/" + course._id)
            }
          >
            Module
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push(
                "/administrator/course/module/" +
                  course._id +
                  "/materi/" +
                  bab._id
              )
            }
          >
            {bab.name}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push(
                "/administrator/course/module/" +
                  course._id +
                  "/materi/" +
                  bab._id
              )
            }
          >
            Materi
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push(
                "/administrator/course/module/" +
                  course._id +
                  "/materi/" +
                  bab._id +
                  "/add"
              )
            }
          >
            Add
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <b>Add Materi</b>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Order</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  disabled={loading}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={name}
                  disabled={loading}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. What Is PT. Lambda Solusi Informatika?"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Content</Form.Label>
                <QuillClientSide
                  theme="snow"
                  modules={quillmodules}
                  value={content}
                  onChange={setContent}
                  placeholder="Write your content here..."
                  readOnly={loading}
                />
              </Form.Group>
              <hr />
              <Button
                disabled={loading || name === "" || content === ""}
                onClick={() => saveHandler()}
                style={{ marginRight: 10 }}
              >
                Save Changes
              </Button>
              <Button
                variant="danger"
                disabled={loading}
                onClick={() => deleteHandler()}
              >
                Delete Materi
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
}
