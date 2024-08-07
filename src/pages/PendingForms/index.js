import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { useDispatch, useSelector } from "react-redux";
import { updateFormStatus } from "../../helpers/fakebackend_helper";
import {
  getPendingForms,
  pendingFormsFilter,
} from "../../slices/PendingForms/thunk";
import FormRow from "./FormRow";

const PendingForms = () => {
  const [activeTab, setactiveTab] = useState("1");

  const [dateRange, setDateRange] = useState(null);

  const {
    pendingForms,
    updatedForms,
    filteredPendingForms,
    filteredUpdatedForms,
  } = useSelector((state) => state.PendingForms);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPendingForms());
  }, [dispatch]);

  function updateCreditCardForm(formId, applicationNo, formStatus, formType) {
    updateFormStatus({ formId, applicationNo, formStatus, formType }).then(
      (res) => {
        dispatch(getPendingForms());
        toast.success("Status updated !", {
          position: "bottom-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    );
  }

  function handleFilterByDate() {
    dispatch(
      pendingFormsFilter({
        date: dateRange,
      })
    );
  }

  document.title = "Pending Forms";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Daily Report" pageTitle="Applications" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Pending Forms</h4>
                </CardHeader>

                <CardBody>
                  <div className="listjs-table" id="userList">
                    <Row className="g-4 mb-3">
                      <Col className="col-sm-auto w-100 d-flex align-items-center">
                        <div className="d-flex" style={{ gap: "10px" }}>
                          <div className="search-box">
                            <input
                              type="text"
                              className="form-control bg-light border-light"
                              autoComplete="off"
                              id="searchList"
                              placeholder="Search name or bank"
                              onChange={(e) =>
                                dispatch(
                                  pendingFormsFilter({
                                    searchQuery: e.target.value,
                                  })
                                )
                              }
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>

                          <div className="d-flex">
                            <Flatpickr
                              className="form-control border dash-filter-picker"
                              placeholder="Date Range"
                              options={{
                                mode: "range",
                                dateFormat: "d M, Y",
                              }}
                              onChange={(date) => {
                                setDateRange(date);
                              }}
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn btn-primary btn-label waves-effect waves-light"
                            onClick={handleFilterByDate}
                          >
                            <i className="ri-equalizer-fill label-icon align-middle fs-16 me-2"></i>
                            Apply Date Filter
                          </button>
                        </div>
                      </Col>
                    </Row>

                    <Col>
                      <Nav tabs className="nav-tabs mb-3">
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab === "1",
                            })}
                            onClick={() => {
                              toggle("1");
                            }}
                          >
                            Pending
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab === "2",
                            })}
                            onClick={() => {
                              toggle("2");
                            }}
                          >
                            Updated
                          </NavLink>
                        </NavItem>
                      </Nav>

                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="1" id="pending">
                          {/* <div className="table-responsive table-card mt-3 mb-1"> */}
                          {/* will use this later for responsiveness */}
                          <div className="table-card mt-3 mb-1">
                            <table className="table align-middle table-nowrap">
                              <thead className="table-light">
                                <tr>
                                  <th data-sort="id">ID</th>
                                  <th data-sort="name">Name</th>
                                  <th data-sort="punch_date">Punch Date</th>
                                  <th data-sort="number">Number</th>

                                  <th data-sort="panNumber">Pan Number</th>

                                  <th data-sort="bank">Bank</th>
                                  <th data-sort="formType">Form Type</th>

                                  <th data-sort="tools">Tools</th>
                                </tr>
                              </thead>
                              <tbody className="list form-check-all">
                                {(filteredPendingForms.length !== 0
                                  ? filteredPendingForms
                                  : pendingForms
                                )?.map((form, idx) => (
                                  <FormRow
                                    key={idx}
                                    form={form}
                                    onUpdate={updateCreditCardForm}
                                  />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </TabPane>

                        <TabPane tabId="2" id="updated">
                          {/* <div className="table-responsive table-card mt-3 mb-1"> */}
                          <div className="table-card mt-3 mb-1">
                            {" "}
                            {/* will use this later for responsiveness */}
                            <table className="table align-middle table-nowrap">
                              <thead className="table-light">
                                <tr>
                                  <th data-sort="id">ID</th>
                                  <th data-sort="name">Name</th>
                                  <th data-sort="punch_date">Punch Date</th>
                                  <th data-sort="number">Number</th>

                                  <th data-sort="panNo">Pan No</th>

                                  <th data-sort="bank">Bank</th>
                                  <th data-sort="bank">Form Type</th>

                                  <th data-sort="unique_attempts">Tools</th>
                                </tr>
                              </thead>
                              <tbody className="list form-check-all">
                                {(filteredUpdatedForms.length !== 0
                                  ? filteredUpdatedForms
                                  : updatedForms
                                )?.map((form, idx) => (
                                  <FormRow
                                    key={idx}
                                    form={form}
                                    onUpdate={updateCreditCardForm}
                                  />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default PendingForms;
