import axios from 'axios';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Pro = () => {
    const [text, setText] = useState('');
    const [algorithm, setAlgorithm] = useState('rle');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rotating, setRotating] = useState(false);
    const [file, setFile] = useState(null);
    const [isCompress, setIsCompress] = useState(true); // New state for toggling compress/decompress

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setResult('');
        setLoading(true);
        setRotating(true);

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('text', text);
        }
        formData.append('algorithm', algorithm);
        formData.append('operation', isCompress ? 'compress' : 'decompress'); // Add operation type

        try {
            const response = await axios.post('http://localhost:5000/process', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (error) {
            setError('An error occurred: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
            setTimeout(() => {
                setRotating(false);
            }, 5000);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center text-primary">Text {isCompress ? 'Compression' : 'Decompression'}</h1>
            <form onSubmit={handleSubmit} className="mb-4" encType="multipart/form-data">
                <div className="mb-3">
                    <label htmlFor="textInput" className="form-label">Text:</label>
                    <input
                        type="text"
                        id="textInput"
                        className="form-control"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isCompress ? 'Enter text to compress' : 'Enter text to decompress'}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="algorithmSelect" className="form-label">Algorithm:</label>
                    <select
                        id="algorithmSelect"
                        className="form-select"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                    >
                        <option value="rle">RLE</option>
                        <option value="huffman">Huffman</option>
                        <option value="lzw">LZW</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">Upload File:</label>
                    <input
                        type="file"
                        id="fileInput"
                        className="form-control"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Processing...' : (isCompress ? 'Compress' : 'Decompress')}
                </button>
            </form>

            <button
                className="btn btn-secondary w-100 mt-2"
                onClick={() => setIsCompress(!isCompress)}
            >
                Switch to {isCompress ? 'Decompression' : 'Compression'}
            </button>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading && (
                <div className="d-flex justify-content-center position-relative">
                    <div className={`washing-machine ${rotating ? 'rotate' : ''}`}>
                        <div className="machine-body">
                            <div className="machine-drain"></div>
                            <div className="machine-cord"></div>
                            <div className="machine-door">
                                <div className="door-handle"></div>
                                <div className="glass"></div>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
                            <circle cx="50" cy="50" r="40" fill="#f3f3f3" stroke="#3498db" strokeWidth="5"/>
                            <circle cx="50" cy="50" r="30" fill="#fff" stroke="#3498db" strokeWidth="5"/>
                            <circle cx="50" cy="50" r="12" fill="none" stroke="#3498db" strokeWidth="3"/>
                            <line x1="50" y1="50" x2="50" y2="38" stroke="#3498db" strokeWidth="3"/>
                            <line x1="50" y1="50" x2="62" y2="50" stroke="#3498db" strokeWidth="3"/>
                            <line x1="50" y1="50" x2="50" y2="62" stroke="#3498db" strokeWidth="3"/>
                            <line x1="50" y1="50" x2="38" y2="50" stroke="#3498db" strokeWidth="3"/>
                            <circle cx="50" cy="50" r="30" fill="none" stroke="#3498db" strokeWidth="5" strokeDasharray="10,10">
                                <animate attributeName="strokeDashoffset" from="0" to="100" dur="1s" begin="0s" repeatCount="indefinite"/>
                            </circle>
                        </svg>
                    </div>
                </div>
            )}

            {result && (
                <div className="fade-in-result">
                    <h2 className="text-success">Result:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Pro;
