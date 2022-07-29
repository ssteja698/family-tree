import React, { useState, useEffect } from "react";
import "./familyTree.css";

function generateNewColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

function invertColor(hex, bw) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
  }
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const DisplayFamilyTree = ({
  family,
  familyColors,
  color = null,
  showBabbadiFamily,
  babbadiFamily,
  bejjipuramFamily,
  setBabbadiFamily,
  setBejjipuramFamily,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const showName = ({ childNo, name }) => {
    return childNo ? `${childNo}. ${name}` : name;
  };

  const modifyCurrFamily = ({ currFamily, mainFamily, newChild }) => {
    if (
      currFamily.name === mainFamily.name &&
      currFamily.spouse === mainFamily.spouse &&
      currFamily.childNo === mainFamily.childNo &&
      currFamily.children?.length === mainFamily.children?.length
    ) {
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

  const familyColor =
    familyColors[`${family.name}${family.spouse}`] ||
    familyColors[`${family.spouse}${family.name}`] ||
    color ||
    generateNewColor();

  familyColors[`${family.name}${family.spouse}`] = familyColor;

  if (isOpen && family.children?.length) {
    const nameColor = invertColor(familyColor, true);
    return (
      <div
        className="d-flex flex-column align-items-center m-auto p-2 rounded-3 text-nowrap overflow-auto"
        style={{
          width: "fit-content",
          border: `2px solid ${nameColor}`,
          backgroundColor: familyColor,
          color: nameColor,
        }}
      >
        <h4 className="p-0 m-0">
          {showName({ childNo: family.childNo, name: family.name })}
        </h4>
        {family?.spouse && <h5>{family?.spouse}</h5>}
        <div
          style={{
            height: 20,
            width: 2,
            background: nameColor,
          }}
        ></div>
        <div
          style={{ cursor: "pointer" }}
          onClick={async () => {
            const mainFamily = showBabbadiFamily
              ? { ...babbadiFamily }
              : { ...bejjipuramFamily };

            modifyCurrFamily({
              currFamily: family,
              mainFamily,
              newChild: {
                name: "bro",
                spouse: "bro",
                isMale: true,
                children: null,
                childNo: family.children.length + 1,
              },
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
          }}
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </div>
        <div
          className="d-flex"
          style={{
            borderTop: `2px solid ${nameColor}`,
          }}
        >
          {family.children
            .sort((first, second) => first.childNo - second.childNo)
            .map((child, index, children) => (
              <div
                key={`${child.childNo}--${child.name}--${child.spouse}--${child.children?.length}`}
                className="d-flex flex-column align-items-center"
              >
                <div
                  style={{
                    height: 20,
                    width: 2,
                    background: nameColor,
                  }}
                ></div>
                <div
                  className="familyTree__triangleDown"
                  style={{
                    borderTop: `8px solid ${nameColor}`,
                  }}
                ></div>
                <div
                  key={`${child.name}_${child.spouse}`}
                  className={index === children.length - 1 ? "" : "me-3"}
                >
                  <DisplayFamilyTree
                    family={child}
                    color={child.isMale ? familyColor : null}
                    familyColors={familyColors}
                    showBabbadiFamily={showBabbadiFamily}
                    babbadiFamily={babbadiFamily}
                    bejjipuramFamily={bejjipuramFamily}
                    setBabbadiFamily={setBabbadiFamily}
                    setBejjipuramFamily={setBejjipuramFamily}
                  />
                </div>
              </div>
            ))}
        </div>
        <button
          className="mt-3 cursor-pointer border-0 rounded-3"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          Hide Family
        </button>
      </div>
    );
  }
  return (
    <div>
      {family.spouse || family.children?.length ? (
        <h4 className="p-0 m-0">
          {showName({ childNo: family.childNo, name: family.name })}
        </h4>
      ) : (
        <div>{showName({ childNo: family.childNo, name: family.name })}</div>
      )}
      {family?.spouse && (!family.children || !family.children.length) && (
        <h5>{family?.spouse}</h5>
      )}
      {family.children?.length && (
        <button
          className="mt-1 p-1 px-2 cursor-pointer border-0 rounded-3"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          Show Family
        </button>
      )}
    </div>
  );
};

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
