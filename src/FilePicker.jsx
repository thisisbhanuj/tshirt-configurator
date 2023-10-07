import React from 'react'

import CustomButton from './CustomButton'

const FilePicker = ({ file, setFile, readFile }) => {
  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input 
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label font-bold">
          Upload Image
        </label>

        <p className="mt-2 text-black text-l font-bold truncate">
          {file === '' ? "No image selected" : file.name}
        </p>
      </div>

      { file && <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton 
          type="outline"
          title="Logo"
          handleClick={() => readFile('logo')}
          customStyles="text-xs"
        />
        <CustomButton 
          type="outline"
          title="Poster"
          handleClick={() => readFile('poster')}
          customStyles="text-xs"
        />
      </div>}
    </div>
  )
}

export default FilePicker;
