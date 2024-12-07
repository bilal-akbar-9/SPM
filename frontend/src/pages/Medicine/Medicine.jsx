import React, { useState } from 'react';
import AddMedicineButton from './AddMedicineButton';
import './Medicine.css';

const Medicine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol', type: 'Painkiller' },
    { id: 2, name: 'Amoxicillin', type: 'Antibiotic' },
    { id: 3, name: 'Ibuprofen', type: 'Anti-inflammatory' },
    { id: 4, name: 'Cetirizine', type: 'Antihistamine' },
  ]);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/medicines", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const medicines = await response.json(); // Parse response as JSON
      return medicines; // Return the fetched medicines
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
      return []; // Return an empty array in case of an error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMedicines();
      setMedicines(data);
    };

    fetchData();
  }, []);
  

  const filteredMedicines = medicines.filter((medicine) => {
    return (
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterOption ? medicine.type === filterOption : true)
    );
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div>
      <h1>Medicine Search and Filter</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for medicine..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginRight: '10px', padding: '5px', width: '200px' }}
      />

      {/* Dropdown Filter */}
      <select
        value={filterOption}
        onChange={handleFilterChange}
        style={{ padding: '5px', width: '150px' }}
      >
        <option value="">All Types</option>
        <option value="Painkiller">Painkiller</option>
        <option value="Antibiotic">Antibiotic</option>
        <option value="Anti-inflammatory">Anti-inflammatory</option>
        <option value="Antihistamine">Antihistamine</option>
      </select>
  
      {/* Add Medicine Button */}
      <div className="ActionButton">
              <AddMedicineButton />&nbsp;
            </div>

      {/* Medicine List */}
      <div style={{ marginTop: '20px' }}>
        <h2>Medicines</h2>
        {filteredMedicines.length > 0 ? (
          <ul>
            {filteredMedicines.map((medicine) => (
              <li key={medicine.id}>
                {medicine.name} - <i>{medicine.type}</i>
              </li>
            ))}
          </ul>
        ) : (
          <p>No medicines found</p>
        )}
      </div>
    </div>
  );
};
//fetch for the meds and then display them in medicineTable
export default Medicine;