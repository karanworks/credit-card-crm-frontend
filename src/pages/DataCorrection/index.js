import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Select from "react-select";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getDataCorrection,
  cityDataCorrection,
  salaryDataCorrection,
  getStates,
  getCities,
  getPinCodes,
  getSalaryInLacs,
  getSalaryInThousands,
} from "../../slices/DataCorrection/thunk";

const DataCorrection = () => {
  const [selectedSingleState, setSelectedSingleState] = useState(null);

  const [selectedSingleCity, setSelectedSingleCity] = useState(null);

  const [selectedSinglePinCode, setSelectedSinglePinCode] = useState(null);

  const [selectedSingleSalaryInLacs, setSelectedSingleSalaryInLacs] =
    useState(null);

  const [selectedSingleSalaryInThousands, setSelectedSingleSalaryInThousands] =
    useState(null);

  const {
    salary,
    city,
    states,
    cities,
    pinCodes,
    salaryInLacs,
    salaryInThousands,
  } = useSelector((state) => state.DataCorrection);
  console.log("CITY RECEIVED ->", city);

  const dispatch = useDispatch();

  function handleSelectSingleState(state) {
    setSelectedSingleState(state);
  }

  function handleSelectSingleCity(city) {
    setSelectedSingleCity(city);
  }
  function handleSelectSinglePinCode(pinCode) {
    setSelectedSinglePinCode(pinCode);
  }

  function handleSelectSingleSalaryInLacs(salaryInLacs) {
    setSelectedSingleSalaryInLacs(salaryInLacs);
  }
  function handleSelectSingleSalaryInThousands(salaryInThousands) {
    setSelectedSingleSalaryInThousands(salaryInThousands);
  }

  const salaryInLacsOptions = salaryInLacs?.map((salary) => {
    const salaryWithoutComma = salary.value.replace(/,/g, "");
    return { value: salaryWithoutComma, label: salary.value };
  });
  const salaryInThousandsOptions = salaryInThousands?.map((salary) => {
    const salaryWithoutComma = salary.value.replace(/,/g, "");

    return { value: salaryWithoutComma, label: salary.value };
  });
  const stateOptions = states?.map((state) => {
    return { value: state.id, label: state.name };
  });

  const cityOptions = cities?.map((city) => {
    return { value: city.id, label: city.name };
  });

  const pinCodeOptions = pinCodes?.map((pinCode) => {
    return {
      value: pinCode.pinCode,
      label: pinCode.name + " - " + pinCode.pinCode,
    };
  });

  useEffect(() => {
    dispatch(getDataCorrection());
    dispatch(getStates());
    dispatch(getSalaryInLacs());
    dispatch(getSalaryInThousands());
  }, []);

  const validation = useFormik({
    initialValues: {
      stateId: "",
      cityId: "",
      pinCode: "",
    },
    validationSchema: Yup.object({
      stateId: Yup.number().required("Please select state id"),
      cityId: Yup.number().required("Please select city id"),
      pinCode: Yup.string().required("Please select pin code"),
    }),
    onSubmit: (values, { resetForm }) => {
      // const cityName = city?.length > 0 && city[0].city;
      const cityName = city && Object.keys(city)?.length > 0 && city.city;

      dispatch(cityDataCorrection({ ...values, cityName })).then((res) => {
        dispatch(getDataCorrection()); // updating the new city immediately
      });

      resetForm();
      setSelectedSingleState(null);
      setSelectedSingleCity(null);
      setSelectedSinglePinCode(null);
    },
  });

  const salaryCorrectionValidation = useFormik({
    initialValues: {
      salaryInLacs: "",
      salaryInThousands: "",
    },
    validationSchema: Yup.object({
      salaryInLacs: Yup.string().required("Please select salary"),
      salaryInThousands: Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      // const currentSalary = salary?.length > 0 && salary[0].salary;
      const currentSalary =
        salary && Object.keys(salary)?.length > 0 && salary.salary;
      let salaryInNumbers;

      if (values.salaryInThousands) {
        salaryInNumbers =
          parseInt(values.salaryInLacs) + parseInt(values.salaryInThousands);
      } else {
        salaryInNumbers = values.salaryInLacs;
      }

      dispatch(salaryDataCorrection({ salaryInNumbers, currentSalary })).then(
        (res) => {
          dispatch(getDataCorrection());
        }
      );

      resetForm();
      setSelectedSingleSalaryInLacs(null);
      setSelectedSingleSalaryInThousands(null);
    },
  });

  function formHandleSubmit(e) {
    e.preventDefault();

    validation.handleSubmit();

    return false;
  }
  function salaryCorrectionFormHandleSubmit(e) {
    e.preventDefault();

    salaryCorrectionValidation.handleSubmit();

    return false;
  }

  document.title = "Data Correction";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Data Correction" pageTitle="Data Management" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">City Correction</h4>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col>
                      <Form onSubmit={formHandleSubmit}>
                        <div className="mb-2">
                          <Label htmlFor="current-city" className="form-label">
                            Current City
                            {/* {city?.length > 0 && " - " + city[0]._count.id} */}
                            {city &&
                              Object.keys(city)?.length > 0 &&
                              " - " + city.count}
                          </Label>

                          <Input
                            id="current-city"
                            name="current-city"
                            className="form-control"
                            type="text"
                            // value="New Delhi"
                            // value={
                            //   city?.length > 0 ? city[0].city : "No City Found"
                            // }
                            value={
                              city && Object.keys(city)?.length > 0
                                ? city.city
                                : "No City Found"
                            }
                            disabled
                          />
                        </div>
                        <div className="mb-2">
                          <Label className="form-label">State</Label>
                          <Select
                            id="stateId"
                            name="stateId"
                            value={selectedSingleState}
                            onChange={(state) => {
                              handleSelectSingleState(state);
                              dispatch(getCities(state.value));
                              validation.setFieldValue("stateId", state.value);
                            }}
                            options={stateOptions}
                            placeholder="Select State"
                            // isDisabled={!Boolean(city?.length)}
                            isDisabled={
                              !Boolean(city && Object.keys(city)?.length)
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <Label className="form-label">City</Label>
                          <Select
                            id="cityId"
                            name="cityId"
                            value={selectedSingleCity}
                            onChange={(city) => {
                              handleSelectSingleCity(city);
                              dispatch(getPinCodes(city.value));
                              validation.setFieldValue("cityId", city.value);
                            }}
                            options={cityOptions}
                            placeholder="Select City"
                            isDisabled={
                              // !Boolean(city?.length) || !Boolean(cities)
                              !Boolean(city && Object.keys(city)?.length) ||
                              !Boolean(cities)
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <Label className="form-label">
                            Pin Code GPO/BO/SO
                          </Label>
                          <Select
                            id="pinCode"
                            name="pinCode"
                            value={selectedSinglePinCode}
                            onChange={(pinCode) => {
                              handleSelectSinglePinCode(pinCode);
                              validation.setFieldValue(
                                "pinCode",
                                pinCode.value
                              );
                            }}
                            options={pinCodeOptions}
                            placeholder="Select Pin Code"
                            isDisabled={
                              // !Boolean(city?.length) || !Boolean(pinCodes)
                              !Boolean(city && Object.keys(city)?.length) ||
                              !Boolean(pinCodes)
                            }
                          />
                        </div>

                        <div
                          className="d-flex justify-content-end"
                          style={{ gap: "5px" }}
                        >
                          <button type="submit" className="btn btn-primary">
                            {" "}
                            <i
                              className="ri-file-upload-line"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Upload
                          </button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Salary Correction</h4>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col>
                      <Form onSubmit={salaryCorrectionFormHandleSubmit}>
                        <div className="mb-2">
                          <Label htmlFor="current-city" className="form-label">
                            Current Salary
                            {/* {salary?.length > 0 && " - " + salary[0]._count.id} */}
                            {salary &&
                              Object.keys(salary)?.length > 0 &&
                              " - " + salary.count}
                          </Label>

                          <Input
                            id="current-salary"
                            name="current-salary"
                            className="form-control"
                            type="text"
                            // value="New Delhi"
                            // value={
                            //   salary?.length > 0
                            //     ? salary[0].salary
                            //     : "No Salary Found"
                            // }
                            value={
                              salary && Object.keys(salary)?.length
                                ? salary.salary
                                : "No Salary Found"
                            }
                            disabled
                          />
                        </div>
                        <div className="mb-2 d-flex justify-content-between gap-3">
                          <div style={{ flex: 1 }}>
                            <Label className="form-label">Salary In Lacs</Label>
                            <Select
                              id="salaryInLacs"
                              name="salaryInLacs"
                              value={selectedSingleSalaryInLacs}
                              onChange={(salaryInLacs) => {
                                handleSelectSingleSalaryInLacs(salaryInLacs);

                                salaryCorrectionValidation.setFieldValue(
                                  "salaryInLacs",
                                  salaryInLacs.value
                                );
                              }}
                              options={salaryInLacsOptions}
                              placeholder="Select Salary In Lacs"
                              // isDisabled={!Boolean(city?.length)}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <Label className="form-label">
                              Salary In Thousands
                            </Label>
                            <Select
                              id="salaryInThousands"
                              name="salaryInThousands"
                              value={selectedSingleSalaryInThousands}
                              onChange={(salaryInThousands) => {
                                handleSelectSingleSalaryInThousands(
                                  salaryInThousands
                                );
                                salaryCorrectionValidation.setFieldValue(
                                  "salaryInThousands",
                                  salaryInThousands.value
                                );
                              }}
                              options={salaryInThousandsOptions}
                              placeholder="Select Salary In Thousands"
                            />
                          </div>
                        </div>

                        <div
                          className="d-flex justify-content-end"
                          style={{ gap: "5px" }}
                        >
                          <button type="submit" className="btn btn-primary">
                            {" "}
                            <i
                              className="ri-file-upload-line"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Upload
                          </button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            {/* <Col lg={6}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Data Information</h4>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col>
                      <div className="table-responsive table-card mt-3 mb-1">
                        <table className="table align-middle table-nowrap">
                          <thead className="table-light">
                            <tr>
                              <th>Id</th>
                              <th>States</th>
                              <th>Total Cities</th>
                              <th>Total Data</th>
                            </tr>
                          </thead>
                          <tbody className="list form-check-all">
                            <tr>
                              <td className="id">1</td>
                              <td className="states">Delhi NCR</td>
                              <td className="total_cities">10</td>
                              <td className="total_data">23434</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default DataCorrection;
