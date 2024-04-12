import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import DispositionFormModal from "./DispositionFormModal";
import CRMFieldRemoveModal from "./CRMFieldRemoveModal";
import CRMFormModal from "./CRMFormModal";
import {
  getCrmConfigurationData,
  createCrmField,
  updateCrmField,
  removeCrmField,
} from "../../slices/CRMConfiguration/thunk";
import {
  getDispositions,
  createDisposition,
} from "../../slices/Disposition/thunk";
import { useDispatch, useSelector } from "react-redux";
import { changeCampaign } from "../../slices/Disposition/reducer";

const Disposition = () => {
  // modal for crm field
  const [modal_list, setmodal_list] = useState(false);
  // modal for crm form (form that is shown after show crm button is clicked)
  const [crmFormModalList, setCrmFormModalList] = useState(false);
  // modal for deleting a crm field
  const [modal_delete, setmodal_delete] = useState(false);
  // id of crm field made this to store the id of crm field that is going to be deleted or edited
  const [listCrmFieldId, setListCrmFieldId] = useState("");
  // to check whether a crm field is in editing state (it helps in changing the behaviour of submit method of form if a field is being edited then submit method to edit field will be called otherwise submit method to create crm field will be called)
  const [isEditingCrmField, setIsEditingCrmField] = useState(false);
  // badges
  const [inputBadges, setInputBadges] = useState([]);

  const {
    crmFields,
    crmConfigurationData,
    // selectedCampaignId,
    alreadyExistsError,
  } = useSelector((state) => state.CRMConfiguration);

  const { dispositionsData, selectedCampaignId } = useSelector(
    (state) => state.Disposition
  );

  const dispatch = useDispatch();

  // to toggle modal for crm field
  function tog_list() {
    setmodal_list(!modal_list);
    setIsEditingCrmField(false);
  }

  // to toggle modal for crm form (form that is shown after clicking show crm button)
  function crmFormModalToggleList() {
    setCrmFormModalList(!crmFormModalList);
  }

  // toggles delete crmField confirmation modal
  function tog_delete() {
    setmodal_delete(!modal_delete);
  }

  useEffect(() => {
    if (alreadyExistsError) {
      setmodal_list(!modal_list);
    }
  }, [alreadyExistsError]);

  useEffect(() => {
    dispatch(getDispositions());
  }, [dispatch]);

  // formik setup
  const dispositionFormValidation = useFormik({
    initialValues: {
      dispositionName: "",
      options: "",
    },
    validationSchema: Yup.object({
      dispositionName: Yup.string().required("Disposition name is required"),
      options: Yup.array().required("Please enter atleast 1 item"),
    }),
    onSubmit: (values) => {
      // isEditingCrmField
      //   ? dispatch(
      //       updateCrmField({ selectedCampaignId, listCrmFieldId, values })
      //     )
      //   : dispatch(createCrmField({ selectedCampaignId, values }));

      const { dispositionName, options } = values;

      dispatch(
        createDisposition({ selectedCampaignId, dispositionName, options })
      );

      // console.log("disposition form values", values);
      setmodal_list(!modal_list);
    },
  });

  // formik for campaign (that is selected inside select element)
  const campaignTypeValidation = useFormik({
    initialValues: {
      campaignName: "",
    },
    validationSchema: Yup.object({
      campaignName: Yup.string().required(),
    }),
    onSubmit: (values) => {},
  });

  function handleDispositionFormSubmit(e) {
    e.preventDefault();
    dispositionFormValidation.handleSubmit();
    return false;
  }

  // to update list of crm field when campaign is changed in select element
  function handleChange(e) {
    campaignTypeValidation.setFieldValue("campaignName", e.target.value);
    dispatch(changeCampaign(e.target.value));
  }

  function showCampaignFormHandleSubmit(e) {
    e.preventDefault();
    campaignTypeValidation.handleSubmit();

    return false;
  }

  // to update the values of crmField form when editing the crmField
  function handleEditCrmField(crmFieldData) {
    setIsEditingCrmField(true);
    setmodal_list(!modal_list);
    setListCrmFieldId(crmFieldData.id);

    dispositionFormValidation.setValues({
      dispositionName: crmFieldData.caption,
      options: crmFieldData.type,
    });
  }

  document.title = "CRM Configuration";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Campaign Management"
            pageTitle="Operational Configuration"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Disposition</h4>
                </CardHeader>

                <CardBody>
                  <div className="listjs-table" id="userList">
                    <Row className="g-4 mb-3">
                      <Col className="col-sm-auto">
                        <Form
                          style={{ display: "flex", gap: "10px" }}
                          onSubmit={(e) =>
                            showCampaignFormHandleSubmit(
                              e,
                              campaignTypeValidation.caption
                            )
                          }
                        >
                          <div className="mb-2">
                            <Input
                              id="campaignType"
                              name="campaignType"
                              className="form-control"
                              placeholder="Enter Campaign Type"
                              type="select"
                              onChange={handleChange}
                              onBlur={campaignTypeValidation.handleBlur}
                              value={
                                campaignTypeValidation.values.campaignName || ""
                              }
                              invalid={
                                campaignTypeValidation.touched.campaignName &&
                                campaignTypeValidation.errors.campaignName
                                  ? true
                                  : false
                              }
                            >
                              <option value="" disabled>
                                Select Campaign Type
                              </option>

                              {dispositionsData?.campaigns?.map((campaign) => (
                                <option
                                  value={campaign?.campaignName}
                                  key={campaign.id}
                                >
                                  {campaign?.campaignName}
                                </option>
                              ))}
                            </Input>

                            {campaignTypeValidation.touched.campaignType &&
                            campaignTypeValidation.errors.campaignType ? (
                              <FormFeedback type="invalid">
                                {campaignTypeValidation.errors.campaignType}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div>
                            <Button
                              color="primary"
                              className="add-btn me-1"
                              type="submit"
                              id="show-btn"
                              disabled={!selectedCampaignId}
                              onClick={() =>
                                crmFormModalToggleList(!crmFormModalList)
                              }
                            >
                              <i className="ri-search-line search-icon"> </i>
                              Show CRM
                            </Button>
                          </div>
                        </Form>
                      </Col>
                      <Col
                        className="col-sm-auto"
                        style={{ marginLeft: "auto" }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Button
                            color="primary"
                            className="add-btn me-1"
                            onClick={() => tog_list()}
                            id="create-btn"
                            disabled={!selectedCampaignId} // if no campaign is selected button will remain disabled
                          >
                            <i className="ri-add-line align-bottom me-1"></i>{" "}
                            Disposition
                          </Button>
                        </div>
                      </Col>
                    </Row>

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap"
                        id="userTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ width: "50px" }}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="checkAll"
                                  value="option"
                                />
                              </div>
                            </th>
                            <th className="sort" data-sort="caption">
                              Disposition Name
                            </th>
                            <th className="sort" data-sort="type">
                              Fields
                            </th>
                            {/* <th className="sort" data-sort="required">
                              Required
                            </th>
                            <th className="sort" data-sort="readOnly">
                              Read Only
                            </th>
                            <th className="sort" data-sort="position">
                              Position
                            </th> */}
                            <th className="sort" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {crmFields?.map((crmField) => (
                            <tr key={crmField.id}>
                              <th scope="row">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="checkAll"
                                    value="option1"
                                  />
                                </div>
                              </th>
                              <td className="dispositionName">
                                {crmField?.caption}
                              </td>
                              <td className="fields">{crmField?.type}</td>
                              {/* <td className="required">
                                {crmField?.required ? "yes" : "no"}
                              </td> */}
                              {/* <td className="readOnly">
                                {crmField?.readOnly ? "yes" : "No"}
                              </td> */}
                              {/* <td className="position">{crmField?.position}</td> */}
                              <td>
                                <div className="d-flex gap-2">
                                  <div className="edit">
                                    <button
                                      className="btn btn-sm btn-primary edit-item-btn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#showModal"
                                      onClick={() =>
                                        handleEditCrmField(crmField)
                                      }
                                    >
                                      Edit
                                    </button>
                                  </div>
                                  <div className="remove">
                                    <button
                                      className="btn btn-sm btn-success remove-item-btn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#deleteRecordModal"
                                      onClick={() => {
                                        setListCrmFieldId(crmField.id);
                                        setmodal_delete(true);
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Link
                          className="page-item pagination-prev disabled"
                          to="#"
                        >
                          Previous
                        </Link>
                        <ul className="pagination listjs-pagination mb-0"></ul>
                        <Link className="page-item pagination-next" to="#">
                          Next
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </div>
      <DispositionFormModal
        modal_list={modal_list}
        tog_list={tog_list}
        dispositionFormValidation={dispositionFormValidation}
        isEditingCrmField={isEditingCrmField}
        handleDispositionFormSubmit={handleDispositionFormSubmit}
        selectedCampaignId={selectedCampaignId}
        alreadyExistsError={alreadyExistsError}
        inputBadges={inputBadges}
        setInputBadges={setInputBadges}
      />
      {/* crm field remove modal */}
      <CRMFieldRemoveModal
        modal_delete={modal_delete}
        tog_delete={tog_delete}
        setmodal_delete={setmodal_delete}
        handleDeleteCrmField={() => {
          dispatch(removeCrmField({ selectedCampaignId, listCrmFieldId }));
          setmodal_delete(false);
        }}
      />
      {/* crm form modal */}
      {/* <CRMFormModal
        crmFormModalList={crmFormModalList}
        crmFormModalToggleList={crmFormModalToggleList}
        crmFieldFormHandleSubmit={crmFieldFormHandleSubmit}
        dispositionFormValidation={dispositionFormValidation}
        crmFields={crmFields}
      /> */}
    </React.Fragment>
  );
};

export default Disposition;
