import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { Link } from "react-router-dom";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

const AssignData = () => {
  const [files, setFiles] = useState([]);

  const dummyData = [
    {
      id: 1,
      givenDate: "2023/07/07",
      data: 2245,
    },
    {
      id: 2,
      givenDate: "2024/04/17",
      data: 132,
    },
    {
      id: 3,
      givenDate: "2023/11/09",
      data: 53,
    },
  ];

  document.title = "Talktime Upload";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Talktime Upload" pageTitle="Uploads" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Upload Data</h4>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col>
                      <div className="mb-2">
                        <Label className="form-label">Choose File</Label>
                        <FilePond
                          files={files}
                          onupdatefiles={setFiles}
                          maxFiles={1}
                          name="files"
                          className="filepond"
                        />
                      </div>
                      <div
                        className="d-flex justify-content-end"
                        style={{ gap: "5px" }}
                      >
                        <button className="btn btn-primary ">
                          {" "}
                          <i
                            className="ri-file-upload-line"
                            style={{ marginRight: "5px" }}
                          ></i>
                          Upload
                        </button>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Information</h4>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col>
                      <div className="table-responsive table-card mt-3 mb-1">
                        <table className="table align-middle table-nowrap">
                          <thead className="table-light">
                            <tr>
                              <th className="sort" data-sort="id">
                                Id
                              </th>
                              <th className="sort" data-sort="given_date">
                                Date
                              </th>
                              <th className="sort" data-sort="customer_name">
                                Data
                              </th>
                            </tr>
                          </thead>
                          <tbody className="list form-check-all">
                            {dummyData?.map((data) => (
                              <tr key={data.id}>
                                <td className="id">{data.id}</td>
                                <td className="given_date">{data.givenDate}</td>
                                <td className="data">{data.data}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AssignData;
