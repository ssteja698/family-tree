import React, { useState, useEffect } from "react";
import Modal from "../common/Modal/Modal";
import { capitalize, postData } from "../utils/helper";
import DisplayFamilyTree from "./displayFamilyTree";

const FamilyTree = () => {
  const familyColors = {};
  const [bejjipuramFamily, setBejjipuramFamily] = useState({});
  const [babbadiFamily, setBabbadiFamily] = useState({});
  const [currFamily, setCurrFamily] = useState({});
  const [showBejjipuramFamily, setShowBejjipuramFamily] = useState(false);
  const [showBabbadiFamily, setShowBabbadiFamily] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildDetails, setNewChildDetails] = useState({
    name: "",
    spouse: "",
    isMale: null,
    children: null,
    childNo: 1,
  });

  useEffect(() => {
    fetch("http://localhost:4000/bejjipuramFamily")
      .then((res) => res.json())
      .then((data) => {
        setBejjipuramFamily(data);
      });

    fetch("http://localhost:4000/babbadiFamily")
      .then((res) => res.json())
      .then((data) => {
        setBabbadiFamily(data);
      });
  }, []);

  const renderInput = ({ id, fieldName }) => {
    return (
      <div className="d-flex mb-2">
        <label className="me-2" htmlFor={id}>
          {capitalize(fieldName)}:
        </label>
        <input
          id={id}
          value={newChildDetails[fieldName]}
          onChange={(e) =>
            setNewChildDetails((newChildDetails) => ({
              ...newChildDetails,
              [fieldName]: e.target.value,
            }))
          }
        />
      </div>
    );
  };

  const renderGender = () => {
    return (
      <div
        className="d-flex align-items-center"
        onChange={(e) =>
          setNewChildDetails((newChildDetails) => ({
            ...newChildDetails,
            isMale: e.target.value === "Male",
          }))
        }
      >
        <label className="me-2">Gender:</label>
        <input
          className="me-1"
          type="radio"
          id="gender1"
          name="gender"
          value="Male"
        />
        <label className="me-2" htmlFor="gender1">
          Male
        </label>
        <input
          className="me-1"
          type="radio"
          id="gender2"
          name="gender"
          value="Female"
        />
        <label htmlFor="gender2">Female</label>
      </div>
    );
  };

  const modifyCurrFamily = ({ currFamily, mainFamily, newChild }) => {
    if (
      currFamily.name === mainFamily.name &&
      currFamily.spouse === mainFamily.spouse &&
      currFamily.childNo === mainFamily.childNo &&
      currFamily.children?.length === mainFamily.children?.length
    ) {
      mainFamily.children ||= [];
      mainFamily.children.push(newChild);
      return mainFamily.children;
    }

    if (mainFamily.children) {
      for (let child of mainFamily.children) {
        let finalCurrFamily = modifyCurrFamily({
          currFamily,
          mainFamily: child,
          newChild,
        });
        if (finalCurrFamily) {
          return finalCurrFamily;
        }
      }
    }

    return null;
  };

  const onAddBtnClick = async () => {
    if (!newChildDetails.name || newChildDetails.isMale === null) {
      alert("A child should have both name and gender");
      return;
    }

    const mainFamily = showBabbadiFamily
      ? { ...babbadiFamily }
      : { ...bejjipuramFamily };

    modifyCurrFamily({
      currFamily: { ...currFamily },
      mainFamily,
      newChild: newChildDetails,
    });

    await postData(
      `http://localhost:4000/${
        showBabbadiFamily ? "babbadiFamily" : "bejjipuramFamily"
      }`,
      mainFamily
    );
    const newFamilyResp = await fetch(
      `http://localhost:4000/${
        showBabbadiFamily ? "babbadiFamily" : "bejjipuramFamily"
      }`
    );
    const newFamily = await newFamilyResp.json();

    if (showBabbadiFamily) {
      setBabbadiFamily(newFamily);
    } else {
      setBejjipuramFamily(newFamily);
    }
  };

  const modalBody = () => {
    if (
      currFamily?.children?.length > 0 &&
      newChildDetails.childNo !== currFamily.children.length + 1
    ) {
      setNewChildDetails((newChildDetails) => ({
        ...newChildDetails,
        childNo: currFamily.children.length + 1,
      }));
    }

    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        {renderInput({ id: "childName", fieldName: "name" })}
        {renderInput({ id: "childSpouse", fieldName: "spouse" })}
        {renderGender()}
        <div className="d-flex mt-3">
          <button className="btn btn-primary me-2" onClick={onAddBtnClick}>
            Add
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddChildModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-2">
      <button
        className="mt-2 me-3 p-1 px-2 cursor-pointer border-0 rounded-3"
        onClick={() =>
          setShowBejjipuramFamily((showBejjipuramFamily) => {
            if (!showBejjipuramFamily) {
              setShowBabbadiFamily(false);
            }
            return !showBejjipuramFamily;
          })
        }
      >
        {showBejjipuramFamily ? "Hide" : "Show"} Bejjipuram Family
      </button>
      <button
        className="p-1 px-2 cursor-pointer border-0 rounded-3"
        onClick={() =>
          setShowBabbadiFamily((showBabbadiFamily) => {
            if (!showBabbadiFamily) {
              setShowBejjipuramFamily(false);
            }
            return !showBabbadiFamily;
          })
        }
      >
        {showBabbadiFamily ? "Hide" : "Show"} Babbadi Family
      </button>

      {(showBabbadiFamily || showBejjipuramFamily) && (
        <div className="mt-3">
          <DisplayFamilyTree
            family={showBabbadiFamily ? babbadiFamily : bejjipuramFamily}
            setCurrFamily={setCurrFamily}
            familyColors={familyColors}
            setShowAddChildModal={setShowAddChildModal}
          />
        </div>
      )}
      <Modal
        show={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        title="Add Child into this family"
      >
        {modalBody()}
      </Modal>
    </div>
  );
};

export default FamilyTree;
