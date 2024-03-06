import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud } from 'react-icons/fi'; // Importing icon from react-icons library

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Ensure a file is selected
    if (!selectedFile) {
      console.error('No file selected');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile); // Use 'file' as the key

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg ">
        <div className="p-4">
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="border-2 border-gray-300 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
              <FiUploadCloud className="text-gray-400 h-12 w-12 mb-2" />
              <p className="text-gray-500 text-center">Click to choose a file</p>
            </div>
            <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          {selectedFile && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Selected Image</h2>
              <div className='flex justify-center items-center'>
              <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="max-w-full mb-4" />
              </div>
              <button onClick={handleSubmit} className="text-white font-bold py-2 px-4 rounded w-full submitbtn">Submit</button>
            </div>
          )}
          {loading && <p className="mt-4 text-center">Loading...</p>}
          {result && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Result</h2>
              <p><span className="font-semibold">Class:</span> {result.class}</p>
              <p><span className="font-semibold">Confidence:</span> {result.confidence}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
