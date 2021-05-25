import "./App.scss";
import React, { useEffect, useState } from "react";
import marked from "marked";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faEye, faExpandArrowsAlt, faCompressArrowsAlt } from "@fortawesome/free-solid-svg-icons";

marked.setOptions({
  breaks: true,
});

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + "</a>";
};

const Toolbar = (props) => {
  return (
    <div className="toolbar">
      <FontAwesomeIcon icon={props.Icon} className="icon"/>
      {props.text}
      <FontAwesomeIcon icon={props.wrapIcon} onClick={props.onClick} className="wrapIcon"/>
    </div>
  );
};

const Editor = (props) => {
  return (
    <div className="editor">
      <textarea
        value={props.markdown}
        id="editor"
        type="text"
        onChange={props.onChange}
      />
    </div>
  );
};

const Previewer = (props) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(props.markdown, { renderer: renderer }),
      }}
      id="preview"
    />
  );
};

function App() {
  const [markDown, setMarkDown] = useState("");
  const [editorMaximized, setEditorMaximized] = useState(false);
  const [previewMaximized, setPreviewMaximized] = useState(false);

  function handleChange(e) {
    setMarkDown(() => e.target.value);
  }

  function handleEditorMaximaze(){
    setEditorMaximized(!editorMaximized);
  }

  function handlePreviewMaximaze(){
    setPreviewMaximized(!previewMaximized);
  }

  const placeholder = `# Welcome to my React Markdown Previewer!

  ## This is a sub-heading...
  ### And here's some other cool stuff:
  
  Heres some code, \`<div></div>\`, between 2 backticks.
  
  \`\`\`
  // this is multi-line code:
  
  function anotherExample(firstLine, lastLine) {
    if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
      return multiLineCode;
    }
  }
  \`\`\`
  
  You can also make text **bold**... whoa!
  Or _italic_.
  Or... wait for it... **_both!_**
  And feel free to go crazy ~~crossing stuff out~~.
  
  There's also [links](https://www.freecodecamp.com), and
  > Block Quotes!
  
  And if you want to get really crazy, even tables:
  
  Wild Header | Crazy Header | Another Header?
  ------------ | ------------- | -------------
  Your content can | be here, and it | can be here....
  And here. | Okay. | I think we get it.
  
  - And of course there are lists.
    - Some are bulleted.
       - With different indentation levels.
          - That look like this.
  
  
  1. And there are numbererd lists too.
  1. Use just 1s if you want!
  1. And last but not least, let's not forget embedded images:
  
  ![React Logo w/ Text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png)
  `;

  useEffect(() => {
    setMarkDown(placeholder);
  }, []);

  const classes = editorMaximized
    ? ["editorWrap maximized", "previewWrap hide", faCompressArrowsAlt]
    : previewMaximized
    ? ["editorWrap hide", "previewWrap maximized", faCompressArrowsAlt]
    : ["editorWrap", "previewWrap", faExpandArrowsAlt];

  return (
    <div className="mainBlock">
      <div className={classes[0]}>
        <Toolbar text="Editor" Icon={faPenAlt} wrapIcon={classes[2]} onClick={handleEditorMaximaze}/>
        <Editor onChange={handleChange} markdown={markDown} />
      </div>
      <div className={classes[1]}>
        <Toolbar text="Previewer" Icon={faEye} wrapIcon={classes[2]} onClick={handlePreviewMaximaze}/>
        <Previewer markdown={markDown} />
      </div>
    </div>
  );
}

export default App;
