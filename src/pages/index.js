import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";
import { Container, Button, Row, Col, Carousel, Card } from "react-bootstrap";
import { Compass, Key } from "react-feather";
import ReactHtmlParser from "react-html-parser";
import YouTube from "react-youtube";
import SortArray from "sort-objects-array";
import { decode } from "universal-base64";
import Navbar from "../components/navbar";
import Fetch from "../libraries/fetch";

export async function getServerSideProps() {
  /* eslint-disable */
  const results = await Fetch(`{
    allCourse {
      _id
      type
      title
      learningpath {
        _id
      }
      keyfeature {
        _id
      }
    }
    allContent {
      _id
      order
      title
      content
    }
  }`).then(result => {
    /* eslint-enable */
    const postgraduate = [];
    const master = [];
    const content = [];
    result.data.allCourse.forEach((item) => {
      if (item.type === "postgraduate") postgraduate.push(item);
      if (item.type === "master") master.push(item);
    });
    result.data.allContent.forEach((item) => {
      content.push({
        _id: item._id,
        order: item.order,
        title: item.title,
        content: decode(item.content),
      });
    });
    return {
      postgraduate: postgraduate,
      master: master,
      content: content,
    };
  });
  return {
    props: {
      postgraduate: results.postgraduate,
      master: results.master,
      content: results.content,
    },
  };
}

function Component({ children, gray }) {
  const styles = {
    true: {
      paddingTop: 25,
      paddingBottom: 35,
      backgroundColor: "#F9F9F9",
    },
    false: {
      paddingTop: 20,
      paddingBottom: 35,
    },
  };
  return <div style={gray ? styles.true : styles.false}>{children}</div>;
}

function Home() {
  const styles = {
    image: {
      height: 400,
      width: "100%",
      objectFit: "cover",
      position: "absolute",
      filter: "brightness(0.5)",
    },
    left: {
      position: "relative",
      paddingTop: 120,
      paddingBottom: 120,
    },
    right: {
      position: "relative",
      paddingTop: 60,
    },
    text: {
      color: "white",
    },
    partnership: {
      width: "100%",
      paddingTop: 60,
      paddingBottom: 20,
    },
  };
  return (
    <Fragment>
      <img src="./home.jpg" style={styles.image} />
      <Container>
        <div className="d-flex justify-content-between">
          <div style={styles.left}>
            <h1 style={styles.text}>World’s #1 Online Bootcamp</h1>
            <h6 style={styles.text}>1,000,000 careers advanced</h6>
            <h6 style={styles.text}>1,000 live classes every month</h6>
            <h6 style={styles.text}>
              85% report career benefits including promotion or a new job
            </h6>
            <div style={{ marginTop: 12.5, marginBottom: 12.5 }} />
            {/*<Row>
              <Col xs={5}>
                <Button>All Courses</Button>
              </Col>
            </Row>*/}
          </div>
          <div style={styles.right}>
            <YouTube
              videoId="rqJl427Sr-4"
              opts={{
                width: "500",
                height: "281",
              }}
            />
          </div>
        </div>
      {/* <img src="./partnership.png" style={styles.partnership} /> */}
      </Container>
    </Fragment>
  );
}

function Course({ course, title, description }) {
  const styles = {
    carousel: {
      marginTop: 17.5,
    },
    icon: {
      marginTop: -2.5,
      marginRight: 5,
    },
  };
  const iconsize = 17.5;
  const [data, setData] = useState([]);
  useEffect(() => {
    async function splitData() {
      const temp = [];
      for (let index = 0; index < Math.ceil(course.length / 3); index++) {
        const count = index * 3;
        const splitter = [];
        if (course[count] !== undefined) {
          splitter.push(course[count]);
        }
        if (course[count + 1] !== undefined) {
          splitter.push(course[count + 1]);
        }
        if (course[count + 2] !== undefined) {
          splitter.push(course[count + 2]);
        }
        temp.push(splitter);
      }
      setData(temp);
    }
    splitData();
  }, [course]);
  return (
    <Fragment>
      <h4>{title}</h4>
      <h6>{description}</h6>
      <Carousel style={styles.carousel} controls={false} indicators={false}>
        {data.map((parent, index) => {
          return (
            <Carousel.Item key={index}>
              <Row>
                {parent.map((child) => {
                  return (
                    <Col xs={4} key={child._id}>
                      <Card>
                        <Card.Body>
                          <h5>{child.title}</h5>
                          <hr />
                          <h6>
                            <Compass size={iconsize} style={styles.icon} />
                            {child.learningpath.length} Learning Path
                          </h6>
                          <h6>
                            <Key size={iconsize} style={styles.icon} />
                            {child.keyfeature.length} Key Feature
                          </h6>
                          <small>
                            <Link
                              href="/learnmore/[course]"
                              as={"/learnmore/" + child._id}
                            >
                              <a>Click here to learn more</a>
                            </Link>
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Fragment>
  );
}

function ContentParser({ title, content }) {
  return (
    <Container style={{ textAlign: "justify" }}>
      <h2 style={{ marginBottom: 15 }}>{title}</h2>
      <div style={{ marginBottom: -20 }}>{ReactHtmlParser(content)}</div>
    </Container>
  );
}

function Footer() {
  const styles = {
    container: {
      paddingTop: 20,
      paddingBottom: 20,
      backgroundColor: "#292B2C",
    },
    text: {
      color: "darkgray",
      textAlign: "center",
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.text}>
        <Link href="/administrator">Administrator</Link>
        {" / "}
        <Link href="/instructor/login">Instructor</Link>
      </div>
      <small className="text-muted">
        <div style={styles.text}>
          © 2020-2020 - ISEA School. All Rights Reserved. The certification
          names are the trademarks of their respective owners.
        </div>
      </small>
    </div>
  );
}

export default function Index({ postgraduate, master, content }) {
  return (
    <Fragment>
      <Navbar />
      <Home />
      <Component gray={true}>
      <Container style={{ marginTop: 40 }}>
          <h2>Get Certified, Get Ahead with Our Programs</h2>
          <hr />
          <Course
            course={postgraduate}
            title={postgraduate.length + " Post Graduate Programs"}
            description="Learn from global experts and get certified by the world's leading universities"
          />
          <hr style={{ marginTop: 20 }} />
          <Course
            course={master}
            title={master.length + " Master's Programs"}
            description="Achieve your career goals with industry-recognized learning paths"
          />
        </Container>
      </Component>
      {SortArray(content, "order").map((item, index) => {
        return (
          <Component gray={!!(index % 2)} key={item._id}>
            <ContentParser title={item.title} content={item.content} />
          </Component>
        );
      })}
      <Footer />
    </Fragment>
  );
}
