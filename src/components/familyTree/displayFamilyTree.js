import React, { useState } from "react";
import { generateNewColor, invertColor, postData } from "../utils/helper";
import "./styles.css";

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

export default DisplayFamilyTree;
