// import React from 'react'

// const SignatureTemp = () => {
//   return (
//     <div>SignatureTemp</div>
//   )
// }

// export default SignatureTemp




import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill Snow theme
import 'quill-emoji/dist/quill-emoji.css'; // Emoji styles
import Quill from 'quill';
import 'quill-emoji';

// Register the emoji module
Quill.register('modules/emoji', require('quill-emoji'));
const TextEditorWithEmoji = () => {
  const [editorContent, setEditorContent] = useState('');

  const modules = {
    toolbar: [
      [{ 'emoji': true }],  // Add emoji button
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      ['clean']  // Remove formatting button
    ],
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true,
  };

  return (
    <ReactQuill
      value={editorContent}
      onChange={setEditorContent}
      modules={modules}
      theme="snow"
    />
  );
};

export default TextEditorWithEmoji;
