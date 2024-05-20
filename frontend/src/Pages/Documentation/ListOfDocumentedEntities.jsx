import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Browsing.css';

function ListOfDocumentedEntities() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await axios.get('http://localhost:5000/get-tables');
        const tableNames = response.data.tables;
        setTables(tableNames);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    }

    fetchTables();
  }, []);

  const handleSelectTable = async (selectedTable) => {
    try {
      setSelectedTable(selectedTable);
      const response = await axios.post('http://localhost:5000/read-data', { tableName: selectedTable });
      setTableData(response.data.data);
    } catch (error) {
      console.error('Error fetching vocabulary data:', error);
      setTableData([]);
    }
  };

  const handleEdit = (rowIndex) => {
    console.log('Edit row:', rowIndex);
  };

  const handleDelete = async (rowIndex) => {
    try {
      const rowId = tableData[rowIndex].ID; // Adjust this to match the primary key field name in your table
      await axios.delete(`http://localhost:5000/delete2-row/${selectedTable}/${rowId}`);
      
      // Remove the deleted row from the state
      const updatedTableData = tableData.filter((_, index) => index !== rowIndex);
      setTableData(updatedTableData);

      console.log('Delete row:', rowIndex);
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  return (
    <div style={{ marginBottom: '20px', paddingTop: '50px', paddingLeft: '10px', gap: '10px' }}>
      <h1>List Of Documented Entities</h1>
      <div>
        <b>Select Entity: </b>
        <select onChange={(e) => handleSelectTable(e.target.value)}>
          <option value="">Select an Entity:</option>
          {tables.map((table, index) => (
            <option key={index} value={table}>{table}</option>
          ))}
        </select>
      </div>
      {selectedTable && selectedTable.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                {/* Map column names as table headers */}
                {tableData.length > 0 && Object.keys(tableData[0]).map((columnName, index) => (
                  <th key={index}>{columnName}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Map tableData to create rows */}
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Map values in each row to create cells */}
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex}>{value}</td>
                  ))}
                  {/* Add edit and delete buttons for each row */}
                  <td>
                    <button onClick={() => handleEdit(rowIndex)}>Edit</button>
                    <button onClick={() => handleDelete(rowIndex)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListOfDocumentedEntities;
