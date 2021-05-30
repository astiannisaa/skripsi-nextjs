import Dynamic from "next/dynamic";
import Router from "next/router";
import React, { Fragment, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { decode, encode } from "universal-base64";
import Administrator from "../../../../../components/administrator";
import Fetch from "../../../../../libraries/fetch";
import { useAdministrator } from "../../../../../stores/administrator";

export async function getServerSideProps(ctx) {
  /* eslint-disable */
  const results = await Fetch(`{
    contentById(_id:"` + ctx.params.content + `") {
      _id
      order
      title
      content
    }
  }`).then(result => {
    /* eslint-enable */
    const content = {
      _id: result.data.contentById._id,
      order: result.data.contentById.order,
      title: result.data.contentById.title,
      content: decode(result.data.contentById.content),
    };
    return {
      content: content,
    };
  });
  return {
    props: {
      data: results.content,
    },
  };
}

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

export default function Index({ data }) {
  const styles = {
    container: { paddingTop: 12.5, paddingBottom: 12.5 },
    breadcrumb: { marginTop: -1.25 },
  };
  const app = useAdministrator();
  const [order, setOrder] = useState(data.order);
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  const [loading, setLoading] = useState(false);
  function saveHandler() {
    setLoading(true);
    app.content.update({
      _id: data._id,
      order: order,
      title: title,
      content: encode(content),
    });
  }
  function deleteHandler() {
    setLoading(true);
    app.content.delete(data._id);
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
            onClick={() => Router.push("/administrator/content")}
          >
            Content
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push("/administrator/content/edit/" + data._id)
            }
          >
            {data.title}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            style={styles.breadcrumb}
            onClick={() =>
              Router.push("/administrator/content/edit/" + data._id)
            }
          >
            Edit
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Card.Header>
            <b>Edit Content</b>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col xs={2}>
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
                </Col>
                <Col xs={10}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      value={title}
                      disabled={loading}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. What Is PT. Lambda Solusi Informatika?"
                    />
                  </Form.Group>
                </Col>
              </Row>
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
                disabled={loading || title === "" || content === ""}
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
                Delete Content
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
}
