import React, { useState, useEffect } from "react";
import DisplayFamilyTree from "./displayFamilyTree";

const FamilyTree = () => {
  const familyColors = {};
  const [bejjipuramFamily, setBejjipuramFamily] = useState({});
  const [babbadiFamily, setBabbadiFamily] = useState({});
  const [showBejjipuramFamily, setShowBejjipuramFamily] = useState(false);
  const [showBabbadiFamily, setShowBabbadiFamily] = useState(false);

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
            familyColors={familyColors}
            showBabbadiFamily={showBabbadiFamily}
            babbadiFamily={babbadiFamily}
            bejjipuramFamily={bejjipuramFamily}
            setBabbadiFamily={setBabbadiFamily}
            setBejjipuramFamily={setBejjipuramFamily}
          />
        </div>
      )}
    </div>
  );
};

export default FamilyTree;
