import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    moduleCode: '',
    tags: ''
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    try {
      // Step 1: Get presigned S3 URL from backend
      const { data } = await axios.get('http://localhost:5000/get-upload-url');

      // Step 2: Upload file to S3
      await axios.put(data.url, file, {
        headers: { 'Content-Type': file.type }
      });

      const fileURL = data.url.split('?')[0]; // actual S3 file URL

      // Step 3: Send metadata to backend
      await axios.post('http://localhost:5000/add-note', {
        ...metadata,
        fileURL,
        timestamp: new Date().toISOString(),
        uploader: 'anonymous'
      });

      alert('Note uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div>
      <h2>Upload a Note</h2>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} />
      <input type="text" name="moduleCode" placeholder="Module Code" onChange={handleChange} />
      <input type="text" name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadForm;