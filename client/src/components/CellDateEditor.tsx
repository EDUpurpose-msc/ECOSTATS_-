import React, { useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const CellDateEditor = (props) => {
  const { value, onValueChange } = props;
  const datePickerRef = useRef<any>(null);

  useEffect(() => {
    // Focus on the date picker when the editor is opened
    if (datePickerRef.current) {
      datePickerRef.current.focus();
    }
  }, []);

  return (
    <DatePicker
      ref={datePickerRef}
      defaultValue={moment(value)}
      format="YYYY-MM-DD"
      onChange={(date, dateString) => {
        // Handle the change and pass the new value
        onValueChange(dateString); // Send the date as 'YYYY-MM-DD'
      }}
    />
  );
};

export default CellDateEditor;
