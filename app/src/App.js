import "./App.css";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { TextractClient, ListAdaptersCommand } from "@aws-sdk/client-textract";
function App() {
  const [file, setFile] = useState({});
  const [buttonText, setButtonText] = useState("Submit");
  const [parsedData, setParsedData] = useState({});
  const [progressBar, setProgressBar] = useState(false);
  const [progressValue, setProgressValue] = useState(10);
  const [dataAWS, setDataAWS] = useState();

  let formData = new FormData();
  const submit = async (e) => {
    setButtonText("Parsing Receipt...");
    setProgressBar(true);
    e.preventDefault();
    formData.append("file", file);
    const url = "http://localhost:5000/AWSupload"; //http://localhost:4000/extracttextfromimages https://parsio-backend-4.onrender.com/extracttextfromimages
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setButtonText("Submit");
        setProgressValue(100);
        setProgressBar(false);
        setParsedData(data);
        const awsData = data.ExpenseDocuments[0].Blocks.map((block) => {
          if (block.BlockType === "LINE") {
            return block.Text;
          }
          return "na";
        });
        console.log(awsData.toString());
        setDataAWS(awsData);
      })
      .catch((err) => console.log(err));
  };
  console.log(parsedData);

  const prefinalData = parsedData?.data?.json?.Items;
  console.log(prefinalData);
  const finalData = prefinalData?.map((elm) => {
    return elm._source;
  });
  const string = dataAWS?.map((elm) => {
    return <li>{elm}</li>;
  });
  // const products = prefinalData.map((elm=>elm.description))
  // const finalData =
  // //   prefinalData?.length > 0
  // //     ? prefinalData[0].values.map((elm) => {
  // //         return <li>elm?.content</li>;
  // //       })
  // //     : [];
  // // console.log(finalData);
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
    "WRIGLEYS ECLIPSEMINT",
  ];

  const filteredData = finalData?.filter((elm) => keywords.includes(elm));
  console.log(filteredData);
  // keywords.contains(filteredData.map((elm) => elm));
  const success =
    dataAWS?.length > 0 ? (
      dataAWS?.filter((elm) =>
        keywords.some((keyword) =>
          elm.toLowerCase().includes(keyword.toLowerCase())
        )
      ).length > 0 ? (
        <div className="success">EclipseMint purchase detected</div>
      ) : (
        <div className="fail">No EclipseMint purchase detected</div>
      )
    ) : (
      <div className="yellow">Please upload the image</div>
    );

  function handleProgressBar() {}

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
      <div className="progress-bar">
        {progressBar ? <ProgressBar value={progressValue} /> : null}
      </div>

      <ol>{string}</ol>
      <div>{success}</div>
    </div>
  );
}

export default App;
