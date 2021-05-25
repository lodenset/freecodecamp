import "./App.scss";
import React, { useState } from "react";

function App() {

  const [editedText, setEditedText] = useState('');

  const [previewText, setPreviewText] = useState('');

  function handleChange(e){
    setEditedText(e.target.value);
  }

  const Editor = () => {
    return(
      <textarea
        value={editedText} 
        id='editor'
        type='text'
        onChange = {handleChange}
      />
    );
  }

  const Previewer = () => {
    return(
      <div id="preview">

      </div>
    )
  }

  return (
    <div>      
      <Editor/>
      <Previewer/>
    </div>
  );
}

export default App;
