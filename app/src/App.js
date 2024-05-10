import "./App.css";
import { useState } from "react";
import axios from "axios";
function App() {
  const [file, setFile] = useState({});
  const [buttonText, setButtonText] = useState("Submit");
  const [parsedData, setParsedData] = useState({});
  let formData = new FormData();
  const submit = async (e) => {
    setButtonText("Parsing Receipt...");
    e.preventDefault();
    formData.append("file", file);
    const url = "http://localhost:4000/extracttextfromimages";
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setButtonText("Submit");
        setParsedData(data);
      })
      .catch((err) => console.log(err));
  };
  console.log(parsedData);

  const prefinalData = parsedData?.data?.parsed?.map((elm) =>
    elm.name === "Items" ? elm.value : []
  );
  const finalData =
    prefinalData?.length > 0
      ? prefinalData[0].values.map((elm) => {
          return elm?.content;
        })
      : [];
  console.log(finalData);
  const keywords = [
    "Eclipsemints",
    "eclp",
    "eclpsmints",
    "wrg eclipse",
    "eclipse",
    "Eclipse chewy",
    "ECLIPSE",
    "ECLIPSE MNT",
    "ECLIPSEMINT",
    "ECLPS",
    "ECLP",
  ];
  const string =
    finalData?.length > 0 ? finalData?.map((elm) => <li>{elm}</li>) : "";

  const success =
    finalData.length > 0
      ? keywords.filter((elm) => (finalData.includes(elm) ? "success" : "fail"))
      : "fail";

  return (
    <div className="App">
      <form className="form">
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        ></input>
        <button type="submit" onClick={submit}>
          {buttonText}
        </button>
      </form>
      <ol>{string}</ol>
      <div>{success}</div>
    </div>
  );
}

export default App;
