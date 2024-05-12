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
    const url = "http://localhost:4000/extracttextfromimages"; //http://localhost:4000/extracttextfromimages https://parsio-backend-4.onrender.com/extracttextfromimages
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

  const prefinalData = parsedData?.data?.json?.items;
  console.log(prefinalData);
  const string = prefinalData.map((elm) => {
    elm._source;
  });
  // const products = prefinalData.map((elm=>elm.description))
  const finalData =
    prefinalData?.length > 0
      ? prefinalData[0].values.map((elm) => {
          return <li>elm?.content</li>;
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
  const success =
    finalData.length > 0
      ? keywords.filter((elm) => finalData.includes(elm))
        ? "pass"
        : "fail"
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
