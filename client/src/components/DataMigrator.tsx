import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import * as XLSX from 'xlsx';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Flex, Space, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export interface DataMigratorCol {
    headerName: string;
    field: string;
    type: DataMigratorColTypes;
}

export enum DataMigratorColTypes {
    string = "string",
    number = "number",
    date = "date",
    boolean = "boolean",
}

const DataMigrator = ({ columns, onSave }: { columns: DataMigratorCol[], onSave: (data: any[]) => void }) => {
  const [rowData, setRowData] = useState<any[]>([]);

  // Function to download the Excel template
  const downloadTemplate = () => {
    const worksheetData = [columns.map(col => col.headerName)];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'template.xlsx');
  };

  // Function to handle file upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Parse data based on column types
        const parsedData = jsonData.map((row: any) => {
          const parsedRow: any = {};
          columns.forEach((col) => {
            let value = row[col.headerName];
            if (col.type === DataMigratorColTypes.date && typeof value === 'number') {
              // Convert from Excel date format to JavaScript Date
              const excelEpoch = new Date(Date.UTC(1899, 11, 30));
              parsedRow[col.field] = new Date(excelEpoch.getTime() + value * 86400000);
            } else {
              parsedRow[col.field] = value;
            }
          });
          return parsedRow;
        });

        console.log(parsedData);
        setRowData(parsedData);
        message.success('File uploaded successfully!');
      }
    };
    reader.readAsArrayBuffer(file);
    // Prevent upload from automatically being processed
    return false;
  };

  // Function to handle saving the data
  const handleSave = () => {
    onSave(rowData);
    setRowData([]); // Clear the table data after saving
  };

  // Define column definitions for Ag-Grid
  const columnDefs = columns.map((col) => ({
    headerName: col.headerName,
    field: col.field,
    valueGetter: col.field.includes('.')
      ? (params) => {
          const value = params.data[col.field];
          return value;
        }
      : null,
    valueFormatter: (params) => {
      const value = params.value;
      switch (col.type) {
        case DataMigratorColTypes.date:
          return value ? new Date(value).toLocaleDateString() : '';
        case DataMigratorColTypes.boolean:
          return value ? 'Yes' : 'No';
        default:
          return value;
      }
    },
  }));

  return (
    <div className="excel-upload">
      <Space align="center">
        
        <Upload
          accept=".xlsx, .xls"
          beforeUpload={handleFileUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Excel File</Button>
        </Upload>
        <Button onClick={handleSave} type="primary" disabled={rowData.length === 0}>
          Save
        </Button>
      </Space>
      {/* <div className="ag-theme-alpine" style={{ height: 400, width: '100%', marginTop: '16px' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
        />
      </div> */}
      <Flex className="mt-4" justify='end'>
        <Button onClick={downloadTemplate} icon={<FontAwesomeIcon icon={faDownload} />}>
            Download Excel Template
        </Button>
      </Flex>
    </div>
  );
};

export default DataMigrator;
