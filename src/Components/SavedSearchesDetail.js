import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CollapsableCard from "./CollapsableCard";
import Loading from "./Loading";
import "../App.css";

export default function SavedSearchesDetail() {
  const { searchId } = useParams();
  const [currentSearch, setCurrentSearch] = useState({});
  const [cancerData, setCancerData] = useState([]);

  useEffect(() => {
    console.log(typeof cancerData);
    const getUserSearches = () => {
      fetch(`http://localhost:4000/usersearchs/${searchId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        "Access-Control-Allow-Origin": "http://localhost:4000",
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setCurrentSearch(res);
        })
        .catch((err) => console.log(err));
    };
    getUserSearches();
  }, []);

  useEffect(() => {
    if (Object.keys(currentSearch).length !== 0) {
      fetch(
        `http://localhost:4000/cancerdata/${currentSearch.cancer_data_id}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          "Access-Control-Allow-Origin": "http://localhost:4000",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setCancerData(res);
        })
        .catch((err) => console.log(err));
    }
  }, [currentSearch]);

  const getCheckboxList = (id, text) => {
    return (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id={id}
          disabled
          checked
        />
        <label className="custom-control-label" htmlFor={id}>
          {text}
        </label>
      </div>
    );
  };

  const formatDate = (date) => {
    let formattedDate = new Date(date);
    return formattedDate.toLocaleDateString();
  };

  return (
    <>
      {Object.keys(cancerData).length !== 0 ? (
        <>
          <div className="list-group-item list-group-item-action flex-column align-items-start mb-3 custom-list-item">
            <div className="d-flex w-100 justify-content-between mb-3">
              <div className="d-flex">
                <h5 className="mt-auto mb-auto">{currentSearch.search_name}</h5>
                <div className="vertical-line"></div>
                <h6 className="mt-auto mb-auto">{currentSearch.ensg_number}</h6>
              </div>
              <div>{formatDate(currentSearch.createdAt)}</div>
            </div>
            <Row className="mb-1">
              <Col>
                <h6>Projects</h6>
                {currentSearch.project.map((element, index) =>
                  getCheckboxList(index, element)
                )}
              </Col>
              <Col>
                <h6>Categories</h6>
                {currentSearch.category.map((element, index) =>
                  getCheckboxList(index, element)
                )}
              </Col>
              <Col>
                <h6>Data Type</h6>
                {currentSearch.data_type.map((element, index) =>
                  getCheckboxList(index, element)
                )}
              </Col>
              <Col>
                <h6>Workflow</h6>
                {currentSearch.workflow.map((element, index) =>
                  getCheckboxList(index, element)
                )}
              </Col>
            </Row>
          </div>
          <CollapsableCard title={`Results for ${currentSearch.ensg_number}`}>
            <table class="table table-hover">
              <thead>
                <tr class="table-primary">
                  <th scope="col">File ID</th>
                  <th scope="col">FPKM of {currentSearch.ensg_number}</th>
                  <th scope="col">Case ID</th>
                  <th scope="col">Vital Status</th>
                  <th scope="col">Days to Death</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Tumor Grade</th>
                  <th scope="col">Tumor Stage</th>
                </tr>
              </thead>
              <tbody>
                {cancerData.data.map((r) => (
                  <tr>
                    <td>{r.file_id}</td>
                    <td>{r.gene_value}</td>
                    <td>{r.case_id}</td>
                    <td>{r.vital_status}</td>
                    <td>{r.days_to_death}</td>
                    <td>{r.gender}</td>
                    <td>{r.tumor_grade}</td>
                    <td>{r.tumor_stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CollapsableCard>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}