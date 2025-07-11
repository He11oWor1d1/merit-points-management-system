import React, { useState, useEffect } from 'react';
import api from '../../api';

function AdminAcademicStructure() {
  const [newClassName, setNewClassName] = useState('');
  const [newStreamName, setNewStreamName] = useState('');
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [classToDelete, setClassToDelete] = useState(null);
  const [streamToDelete, setStreamToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletionType, setDeletionType] = useState('');

  useEffect(() => {
    async function fetchAcademicStructure() {
      try {
        const response = await api.get('/admin/academic-structure');

        setClasses(response.data.studentClass || []);
        setStreams(response.data.studentStream || []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchAcademicStructure();
  }, []);

  async function handleAddClass() {
    if (!newClassName.trim()) return;
    try {
      const response = await api.post('/admin/class', { class: newClassName });
      setClasses(response.data[0]);
      setNewClassName('');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddStream() {
    if (!newStreamName.trim()) return;
    try {
      const response = await api.post('/admin/stream', { stream: newStreamName });
      setStreams(response.data[0]);
      setNewStreamName('');
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteClass(id) {
    try {
      const response = await api.delete(`/admin/class/${id}`);
      setClasses(response.data.studentClass || []);
    } catch (err) {
      console.error('Failed to delete class:', err);
    }
  }

  async function handleDeleteStream(id) {
    try {
      const response = await api.delete(`/admin/stream/${id}`);
      setStreams(response.data.studentStream || []);
    } catch (err) {
      console.error('Failed to delete stream:', err);
    }
  }

  function ConfirmationPopup({ itemName, entityLabel, visible, onConfirm, onCancel }) {
    if (!visible) return null;

    return (
      <div className="popup d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50">
        <div className="popup-content p-4 bg-white rounded shadow">
          <h5>Confirm deletion</h5>
          <p>Are you sure you want to delete the {entityLabel} '{itemName}'?</p>
          <p className="fw-light text-danger">
            This action will permanently delete the {entityLabel} and cannot be undone.
          </p>
          <div className="d-flex justify-content-end">
            <button className="btn btn-danger me-3" onClick={onConfirm}>Delete</button>
            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid ms-3">
        <h2 className="mb-4">Academic Structure Management</h2>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Class</div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Class Name</th>
                  <th scope="col" style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((item, index) => (
                  <tr key={index}>
                    <td>{item.class}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setItemToDelete(item);
                          setDeletionType('class');
                        }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
                <tr className="table-secondary">
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '50%' }}
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Class name"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddClass}
                    >
                      <i className="bi bi-plus-circle"></i> Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Stream</div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Stream Name</th>
                  <th scope="col" style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {streams.map((item, index) => (
                  <tr key={index}>
                    <td>{item.stream}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setItemToDelete(item);
                          setDeletionType('stream');
                        }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
                <tr className="table-secondary">
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '50%' }}
                      value={newStreamName}
                      onChange={(e) => setNewStreamName(e.target.value)}
                      placeholder="Stream name"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddStream}
                    >
                      <i className="bi bi-plus-circle"></i> Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmationPopup
        visible={!!itemToDelete}
        itemName={itemToDelete?.class || itemToDelete?.stream}
        entityLabel={deletionType}
        onConfirm={async () => {
          if (deletionType === 'class') {
            await handleDeleteClass(itemToDelete.id);
          } else if (deletionType === 'stream') {
            await handleDeleteStream(itemToDelete.id);
          }
          setItemToDelete(null);
          setDeletionType('');
        }}
        onCancel={() => {
          setItemToDelete(null);
          setDeletionType('');
        }}
      />
    </>
  );
}

export default AdminAcademicStructure;
