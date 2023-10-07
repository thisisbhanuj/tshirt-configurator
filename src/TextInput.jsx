import React, { useState } from 'react';

function TextInput(props) {
  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="filepicker-container">
      <input
        type="text"
        className='flex-auto flex flex-col'
        placeholder="          Sarcasm?"
        value={text}
        maxLength={20}
        minLength={1}
        onChange={handleTextChange}
      />
      <button className='' onClick={() => props.onTextSubmit(text)}>PUBLISH</button>
    </div>
  );
}

export default TextInput;
