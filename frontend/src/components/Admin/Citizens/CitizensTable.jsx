import React, { useState } from "react";
import { Search, Plus, Eye, Edit2, Trash2 } from "lucide-react";
import "../../../assets/styles/citizensTable.scss";
const CitizensTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const citizens = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      idNumber: "001234567890",
      dateOfBirth: "1/15/1990",
      location: "Hà Nội",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Trần Thị B",
      idNumber: "001234567891",
      dateOfBirth: "5/20/1992",
      location: "TP. Hồ Chí Minh",
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "Lê Văn C",
      idNumber: "001234567892",
      dateOfBirth: "3/10/1988",
      location: "Đà Nẵng",
      status: "ACTIVE",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      idNumber: "001234567893",
      dateOfBirth: "7/25/1995",
      location: "Hà Nội",
      status: "ACTIVE",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      idNumber: "001234567894",
      dateOfBirth: "12/5/1991",
      location: "Cần Thơ",
      status: "ACTIVE",
    },
    {
      id: 6,
      name: "Võ Thị F",
      idNumber: "001234567895",
      dateOfBirth: "9/18/1993",
      location: "TP. Hồ Chí Minh",
      status: "ACTIVE",
    },
    {
      id: 7,
      name: "Đặng Văn G",
      idNumber: "001234567896",
      dateOfBirth: "4/22/1989",
      location: "Hải Phòng",
      status: "ACTIVE",
    },
    {
      id: 8,
      name: "Bùi Thị H",
      idNumber: "001234567897",
      dateOfBirth: "11/30/1994",
      location: "Huế",
      status: "ACTIVE",
    },
  ];

  const filteredCitizens = citizens.filter(
    (citizen) =>
      citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.idNumber.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCitizens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCitizens = filteredCitizens.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleView = (id) => {
    console.log("View citizen:", id);
  };

  const handleEdit = (id) => {
    console.log("Edit citizen:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete citizen:", id);
  };

  return (
    <div className="citizens-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Citizens</h1>
          <p className="page-subtitle">
            Manage citizen records and information
          </p>
        </div>
        <button className="add-btn">
          <Plus size={20} />
          Add Citizen
        </button>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div className="card-header-text">
            <h2 className="card-title">Citizen Records</h2>
            <p className="card-subtitle">
              View and manage all citizen information
            </p>
          </div>
        </div>

        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or ID number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="citizens-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID Number</th>
                <th>Date of Birth</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCitizens.map((citizen) => (
                <tr key={citizen.id}>
                  <td className="name-cell">{citizen.name}</td>
                  <td className="id-cell">{citizen.idNumber}</td>
                  <td>{citizen.dateOfBirth}</td>
                  <td>{citizen.location}</td>
                  <td>
                    <span className="status-badge">{citizen.status}</span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleView(citizen.id)}
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(citizen.id)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(citizen.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-left">
            <div className="items-per-page">
              <span className="items-label">Show</span>
              <select
                className="items-select"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="items-label">entries</span>
            </div>
            <div className="pagination-info">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredCitizens.length)} of{" "}
              {filteredCitizens.length} entries
            </div>
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              className="pagination-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizensTable;
